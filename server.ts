/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getLocalExpertFallback } from './src/services/localExpertData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Server-side Gemini API route for Local Expert Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { text, destination = '대한민국', clientName = '여행자', style = [] } = req.body || {};

      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey.trim().length > 10) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemInstruction = `당신은 대한민국 대표 AI 여행사 '길벗 AI 여행사'의 ${destination} 현지 전담 로컬 마스터이자 24시간 안전/비상대응관입니다.
고객명: ${clientName}
여행 스타일: ${Array.isArray(style) ? style.join(', ') : style}

고객의 질문에 대해:
1. 친절하고 신뢰감 있는 현지 토박이 말투로 답변하세요.
2. 실용적인 로컬 팁(현지인 식사 에티켓, 주문 요령, 방문 시간대 추천 등)을 포함하세요.
3. 응급 상황이나 안전 관련 질문에는 즉각 119/112 및 해당 지역 주요 권역응급의료센터 안내를 명확하게 제공하세요.
4. 답변은 가독성 높은 한국어로 3~5문장 내외로 명확하게 작성하세요.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `${systemInstruction}\n\n고객 질문: ${text}`,
          });

          const reply = response.text?.trim();
          if (reply) {
            return res.json({ reply, source: 'gemini' });
          }
        } catch (genErr) {
          console.warn('Gemini generateContent call failed on server, using local expert fallback:', genErr);
        }
      }

      // Safe, intelligent fallback if API key is not configured or model returned error
      const reply = getLocalExpertFallback(text, destination);
      return res.json({ reply, source: 'local-expert' });
    } catch (err) {
      console.error('Server error in /api/chat:', err);
      const fallback = getLocalExpertFallback(req.body?.text || '', req.body?.destination || '');
      return res.json({ reply: fallback, source: 'fallback' });
    }
  });

  // Server-side Gemini API route for Poetic Culinary Reviews
  app.post('/api/poetry', async (req, res) => {
    try {
      const { place } = req.body || {};
      if (!place || !place.name) {
        return res.status(400).json({ error: 'Place information required' });
      }

      const isCafe = place.category === 'CAFE';
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey.trim().length > 10) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `당신은 길벗 AI 여행사의 특별 큐레이터 '풍류시객'입니다.
다음 ${isCafe ? '카페' : '음식점'}의 공간과 미식 정취를 담은 감성 수필(3~4문장)과 어울리는 시(4~5행)를 작성해주세요.

장소:
- 이름: ${place.name}
- 분류: ${place.categoryLabel || (isCafe ? '카페' : '음식점')}
- 주소: ${place.address || ''}

반드시 아래 JSON 형식으로만 응답해주세요:
{
  "foodOrDrink": "대표 메뉴 또는 음료명",
  "essay": "3~4문장의 서정적 수필",
  "poemTitle": "시 제목",
  "poemVerses": ["시 1행", "시 2행", "시 3행", "시 4행"]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          const jsonText = response.text?.trim() || '';
          const parsed = JSON.parse(jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

          return res.json({
            placeId: place.id,
            placeName: place.name,
            category: isCafe ? 'CAFE' : 'RESTAURANT',
            foodOrDrink: parsed.foodOrDrink || (isCafe ? '핸드드립 원두' : '향토 특선'),
            essay: parsed.essay,
            poemTitle: parsed.poemTitle,
            poemVerses: parsed.poemVerses,
            authorAgent: '풍류시객'
          });
        } catch (gemErr) {
          console.warn('Server poetry generation fallback triggered:', gemErr);
        }
      }

      // Default literary fallback
      return res.json({
        placeId: place.id,
        placeName: place.name,
        category: isCafe ? 'CAFE' : 'RESTAURANT',
        foodOrDrink: isCafe ? '시그니처 드립커피' : '정갈한 제철 향토상',
        essay: isCafe
          ? `통유리 너머로 쏟아지는 햇살 아래, 갓 내린 커피 향이 공간을 채웁니다. 잔을 기울일 때마다 여독이 녹아내리고, 나그네의 마음에 잔잔한 여운이 머뭅니다.`
          : `이 고장의 신선한 식재료가 정성 어린 손끝을 거쳐 정갈한 한 상으로 완성되었습니다. 한술 가득 감도는 깊은 맛에서 여행의 따스한 온기를 느낍니다.`,
        poemTitle: isCafe ? '찻잔에 머무는 풍경' : '그리운 맛의 노래',
        poemVerses: isCafe
          ? ['흘러가는 구름 한 점 창가에 걸리고', '잔 속에서 피어나는 원두의 온기', '시간마저 쉬어가는 고요 속에서', '또 하나의 쉼표를 마음에 새긴다.']
          : ['소박한 질그릇에 담긴 계절의 정성', '한 숟가락 감도는 깊고 그윽한 세월', '나그네의 주린 여정이 채워지니', '먼 길 찾아온 보람이 꽃처럼 피어난다.'],
        authorAgent: '풍류시객'
      });
    } catch (err) {
      console.error('Poetry endpoint error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`길벗 AI 여행사 서버 가동 중: http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
