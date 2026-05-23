import { CourseSpot } from '../types';

/**
 * High-fidelity arrays of recommended spots categorized by theme.
 * This structure is ready to be easily synced or fetched from a real backend API in the future.
 */

interface ThemeSpotPool {
  restaurants: { name: string; rating: number; image: string; desc: string; memo: string; cost: string }[];
  activities: { name: string; rating: number; image: string; desc: string; memo: string; cost: string }[];
  stays: { name: string; rating: number; image: string; desc: string; memo: string; cost: string }[];
}

export const THEME_SPOTS: Record<number, ThemeSpotPool> = {
  1: {
    // Activity Theme
    restaurants: [
      {
        name: '성산포 소담 해장국',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '신선한 로컬 해산물이 듬뿍 들어가 하루의 에너지를 든든하게 채우는 아침 식사!',
        memo: '인기 아침 밥집으로 9시 30분 전 방문 시 여유롭게 즐기기 좋습니다.',
        cost: '14,000원'
      },
      {
        name: '정든 전복 해물 국수',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '쫄깃한 국수 면발 위에 싱싱한 전복이 듬뿍 올라간 별미 국수!',
        memo: '양념장을 기호에 맞게 넣어 비벼 드세요.',
        cost: '15,000원'
      },
      {
        name: '아침을 여는 성게 미역 수제비',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '녹아내릴 듯 부드러운 성게알과 미역이 조화로운 담백하고 시원한 수제비 국물.',
        memo: '청양고추를 살짝 곁들이면 칼칼하며 맛있습니다.',
        cost: '16,000원'
      },
      {
        name: '한라산 흑돼지 참숯 구이',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '액티비티 후 완벽하게 단백질을 충전할 수 있는 고품격 오겹살과 멜젓의 궁합.',
        memo: '테이블링 앱을 설치해 비대면 사전 대기를 장려합니다.',
        cost: '32,000원'
      },
      {
        name: '파이어 수제 전복 피스트 버거',
        rating: 4.6,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '직접 구운 전복 패티와 통전복이 통째로 들어간 시그니처 단백질 버거.',
        memo: '감자튀김과 세트로 즐기면 훨씬 푸짐합니다.',
        cost: '18,000원'
      },
      {
        name: '불타는 통갈치 양념 조림',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '긴 철판에 대형 통갈치와 조개, 야채를 깔고 매콤달콤한 수제 비법 양념장으로 맛을 낸 조림.',
        memo: '갈치를 덜어서 국물을 밥에 쓱쓱 비벼 양념과 맛을 느끼세요.',
        cost: '45,000원'
      },
      {
        name: '탐라 오션 모둠회 스탠다드',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '갓 잡아올려 쫄깃한 제철 모둠회와 한 방에 속을 시원하게 조율할 특제 매운탕.',
        memo: '일몰을 조망하기에 탁월한 명가이므로 테라스 선점을 추천합니다.',
        cost: '40,000원'
      },
      {
        name: '철판 낙지 낙지볶음 불쇼식당',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '강렬한 불길로 단숨에 볶아내 불맛이 흘러넘치는 매콤 통낙지 철판 볶음.',
        memo: '소면사리를 마지막에 철판에 비벼 드시면 환상적입니다.',
        cost: '18,000원'
      },
      {
        name: '활화산 돌판 바비큐 불고기',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlomou_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '달궈진 제주 현무암 돌판 위에서 지글지글 소리를 내며 익어가는 특제 양념 소고기 불고기.',
        memo: '마지막 볶음밥 하트 모형이 시그니처 서비스입니다.',
        cost: '22,000원'
      }
    ],
    activities: [
      {
        name: '짚라인 & 포레스트 오프로드',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '짜릿한 속도감과 잊지 못할 희열을 안겨주는 아웃도어 스릴 체험!',
        memo: '안전 장비 착용 필수 및 대기 발생 시 주변 전망 구경하기.',
        cost: '45,000원'
      },
      {
        name: '카트 레이싱 스피드 파크',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '고성능 카트에 몸을 싣고 지면을 스치듯 달리는 서킷 짜릿한 레이싱 패키지.',
        memo: '안전 가이드를 필독하시고 충돌 방지에 각별히 유의하세요.',
        cost: '28,000원'
      },
      {
        name: '오션 서핑 액티브 세션',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '시원한 에메랄드빛 오션 선상 위에서 물결을 가르는 서핑 강습 및 자유 보딩 체험.',
        memo: '썬크림 필수, 수건과 여벌의 옷을 수반하십시오.',
        cost: '50,050원'
      },
      {
        name: '패러글라이딩 하늘 오름 투어',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '아름다운 천연 자연 경관을 완전히 색다른 높이와 속도로 체험하며 날아봅니다.',
        memo: '기상 상황에 영향을 받으므로 방문 직전 유선 재확인을 필히 권합니다.',
        cost: '95,000원'
      },
      {
        name: '해양 인피니티 익스트림 제트보트',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '물살을 가르며 격정적인 360도 턴을 거치며 극단적인 속도감을 만끽하는 익스트림 제트 보트.',
        memo: '우의가 지급되나 물방울이 많이 튀므로 여분의 건조 옷을 가져가세요.',
        cost: '35,000원'
      },
      {
        name: '동굴 카약 미스테리 탐험',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '비밀스럽게 펼쳐진 수중 동굴을 비밀 카약을 조율해 등불과 함께 사색 모험을 펼치는 경험.',
        memo: '안전 장갑 및 랜턴 장비 무상 구비 완료.',
        cost: '30,000원'
      }
    ],
    stays: [
      {
        name: '어드벤처 독채 스파 풀빌라 스테이',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '온종일 쏟아부은 에너지를 완벽한 스파와 아늑한 조명 밑에서 휴식할 수 있는 최상의 테마 펜션.',
        memo: '오후 4시 정시 체크인이 개시되며 야외 온수 수영장 가동이 무상으로 보장됩니다.',
        cost: '240,000원'
      },
      {
        name: '클리프 인피니티 오션 럭셔리 리조트',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '절벽 끝자락에 세워져 바다 수평선과 이어진 초대형 온수 인피니티 풀을 구비한 초호화 리조트.',
        memo: '체크인은 오후 3시이며 로비 웰컴 칵테일 2잔이 지급됩니다.',
        cost: '380,000원'
      },
      {
        name: '포레스트 힐 프리미엄 돔 글램핑',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '울창한 편백 숲 한가운데 자리한 현대식 프리미엄 개인 돔 구조의 낭만 글램핑 휴식처.',
        memo: '개인 바비큐 장비 무상 세팅 및 캠프파이어 장작 무료 지급.',
        cost: '180,000원'
      }
    ]
  },
  2: {
    // Insta Theme
    restaurants: [
      {
        name: '파스텔 핑크 오션 브런치 홀',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '햇살 가득 드리우는 플라워 아치 아래서 즐기는 로맨틱한 파스텔 데이지 브런치 세트.',
        memo: '입구 명문 포토존 아치에서 한 장 남기고 착석하십시오.',
        cost: '18,500원'
      },
      {
        name: '선라이즈 가든 디저트 브런치',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '싱그러운 야외 데이지 꽃밭 정원에서 즐기는 에그베네딕트와 수제 마카롱 패키지.',
        memo: '오전 10시 이전 입장 시 정원 한가운데 최고 포토 스팟 좌석 선점 가능.',
        cost: '19,000원'
      },
      {
        name: '모닝 에메랄드 플라워 푸드',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '식용 꽃으로 데코레이션되어 한 폭의 회화 같은 오가닉 파스타 대가 브런치 세션.',
        memo: '카메라 렌즈를 미리 닦아 아름다운 색채를 오롯이 담으세요.',
        cost: '21,000원'
      },
      {
        name: '블룸 통유리 포레스트 파스타',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '싱그러운 숲이 한눈에 보이는 통유리 속 힐링 가득 뇨끼와 아보카도 바질 식욕 플레이팅.',
        memo: '좌석 예약이 필수이므로 당일 오전에 체크해두시면 더욱 완벽합니다.',
        cost: '22,000원'
      },
      {
        name: '옐로우 선샤인 바비 파이 키친',
        rating: 4.6,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '화려한 비주얼을 가진 미국 홈스타일 오르골 파이와 빈티지 인테리어의 명소.',
        memo: '인형의 집 분위기로 연출된 메인 소파에서 추억을 필히 사진으로 남기세요.',
        cost: '16,000원'
      },
      {
        name: '오션 라이트 글래스 플레이트',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '해안 절벽가 통유리 너머로 부서지는 파도를 조망하며 즐기는 화이트 트러플 관자 요리.',
        memo: '노을 질 무렵 방문하면 가장 멋진 그라데이션 광원을 확보합니다.',
        cost: '34,000원'
      },
      {
        name: '루프탑 캐들라이트 로맨스 다이닝',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '야경과 부드러운 하우스 와인이 마법처럼 만나는 하이엔드 테라스 파인 다이닝.',
        memo: '당일 야간 테이블 선점 경쟁이 드높은 편이니 점심 드실 때 사전 통화하십시오.',
        cost: '45,000원'
      },
      {
        name: '모던 화이트 가든 프렌치 레스토랑',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '기하학적인 올화이트 정원 구조 안에서 즐기는 수제 프렌치 스테이크와 퐁당쇼콜라 디저트.',
        memo: '드레스코드를 화이트나 아이보리 무드로 맞추면 더욱 어울립니다.',
        cost: '52,000원'
      },
      {
        name: '석양 어나더 오색 바비큐 키친',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMV7vdrkKUtFt-mkvi50CqUDSC0kJouzQqWzQVIPKHF8yx6D9oxXWYQXlbz8nDIpyxAG_Pv8mDmYVbxx2zUScXqh5sLWonvdKg-iQJKyFXJtG7w1vuM0ifWuTtTVAtSNL8AVfC48J4yXzl5SdG0CGP5evCvPr3bG6syYKig4-XNCfWcCsqHi34RSMg65JeSxp8JSBVcyGJJuVDGTE6ifFCMamRobhaKbD7w4T8CFNu3nySDDQ2KGVFE74wQv1OpSE1YL2f7u5dD0P-',
        desc: '다섯 가지 천연 허브 솔트로 겉바속촉 시어링한 한라산 흑바비큐 플래터와 무알콜 오션 에이드.',
        memo: '모닥불 주변 빈백 릴렉스존 소파를 적극 사수하세요.',
        cost: '38,000원'
      }
    ],
    activities: [
      {
        name: '감성 도예 & 수채화 원데이 클래스',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '직접 손끝으로 빚어 내어 소중한 소품으로 가져가는 예술 가득 도자 공예 힐링 시간 🎨',
        memo: '앞치마 세트가 무료 준비되어 마음에 드는 가벼운 차림으로 가시면 됩니다.',
        cost: '35,000원'
      },
      {
        name: '나만의 감성 향수 조향 공방',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '수십 종류의 천연 에센셜 오일을 오르골 시음하며 나만의 감성 향수를 조율하는 시크릿 소품 메이킹.',
        memo: '시그니처 투명 보틀 병에 감성 문구를 각인해 드립니다.',
        cost: '40,000원'
      },
      {
        name: '빈티지 네온 무드등 수제 세션',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '원하는 감명 깊은 문구 도안이나 캐릭터를 형형색색 와이어 아크릴을 조율해 직접 완성하는 실내 취침 램프 클래스.',
        memo: '완성 후 불을 끄고 무드등 작동 스냅을 남겨보세요.',
        cost: '38,000원'
      },
      {
        name: '오션 갈대밭 인생 사색 승마 수티',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '석양과 자연을 오롯이 액자에 담아 평생 남을 프로필 필카 사진을 한가득 획득하는 순간.',
        memo: '스마트폰 삼각대를 미리 구비해 두시면 한결 유연한 촬영 구도가 나옵니다.',
        cost: '30,000원'
      },
      {
        name: '핑크뮬리 들판 컬러풀 인생 갤러리',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '전문 스냅 사진 작가가 밀착 배정되어 인스타 메인을 가득 구색할 핑크뮬리 야외 정취 세션 촬영.',
        memo: '컬러풀한 우산 및 무상 레트로 소품 지참 제공.',
        cost: '45,000원'
      },
      {
        name: '요트 세일링 프라이빗 감성 석양',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '초대형 럭셔리 크루즈 요트에 탑승해 선상 위에서 치즈 핑거푸드, 와인과 함께 나누는 선셋 갈라 투어.',
        memo: '안전 구명조끼가 지급되니 안심하고 오션뷰를 만끽하십시오.',
        cost: '60,005원'
      }
    ],
    stays: [
      {
        name: '미니멀 어라운드 디자이너 부티크 스테이',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '통유리 안의 아늑한 월풀과 세련된 마샬 스피커 무드가 가득 감도는 감성 끝판왕 디자이너 스테이.',
        memo: '프리미엄 웰컴 카라멜과 원두 드립백 2세트가 무상 배포 제공됩니다.',
        cost: '210,000원'
      },
      {
        name: '파파 아뜰리에 코지 하우스 앤 스파',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '동화적인 따스한 인테리어와 야외 핀란드식 전용 사우나를 갖춘 프랑스풍 모성 감성 홈스테이.',
        memo: '오후 3시 반 체크인이 제공되며 마당의 모닥불 무료 장작 1세트 구비 완료.',
        cost: '230,000원'
      },
      {
        name: '헤이 모먼츠 디자이너 감성 숙소',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '모듈형 조명 기구들과 턴테이블 바이닐 컬렉션이 구색을 이루어 젊은 감성을 제대로 사로잡는 펜션.',
        memo: '웰컴 드링크 사과 스파클링 에이드 2병 지급.',
        cost: '190,000원'
      }
    ]
  },
  3: {
    // Foodie Theme
    restaurants: [
      {
        name: '수제 명인 보말수제비 무지개옥',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '속을 끝장나게 달래줄 명품 보말 육수 비법 정성 칼국수와 전복 슬라이스 세트.',
        memo: '국물이 깊으니 다 마시기 전에 밥 소량을 말아 드시는 것을 추천 및 권유합니다.',
        cost: '13,050원'
      },
      {
        name: '해녀 해물 뚝배기 원조 맛본관',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '해녀가 직접 당일 아침 캐낸 돌문어와 전복을 산더미처럼 쌓아 올린 전설의 향토 뚝배기 전골.',
        memo: '꽃게 다리는 뜨거우니 미리 건져서 살을 골라 드십시오.',
        cost: '19,500원'
      },
      {
        name: '성게 잔치 칼국수 천사면',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '신선한 노란 성게알이 아낌없이 투척된 고소하고 맑은 고품격 손칼국수 정식.',
        memo: '김가루를 적당히 얹어야 느끼하다는 생각이 스치지 않습니다.',
        cost: '15,000원'
      },
      {
        name: '전설 명가 갈치조림과 옥돔정식',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '속을 확 자극하는 감칠맛의 끝판왕이자 사르르 녹아내리는 매콤 고소한 통갈치조림.',
        memo: '가운데 굵은 뼈대가 미리 다 해체 발림 공정 가공되어 간편히 식사에 매장 집중 가능합니다.',
        cost: '28,000원'
      },
      {
        name: '생선회 초밥 명인 다이닝 세트',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '초밥 부문 명인 셰프가 선사하는 자연산 활어 초밥 코스와 모밀소바 세션.',
        memo: '생강 절임을 간장에 살짝 적신 후 회 표면에 솔처럼 발라 즐겨보세요.',
        cost: '45,000원'
      },
      {
        name: '산방산 고품 한우 육회 수제비',
        rating: 4.6,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '최상등급 거세한우 육회의 쫄깃함을 그대로 간직한 채 매콤 산뜻한 소스로 버무려 낸 수제비 물회.',
        memo: '소면 한 뭉치가 국수에 함께 부상되어 무료 서빙 제공됩니다.',
        cost: '24,000원'
      },
      {
        name: '프리미엄 볏짚 에이징 흑돼지 참맛',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '진공 수침 숙성을 거쳐 차원이 다른 극단적 육즙 포텐셜과 쫄깃하고 담백하고 부드러운 목살.',
        memo: '특제 멜젓 소스를 약한 불에 뜨겁게 조여 고기를 흠뻑 찍어 드십시오.',
        cost: '34,000원'
      },
      {
        name: '붉은 대형 랍스터 허니 버터구이',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '치즈와 버터를 아낌없이 도포한 통랍스터 그릴 구이와 통감자 오븐 구이 플레이트.',
        memo: '집게발에 가득 찬 짭짤 매콤한 살 코스부터 즐기는 것을 조언합니다.',
        cost: '68,000원'
      },
      {
        name: '한라 고사리 듬뿍 삼겹 전골구이',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '야생 고사리와 김치, 흑돼지 목살을 철판 전골에 부어 자작이 졸여 드시는 명인 요리.',
        memo: '공깃밥을 전골 마지막 국물에 볶아 드시면 풍성한 미식이 완료됩니다.',
        cost: '21,050원'
      }
    ],
    activities: [
      {
        name: '백년초 크래프트 시식 테이스팅 대가',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '제철 유기농 특산물을 깊게 탐험하고 직접 완성해 즐기는 최고 수준 맛보기 셰프 클래스.',
        memo: '체험 전액 결제 시 직접 기른 작은 다과 박스가 제공되어 선물용으로 이롭습니다.',
        cost: '40,000원'
      },
      {
        name: '한라봉 다과 수제 초콜릿 원데이',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '상큼한 한라봉 퓨레 소스와 최상급 벨기에 코코아 버터를 템퍼링해 수제 트러플 쇼콜라를 만드는 체험.',
        memo: '포장 틴케이스 무료 제공 및 수제 명인 수료증 발급.',
        cost: '35,000원'
      },
      {
        name: '로컬 전통 쌀 맑은 누룩 빚기 세션',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '양조 장인의 지휘 아래 고두밥을 만지고 엄선된 옹기 누룩으로 전통 약주 발효법을 가두는 경험.',
        memo: '집으로 가셔서 7일간 그늘진 곳에 숙성 및 거르기를 설명서대로 반복하세요.',
        cost: '50,000원'
      },
      {
        name: '오션 브리즈 커피 로스팅 세미나',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '오름과 숲 전망 아래 펼쳐지는 바리스타 및 티 소믈리에 특별 세미나 미식 토크.',
        memo: '뜨거운 김을 활용해 우려내는 기예 체험이 있으므로 정숙히 손을 다스려주십시오.',
        cost: '20,000원'
      },
      {
        name: '세계 희귀 다원 우려서 마시는 법',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '보이차, 백차등 우롱의 핵심 산지 잎차를 자색 전통 탕기에 불을 붙여 최고의 맛과 향을 뽑아내는 체험.',
        memo: '다도 예절 문화를 포함하고 있으므로 정숙히 매장에 대처해 주세요.',
        cost: '18,500원'
      },
      {
        name: '귤 과수원 무제한 수제 잼 메이킹',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '친환경 감귤 밭에서 먹을 만큼 귤을 수확한 후 대형 구리 냄비에 수제 잼과 시럽을 졸이는 세션.',
        memo: '수공 병 2개 양을 무료 제공 담김 지급.',
        cost: '25,000원'
      }
    ],
    stays: [
      {
        name: '프리미엄 와이너리 다이닝 셰프스테이',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '미식 여행자를 위한 야간 자정 와인 시음 부스와 일리 캡슐 가득 장착된 명인 스테이.',
        memo: '공용 와운지에서 오후 8시 반부터 무상 와인 테이스팅을 여유롭게 만끽하세요.',
        cost: '220,000원'
      },
      {
        name: '헤리티지 오션 뷰 스파 리조트 숙박',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '객실 테라스 전면에 최고급 노천온천 제트 제기를 설치해 바위에 부딪히는 바다 소리를 듣는 스파 리조트.',
        memo: '조식 뷔페 2인 가든 패스가 투숙객 전원에게 제공됩니다.',
        cost: '290,000원'
      },
      {
        name: '팰리스 프라이빗 오가닉 가든 하우스',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '완전 독립형 대저택 형태로 넓은 인조 잔디와 프라이빗 바 테이블 셰프를 소환해 파티가 가능한 헤리티지 빌라.',
        memo: '셰프 저녁 파티 바비큐 코스 사전 예약 시 전용 소믈리에 무상 배정.',
        cost: '490,000원'
      }
    ]
  },
  4: {
    // Healing Theme
    restaurants: [
      {
        name: '한초 정미 유기농 연잎 약선밥',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '자연 친화적 거름으로 영글어낸 청정 가을나물 밑반찬과 속 편한 영양 압력 가마솥 영양밥.',
        memo: '식전 심신 안정을 도와주는 허브 꽃잎차가 향기롭게 비치되어 있습니다.',
        cost: '16,000원'
      },
      {
        name: '산내 들깨 수제비가 백순두부',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '가마솥 산간 깊은 옹샘물에 맑게 삶아낸 고소함의 결정체 들깨 수제비와 전통 백순두부 정식.',
        memo: '소화에 뛰어난 비법 발효 매실 식초를 한 스푼 가미하는 것을 추천합니다.',
        cost: '14,000원'
      },
      {
        name: '사목해수 맑은 전복 가마솥진수',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '해수로 쪄내어 간이 딱 알맞고 윤기가 흐르는 영광 활전복과 모듬 산채 제물 밥상.',
        memo: '누룽지에 물을 부어 숭늉까지 알차게 챙겨 드세요.',
        cost: '22,000원'
      },
      {
        name: '로컬 수제 손두부 요리 정찬가',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '맷돌 전통 수제를 계승해 가마솥에 맑게 우려낸 건강 소담 백순두부와 시래기 무밥.',
        memo: '두부가 모두 판매되면 정시보다 빨리 마감할 수 있사오니 참고하십시오.',
        cost: '15,000원'
      },
      {
        name: '가오 도마 약채 산보 곤드레 정식',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '산기슭 고지대에서 이슬을 먹고 성취된 유기농 곤드레를 가마솥 연기로 익혀 낸 건강 약채 한 판.',
        memo: '수제 양념 간장과 참기름을 골고루 밥그릇 밑바닥까지 저으며 드세여.',
        cost: '17,000원'
      },
      {
        name: '솔솔 대나무 훈제 우리 약 오리찜',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '생대나무 통에 소금간한 청오리와 엄선된 오행 도라지를 가둬 저온 연기로 부드럽게 쪄 낸 보양 특선.',
        memo: '무나물 한 장을 고기 표면에 보자기처럼 말아 간편히 드세요.',
        cost: '28,000원'
      },
      {
        name: '약불 참나무 백흙 오리 진흙구이',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '한방 약초와 견과류를 가득 채우고 온도를 서서히 낮춰 구운 최고의 무자극 영양 보양.',
        memo: '슬로우 쿠킹 푸드로 사전 조약 연락이 수반되면 즉시 착식을 보장해 드립니다.',
        cost: '26,000원'
      },
      {
        name: '들깨 버섯 가마솥 한초 감자 수제비',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '자가 제면해 쫄깃한 감자 수제비 반죽과 야생 능이버섯 육수의 황홀한 들깨 컬레버레이션 국물.',
        memo: '자극이 도색되지 않아 남녀노소 즐기기 우수합니다.',
        cost: '15,000원'
      },
      {
        name: '향긋 산수 더덕구이 능이 무 전골',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeT0GKcI-y8YAJYixlcZfaeNEWhmn-CLYH0v6KiepOPD-iQThOxUdTZBD5ZLLu364DJXN8BbgQ8h5KzJtS_jil5wkjaPPLt2X7CX0inpEiWC9m4clgsxl0vHdfly5TtAdiLIKKchn2S9CJfs4dlMOMu_v3qLKLXzF44qBT6oS0X1J-8JYB526bDKvDPKjnyMLedf5uzlYh_xe4ldSJ10lqdiVAPIoE7gPlYaoFbXXdhdluViR4mIIAgc5kr9M68zk2fFNAa58ZUciz',
        desc: '강원도 고산 더덕에 마늘 고추장을 발라 석쇠에 굽고, 산양삼 능이 버섯을 깔아 맑게 끓인 전골.',
        memo: '무가 푹 말랑해지면 국물의 정평이 최고치에 오릅니다.',
        cost: '35,000원'
      }
    ],
    activities: [
      {
        name: '피톤치드 편백 원시림 명상 산책',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '맑은 숲속 가을 바람을 호흡하며 심신을 어루만져 주는 오롯한 명상 텐트 트레킹.',
        memo: '숲 지형이므로 굽이 없고 편편한 안전한 로우 탑 워킹화를 적극 추천합니다.',
        cost: '25,000원'
      },
      {
        name: '아쿠아 힐링 수영장 명상 요가',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '안정적인 수중 매트 위에서 고요 히아신스 방향 아로마를 맡으며 사지를 늘리는 치유 요가 클래스.',
        memo: '수영복 혹은 전용 요가 래쉬가드를 장착해 오셔아 합니다.',
        cost: '30,000원'
      },
      {
        name: '머드 웰니스 치유 전인적 아쿠아테라피',
        rating: 4.7,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '천연 청정 머드를 몸 전체에 도포해 긴장을 사수하고 혈류를 강화하는 현대 아쿠아 한방 스파.',
        memo: '피부 자극 알레르기가 있는 경우 코치진에게 사전에 알려주십시오.',
        cost: '45,000원'
      },
      {
        name: '고요 다원 전통 다도 보울 클래스',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '정갈한 우롱과 말차를 따르며 호흡에 집중하고 소박한 나를 탐독하는 기예 치료.',
        memo: '고요한 침묵 수행이 일부 깃들여져 정숙을 수반하시는 것이 가치 있습니다.',
        cost: '15,000원'
      },
      {
        name: '사운드 필 소리 향내 편백 아로마',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '싱잉볼의 은은한 주파수 진동과 편백나무 편백 오일을 활용해 일상 스트레스를 완전 탈출시키는 음향 명상 테라피.',
        memo: '편안히 누워 귀를 귀울이는 동안 담요를 무상 서비스해 드립니다.',
        cost: '16,000원'
      },
      {
        name: '오름 들녘 잔디 위 풍경화 서예 쓰기',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2L9C9rjiHrasWxtPeiU2NaTFbhoWUoT2T0426JbTMAWao9PA2_QKSfNhgly2kKWibrQyp6R8cyioOTrr_A2h3bYsT3lKSMLwIF8oZZhjYQrqTB8ZaHMWouDRo-M5LPyUnUyBxIbbg3pplNbJEEe7UXYshagw59hVmA4mJVje2-c5NjU22KBc355szHuQ2s_RrW_P_S5ZB_PShzD1q9Xcf71yJneuLIZalwn8Om6vwcBbws0-PvbPNwQVWweEqUGKIoHQz9BaogvjO',
        desc: '푸르른 사방 언덕 위에서 은은한 먹선 서예를 배우며 마음을 종이에 맑게 기록해 나가는 평온 힐링.',
        memo: '모든 붓과 한지 도구 세트 무상 배급 완료.',
        cost: '12,500원'
      }
    ],
    stays: [
      {
        name: '아늑한 숲속 통나무 황토가 스테이',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '편백나무 숲과 밤하늘에 피어난 온갖 은하수를 마주보며 온천 테마 스파를 거니는 한성 고택.',
        memo: '체크아웃 연장이 필요 시 오전 9시 전 선문 요청하시면 조율이 유연합니다.',
        cost: '160,000원'
      },
      {
        name: '고요 가와 전통 노천 히노끼 스파 홈',
        rating: 4.8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '자연 친화적 편백나무로 도배된 완전 노천 히노끼 전용 욕조가 실외에 연결되어 계곡 정취를 느낄 수 있는 평화 고택.',
        memo: '웰컴 우롱차 및 차 상이 마련되어 아늑하게 드실 수 있습니다.',
        cost: '210,000원'
      },
      {
        name: '보름달 정원 게스트룸 앤 다실 사랑방',
        rating: 4.9,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFSzw1H3FjRhiZ9iq1OXnikA8AmzpMTHEEdvKI5_4jrzye36Kgd-0vlvlScKZA1ebOIDmtRTKu15-Y3-u6Kh595mpUiZ881g_X7o1Xl-mrrz3VXlKd38CMyOHG0EltUUIoT-2mVDSfqD0w9J64RxcuviDqjYsMTlLH2ByMLPQZb-yQ6vNXGyl_u36GJ_C5vtCa3tc7WOrPOuGEoh5flgVnGK5oKg-YmGBEsl6KkLb_d2RO9VSEpmlTVO1laXEyukUMf2mOJE1PyOhB',
        desc: '마치 시대를 거슬러 간 듯 단아함 극정의 고풍 다실과 야생화 정원을 조망하는 프리미엄 한옥 사랑방.',
        memo: '투숙객 한정 다도 에절 설명 웰컴 스낵 무상 증정.',
        cost: '180,000원'
      }
    ]
  }
};

