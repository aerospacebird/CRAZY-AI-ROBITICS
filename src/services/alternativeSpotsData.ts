/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TravelPlace } from '../types/travel';

export interface AlternativeOption {
  reasonType: 'RAIN_INDOOR' | 'LONG_WAITING' | 'HIDDEN_LOCAL' | 'SCENIC_VIEW';
  reasonLabel: string;
  reasonBadgeColor: string;
  place: TravelPlace;
}

export const ALTERNATIVE_SPOTS_PRESETS: Record<string, AlternativeOption[]> = {
  // 제주 대체 스팟
  '제주': [
    {
      reasonType: 'RAIN_INDOOR',
      reasonLabel: '☔ 우천/강풍 안심 실내 코스',
      reasonBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      place: {
        id: 'alt-jeju-indoor-1',
        name: '빛의 벙커 (Bunker de Lumières)',
        category: 'ATTRACTION',
        categoryLabel: '몰입형 미디어아트',
        description: '옛 국가 통신시설 벙커를 개조하여 클림트와 고흐의 명화를 빛과 음악으로 재해석한 대형 실내 미디어 전시관',
        timeSlot: '14:00 - 15:30',
        address: '제주 서귀포시 성산읍 고성리 2039-22',
        lat: 33.4385,
        lng: 126.8998,
        estimatedCost: 18000,
        recommendedBy: '안전·기상케어 에이전트',
        specialTip: '우천 시에도 쾌적하며, 웅장한 클래식 선율과 함께 걷는 최고의 힐링 공간',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    },
    {
      reasonType: 'LONG_WAITING',
      reasonLabel: '⏱️ 웨이팅 없는 현지인 노포 대체',
      reasonBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      place: {
        id: 'alt-jeju-local-1',
        name: '가시아방국수 (신산 본점)',
        category: 'RESTAURANT',
        categoryLabel: '제주 고기국수/돔베고기',
        description: '진하고 구수한 돼지사골 육수와 부드러운 돔베고기가 푸짐하게 올라간 성산 대표 고기국수 맛집',
        timeSlot: '12:00 - 13:00',
        address: '제주 서귀포시 성산읍 섭지코지로 10',
        lat: 33.4471,
        lng: 126.9082,
        estimatedCost: 24000,
        recommendedBy: '미식가 에이전트',
        specialTip: '비빔국수와 돔베고기 세트 추천, 회전율이 빨라 대기 시간이 매우 짧음',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    },
    {
      reasonType: 'SCENIC_VIEW',
      reasonLabel: '☕ 한적한 프라이빗 오션뷰 카페',
      reasonBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      place: {
        id: 'alt-jeju-cafe-1',
        name: '울트라마린 제주 (판포포구)',
        category: 'CAFE',
        categoryLabel: '노키즈 감성 오션뷰',
        description: '판포포구의 거친 파도와 차귀도 일몰을 액자 같은 통창으로 조용히 감상할 수 있는 스페셜티 커피 바',
        timeSlot: '15:30 - 17:00',
        address: '제주 제주시 한경면 일주서로 4611',
        lat: 33.3644,
        lng: 126.1963,
        estimatedCost: 20000,
        recommendedBy: '풍류시객 에이전트',
        specialTip: '플랫화이트와 바닐라빈 파운드케이크 추천, 일몰 30분 전 착석 권장',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    }
  ],

  // 경주 대체 스팟
  '경주': [
    {
      reasonType: 'RAIN_INDOOR',
      reasonLabel: '☔ 비 올 때 쾌적한 실내 역사관',
      reasonBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      place: {
        id: 'alt-gyeongju-indoor-1',
        name: '국립경주박물관 신라미술관 & 성덕대왕신종',
        category: 'ATTRACTION',
        categoryLabel: '국립 역사박물관',
        description: '신라 천년의 금관과 불교 조각, 에밀레종의 은은한 종소리를 감상할 수 있는 고품격 실내 문화 공간',
        timeSlot: '14:00 - 16:00',
        address: '경북 경주시 일정로 186',
        lat: 35.8296,
        lng: 129.2285,
        estimatedCost: 0,
        recommendedBy: '문화유산 해설사',
        specialTip: '상설전시 무료 입장, 에밀레종 타종 녹음 시간(매시 정각)에 맞춰 방문 추천',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    },
    {
      reasonType: 'LONG_WAITING',
      reasonLabel: '⏱️ 황리단길 웨이팅 대체 고즈넉 한옥',
      reasonBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      place: {
        id: 'alt-gyeongju-local-1',
        name: '토함혜 율동 본점 (보리밥 & 갈비찜)',
        category: 'RESTAURANT',
        categoryLabel: '신라 전통 한정식',
        description: '청국장, 갈비찜, 보리밥 삼합의 조화가 일품인 30년 전통의 경주 현지인 추천 노포 식당',
        timeSlot: '12:30 - 13:40',
        address: '경북 경주시 숲머리길 159',
        lat: 35.8582,
        lng: 129.2591,
        estimatedCost: 38000,
        recommendedBy: '미식가 에이전트',
        specialTip: '황리단길의 번잡함 없이 너른 전용 주차장과 한옥 정원을 갖추어 가족/연인에게 최적',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    },
    {
      reasonType: 'SCENIC_VIEW',
      reasonLabel: '☕ 보문호수 벚나무 숲 힐링 카페',
      reasonBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      place: {
        id: 'alt-gyeongju-cafe-1',
        name: '아덴 (Aden) 보문호수점',
        category: 'CAFE',
        categoryLabel: '호수 파노라마 한옥 카페',
        description: '보문호수의 잔잔한 물결을 파노라마로 조망하는 대형 한옥 베이커리 카페로 갓 구운 긍정빵과 커피',
        timeSlot: '16:00 - 17:30',
        address: '경북 경주시 보문로 424-34',
        lat: 35.8459,
        lng: 129.2828,
        estimatedCost: 22000,
        recommendedBy: '풍류시객 에이전트',
        specialTip: '야외 테라스 석에서 보문호 산책로를 감상하며 경주달빛빵 시식 추천',
        gisVerified: true,
        gisAccuracy: '100% 정밀'
      }
    }
  ]
};

export function getAlternativeSpotsForDestination(destination: string): AlternativeOption[] {
  if (destination.includes('경주')) {
    return ALTERNATIVE_SPOTS_PRESETS['경주'];
  }
  return ALTERNATIVE_SPOTS_PRESETS['제주'];
}