/**
 * Generates an itinerary structured by precise daily rules:
 * - 1 Day Duration: NO STAYS, exactly [Restaurant 1, Activity 1, Restaurant 2, Activity 2, Restaurant 3] (Total 5 spots)
 * - 2 & 3 Day Duration: 1 Single Stay for the entire course, placed at the VERY FRONT of Day 1.
 *   - Day 1: [Stay 1, Restaurant 1, Activity 1, Restaurant 2, Activity 2, Restaurant 3] (Total 6 spots)
 *   - Day 2 & 3: [Restaurant 1, Activity 1, Restaurant 2, Activity 2, Restaurant 3] (Total 5 spots each, NO stays)
 */
export function buildCuratedItinerary(
  themeId: number,
  region: string,
  district: string,
  duration: number
): CourseSpot[] {
  const normThemeId = themeId in THEME_SPOTS ? themeId : 4;
  const pool = THEME_SPOTS[normThemeId];
  const result: CourseSpot[] = [];

  // Generate dynamic schedule for each day
  for (let day = 1; day <= duration; day++) {
    const dIndex = day - 1; // index offset for array pools

    // Resolve restaurant and activity items for this day
    const rest1Raw = pool.restaurants[(dIndex * 3) % pool.restaurants.length];
    const rest2Raw = pool.restaurants[(dIndex * 3 + 1) % pool.restaurants.length];
    const rest3Raw = pool.restaurants[(dIndex * 3 + 2) % pool.restaurants.length];

    const act1Raw = pool.activities[(dIndex * 2) % pool.activities.length];
    const act2Raw = pool.activities[(dIndex * 2 + 1) % pool.activities.length];

    // Localize/Region-ize spot names with region & district placeholders elegantly
    const localizeSpot = (spot: { name: string; rating: number; image: string; desc: string; memo: string; cost: string }, category: 'restaurant' | 'activity' | 'cafe' | 'stay'): CourseSpot => {
      let localizedName = spot.name;
      // Inject region dynamically if name doesn't already contain it
      if (!localizedName.includes(region) && !localizedName.includes(district)) {
        if (category === 'restaurant') {
          localizedName = `${district} ${localizedName}`;
        } else {
          localizedName = `${region} ${localizedName}`;
        }
      }

      return {
        category,
        name: localizedName,
        rating: spot.rating,
        image: spot.image,
        desc: spot.desc,
        memo: spot.memo,
        cost: spot.cost,
        day,
      };
    };

    const r1 = localizeSpot(rest1Raw, 'restaurant');
    const a1 = localizeSpot(act1Raw, 'activity');
    const r2 = localizeSpot(rest2Raw, 'restaurant');
    const a2 = localizeSpot(act2Raw, 'activity');
    const r3 = localizeSpot(rest3Raw, 'restaurant');

    if (duration === 1) {
      // 1 Day (당일치기) -> Just 5 spots: 식당1 -> 액티비티1 -> 식당2 -> 액티비티2 -> 식당3 (NO stays)
      result.push(r1, a1, r2, a2, r3);
    } else {
      // Multi-day -> Only the first day has a single stay at the front
      if (day === 1) {
        const stayRaw = pool.stays[0]; // Exactly 1 stay chosen for the entire trip
        const localizedStay = localizeSpot(stayRaw, 'stay');
        // Let's modify the stay description to emphasize it is the main stay of the entire journey
        localizedStay.desc = `${duration}일 여행 전체를 아우를 전용 숙처! ${localizedStay.desc}`;
        
        result.push(localizedStay, r1, a1, r2, a2, r3);
      } else {
        // Day 2 and 3 do not have stays, exactly 5 spots
        result.push(r1, a1, r2, a2, r3);
      }
    }
  }

  return result;
}
