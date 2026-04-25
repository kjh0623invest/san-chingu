import React, { useState, useEffect, useRef } from 'react';
import {
  Mountain, MapPin, Users, Store, MessageCircle, User,
  CheckCircle2, Trophy, Flame, Lock
} from 'lucide-react';
import './index.css';

// ─── 시즌 파악 ───
function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

const SEASON_INFO = {
  spring: { emoji: '🌸', label: '봄 제철 명산', desc: '벚꽃·진달래·철쭉을 즐길 수 있어요' },
  summer: { emoji: '🌿', label: '여름 시원한 명산', desc: '폭포와 계곡, 울창한 녹음을 즐기세요' },
  autumn: { emoji: '🍁', label: '가을 단풍 명산', desc: '화려한 단풍이 절정을 이루는 명산들' },
  winter: { emoji: '❄️', label: '겨울 눈꽃 명산', desc: '비현실적인 눈꽃과 설경을 감상하세요' },
};

const SEASONAL_MOUNTAINS = {
  spring: [
    { id:1,  name: '진해 장복산', region: '경남', level: '쉬움',   time: '1.5시간', levelClass: 'easy',   tag: '🌸 벚꽃', emoji: '🌸',
      img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc4f?w=400&h=280&fit=crop&q=85' },
    { id:2,  name: '황매산',     region: '경남', level: '보통',   time: '3시간',   levelClass: 'medium', tag: '🌺 철쭉', emoji: '🌺',
      img: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=400&h=280&fit=crop&q=85' },
    { id:3,  name: '광양 백운산', region: '전남', level: '보통',   time: '3시간',   levelClass: 'medium', tag: '🌸 매화', emoji: '🌸',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=280&fit=crop&q=85' },
    { id:4,  name: '여수 영취산', region: '전남', level: '보통',   time: '2.5시간', levelClass: 'medium', tag: '🌷 진달래', emoji: '🌷',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&q=85' },
  ],
  summer: [
    { id:5,  name: '지리산',     region: '전남/경남', level: '어려움', time: '6시간',   levelClass: 'hard',   tag: '🌊 계곡', emoji: '🌊',
      img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=280&fit=crop&q=85' },
    { id:6,  name: '설악산',     region: '강원',       level: '어려움', time: '7시간',   levelClass: 'hard',   tag: '🌿 녹음', emoji: '🌿',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&q=85' },
    { id:7,  name: '가야산',     region: '경남',       level: '보통',   time: '4시간',   levelClass: 'medium', tag: '💧 폭포', emoji: '💧',
      img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=280&fit=crop&q=85' },
    { id:8,  name: '오대산',     region: '강원',       level: '보통',   time: '4시간',   levelClass: 'medium', tag: '🌳 비밀숲', emoji: '🌳',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=280&fit=crop&q=85' },
  ],
  autumn: [
    { id:9,  name: '내장산',     region: '전북/충남', level: '보통',   time: '3시간',   levelClass: 'medium', tag: '🍁 단풍', emoji: '🍁',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=280&fit=crop&q=85' },
    { id:10, name: '설악산',     region: '강원',       level: '어려움', time: '7시간',   levelClass: 'hard',   tag: '🍁 단풍', emoji: '🍁',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&q=85' },
    { id:11, name: '치악산',     region: '강원',       level: '보통',   time: '4시간',   levelClass: 'medium', tag: '🍂 단풍', emoji: '🍂',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=280&fit=crop&q=85' },
    { id:12, name: '북한산',     region: '서울',       level: '보통',   time: '4시간',   levelClass: 'medium', tag: '🍁 단풍', emoji: '🍁',
      img: 'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=400&h=280&fit=crop&q=85' },
  ],
  winter: [
    { id:13, name: '덕유산',     region: '전북/경남', level: '보통',   time: '4시간',   levelClass: 'medium', tag: '❄️ 눈꽃', emoji: '❄️',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=280&fit=crop&q=85' },
    { id:14, name: '태백산',     region: '강원',       level: '보통',   time: '3시간',   levelClass: 'medium', tag: '❄️ 눈꽃', emoji: '❄️',
      img: 'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?w=400&h=280&fit=crop&q=85' },
    { id:15, name: '한라산',     region: '제주',       level: '어려움', time: '9시간',   levelClass: 'hard',   tag: '❄️ 설경', emoji: '❄️',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=280&fit=crop&q=85' },
    { id:16, name: '소백산',     region: '충북/강원', level: '보통',   time: '4시간',   levelClass: 'medium', tag: '❄️ 눈꽃', emoji: '❄️',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=280&fit=crop&q=85' },
  ],
};

const MEETINGS = [
  {
    id: 1, title: '도봉산 단풍 구경 동행 구해요!', course: '신선대 코스 · 왕복 3시간',
    current: 3, max: 4, status: 'urgent',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=420&fit=crop&q=85'
  },
  {
    id: 2, title: '북한산 둘레길 산책 (초보 환영)', course: '우이동 계곡 코스 · 왕복 2시간',
    current: 2, max: 6, status: 'normal',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&h=420&fit=crop&q=85'
  },
];

const MARKET_ITEMS = [
  { id: 1, title: '레키(LEKI) 알루미늄 등산 스틱 2개 세트', location: '서초3동', time: '5분 전', price: '45,000원',
    img: null, emoji: '🥢' },
  { id: 2, title: '네파 고어텍스 자켓 (95 사이즈)', location: '반포본동', time: '1시간 전', price: '30,000원',
    img: null, emoji: '🧥' },
  { id: 3, title: '캠프라인 등산화 (260mm, 한 번 착용)', location: '방배동', time: '3시간 전', price: '20,000원',
    img: null, emoji: '🥾' },
];

const CHATS = [
  { id: 1, name: '도봉산 단풍구경팀 (3명)', last: '내일 아침 9시 매표소 앞에서 봬요!', time: '오후 8:43', unread: true, icon: '🏔️' },
  { id: 2, name: '김등산 (스틱 판매자)', last: '서초역 3번 출구로 오시면 됩니다.', time: '오후 5:12', unread: false, icon: '🎒' },
  { id: 3, name: '서초 산사랑 모임 (12명)', last: '다음 주 일정 투표해 주세요~', time: '어제', unread: false, icon: '⛰️' },
];

const QUESTS = [
  { id:1,  label: '첫 걸음 내딛기',         xp: 50,   icon: '🌱', zone: '입문',   done: true  },
  { id:2,  label: '프로필 완성',             xp: 50,   icon: '📝', zone: '입문',   done: true  },
  { id:3,  label: '첫 번째 모임 구경',       xp: 100,  icon: '👀', zone: '입문',   done: true  },
  { id:4,  label: '아차산 완등',             xp: 150,  icon: '⛰️', zone: '입문',   done: false, current: true },
  { id:5,  label: '첫 동행 신청',           xp: 200,  icon: '🤝', zone: '입문',   done: false },
  { id:6,  label: '장터 구경하기',           xp: 100,  icon: '🛍️', zone: '입문',   done: false },
  { id:7,  label: '북한산 둘레길 산책',      xp: 300,  icon: '🌲', zone: '성장',   done: false },
  { id:8,  label: '산친구 3명 사귀기',       xp: 200,  icon: '👥', zone: '성장',   done: false },
  { id:9,  label: '연속 2회 등산 인증',      xp: 250,  icon: '🔥', zone: '성장',   done: false },
  { id:10, label: '장터 첫 거래 완료',       xp: 300,  icon: '🛒', zone: '성장',   done: false },
  { id:11, label: '모임 개설하기',           xp: 400,  icon: '📣', zone: '성장',   done: false },
  { id:12, label: '북한산 대장정 완등',      xp: 500,  icon: '🏔️', zone: '성장',   done: false },
  { id:13, label: '한 달 4회 산행 달성',     xp: 400,  icon: '📅', zone: '고수',   done: false },
  { id:14, label: '등산 리뷰 작성',          xp: 150,  icon: '✍️', zone: '고수',   done: false },
  { id:15, label: '산친구 10명 사귀기',      xp: 500,  icon: '🫂', zone: '고수',   done: false },
  { id:16, label: '채팅 50회 달성',          xp: 200,  icon: '💬', zone: '고수',   done: false },
  { id:17, label: '설악산 완등',             xp: 600,  icon: '❄️', zone: '고수',   done: false },
  { id:18, label: '장터 5회 거래 달성',      xp: 400,  icon: '💰', zone: '고수',   done: false },
  { id:19, label: '등산 사진 5장 공유',      xp: 200,  icon: '📸', zone: '고수',   done: false },
  { id:20, label: '지리산 1박 2일 완등',     xp: 800,  icon: '⛺', zone: '고수',   done: false },
  { id:21, label: '연속 3개월 목표 달성',    xp: 600,  icon: '🏅', zone: '전문가', done: false },
  { id:22, label: '산친구 온도 40도 달성',   xp: 500,  icon: '🌡️', zone: '전문가', done: false },
  { id:23, label: '모임장 5회 데뷔',         xp: 700,  icon: '👨‍✈️', zone: '전문가', done: false },
  { id:24, label: '내장산 단풍 시즌 완등',   xp: 600,  icon: '🍁', zone: '전문가', done: false },
  { id:25, label: '대청봉(설악) 등정 완료',  xp: 800,  icon: '🗻', zone: '전문가', done: false },
  { id:26, label: '장터 거래 15회 달성',     xp: 600,  icon: '🏪', zone: '전문가', done: false },
  { id:27, label: '백두대간 1구간 종주',     xp: 1000, icon: '🗺️', zone: '전문가', done: false },
  { id:28, label: '연간 산행 48회 달성',     xp: 1000, icon: '📆', zone: '신선',   done: false },
  { id:29, label: '전국 명산 10개 완등',     xp: 1200, icon: '🏆', zone: '신선',   done: false },
  { id:30, label: '산친구 50명 사귀기',      xp: 800,  icon: '🌟', zone: '신선',   done: false },
  { id:31, label: '한라산 백록담 완등',      xp: 1500, icon: '🌋', zone: '신선',   done: false },
  { id:32, label: '전설의 한라산 신선 등극', xp: 2000, icon: '👑', zone: '신선',   done: false },
];

// ─── 이미지 에러 시 이모지 폴백 컴포넌트 ───
const EMOJI_BG = {
  '🥢': 'linear-gradient(135deg,#FFF7ED,#FED7AA)',
  '🧥': 'linear-gradient(135deg,#EFF6FF,#BFDBFE)',
  '🥾': 'linear-gradient(135deg,#FDF4FF,#F5D0FE)',
};
function MarketItemImage({ src, alt, emoji }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div style={{
        width: 90, height: 90, borderRadius: 14, flexShrink: 0,
        background: EMOJI_BG[emoji] || 'linear-gradient(135deg,#ECFDF5,#D1FAE5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
      }}>{emoji}</div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setBroken(true)}
      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 14, flexShrink: 0 }} />
  );
}

// ─── 산이 (Bear) SVG — 더 크고 풍부한 디테일 ───
function SaniBear({ size = 120 }) {
  return (
    <div className="mascot-sani" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
        {/* 그림자 */}
        <ellipse cx="100" cy="192" rx="50" ry="8" fill="rgba(0,0,0,0.12)"/>
        {/* 귀 (둥글고 큰) */}
        <circle cx="48" cy="58" r="28" fill="#5C3317"/>
        <circle cx="152" cy="58" r="28" fill="#5C3317"/>
        <circle cx="48" cy="58" r="18" fill="#A0522D"/>
        <circle cx="152" cy="58" r="18" fill="#A0522D"/>
        {/* 몸통 */}
        <ellipse cx="100" cy="150" rx="58" ry="52" fill="#6B3A22"/>
        {/* 배 (밝은 크림색) */}
        <ellipse cx="100" cy="155" rx="38" ry="38" fill="#D4956A"/>
        {/* 머리 */}
        <circle cx="100" cy="90" r="55" fill="#7D4A2F"/>
        {/* 머리 옆면 약간 밝게 */}
        <circle cx="75" cy="78" r="30" fill="#8B5535" opacity="0.5"/>
        {/* 반달무늬 */}
        <path d="M72 108 Q100 98 128 108 Q115 125 100 126 Q85 125 72 108Z" fill="#F0DDCC"/>
        {/* 눈썹 */}
        <path d="M78 72 Q85 68 93 72" stroke="#3D1C0A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M107 72 Q115 68 122 72" stroke="#3D1C0A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        {/* 눈 흰 배경 */}
        <circle cx="86" cy="82" r="13" fill="white"/>
        <circle cx="114" cy="82" r="13" fill="white"/>
        {/* 눈동자 */}
        <circle cx="88" cy="84" r="9" fill="#1A0D00"/>
        <circle cx="116" cy="84" r="9" fill="#1A0D00"/>
        {/* 눈 하이라이트 */}
        <circle cx="91" cy="80" r="3.5" fill="white"/>
        <circle cx="119" cy="80" r="3.5" fill="white"/>
        <circle cx="93" cy="86" r="1.5" fill="white" opacity="0.7"/>
        <circle cx="121" cy="86" r="1.5" fill="white" opacity="0.7"/>
        {/* 코 */}
        <ellipse cx="100" cy="100" rx="11" ry="8" fill="#1A0D00"/>
        <ellipse cx="98" cy="98" rx="3" ry="2" fill="white" opacity="0.4"/>
        {/* 입 (큰 미소) */}
        <path d="M84 112 Q100 126 116 112" stroke="#1A0D00" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M100 116 L100 122" stroke="#1A0D00" strokeWidth="2.5" strokeLinecap="round"/>
        {/* 볼터치 */}
        <circle cx="68" cy="97" r="12" fill="#FF8C69" opacity="0.35"/>
        <circle cx="132" cy="97" r="12" fill="#FF8C69" opacity="0.35"/>
        {/* 등산모자 */}
        <ellipse cx="100" cy="42" rx="50" ry="10" fill="#1A4731"/>
        <rect x="50" y="20" width="100" height="26" rx="13" fill="#1A4731"/>
        <rect x="58" y="14" width="84" height="14" rx="7" fill="#2D6A4F"/>
        {/* 모자 밴드 */}
        <rect x="50" y="42" width="100" height="5" rx="2.5" fill="#40916C"/>
        {/* 모자 버튼 */}
        <circle cx="100" cy="15" r="5" fill="#F4A261"/>
        {/* 왼팔 — 엄지척 */}
        <ellipse cx="44" cy="150" rx="18" ry="40" fill="#6B3A22" transform="rotate(-20 44 150)"/>
        <circle cx="32" cy="124" r="16" fill="#7D4A2F"/>
        {/* 엄지척 손바닥 */}
        <circle cx="22" cy="115" r="10" fill="#A0522D"/>
        <rect x="15" y="100" width="15" height="20" rx="7" fill="#A0522D"/>
        {/* 오른팔 — 등산 스틱 */}
        <ellipse cx="156" cy="152" rx="18" ry="40" fill="#6B3A22" transform="rotate(20 156 152)"/>
        <circle cx="168" cy="126" r="14" fill="#7D4A2F"/>
        {/* 스틱 */}
        <rect x="178" y="105" width="8" height="90" rx="4" fill="#8B6914"/>
        <ellipse cx="182" cy="106" rx="9" ry="5" fill="#C9A227"/>
        <ellipse cx="182" cy="193" rx="5" ry="3" fill="#666"/>
        {/* 다리 */}
        <ellipse cx="80" cy="192" rx="18" ry="12" fill="#5C3317"/>
        <ellipse cx="120" cy="192" rx="18" ry="12" fill="#5C3317"/>
        {/* 등산화 */}
        <ellipse cx="80" cy="196" rx="20" ry="8" fill="#2D3748"/>
        <ellipse cx="120" cy="196" rx="20" ry="8" fill="#2D3748"/>
      </svg>
    </div>
  );
}

// ─── 양이 (Goat) SVG — 더 크고 생동감 있는 포즈 ───
function YangiGoat({ size = 120 }) {
  return (
    <div className="mascot-yangi" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
        {/* 그림자 */}
        <ellipse cx="105" cy="192" rx="48" ry="7" fill="rgba(0,0,0,0.1)"/>
        {/* 뿔 (우아하게 뒤로 굽은 모양) */}
        <path d="M74 38 Q60 10 48 18 Q40 22 42 35" stroke="#C8A882" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M126 38 Q140 10 152 18 Q160 22 158 35" stroke="#C8A882" strokeWidth="8" strokeLinecap="round" fill="none"/>
        {/* 귀 (옆으로 퍼진 귀여운 귀) */}
        <ellipse cx="55" cy="68" rx="20" ry="12" fill="#F0D9B5" transform="rotate(-30 55 68)"/>
        <ellipse cx="56" cy="68" rx="12" ry="7" fill="#FFB5B5" transform="rotate(-30 56 68)"/>
        <ellipse cx="145" cy="68" rx="20" ry="12" fill="#F0D9B5" transform="rotate(30 145 68)"/>
        <ellipse cx="144" cy="68" rx="12" ry="7" fill="#FFB5B5" transform="rotate(30 144 68)"/>
        {/* 몸통 */}
        <ellipse cx="105" cy="152" rx="55" ry="50" fill="#F5EDD8"/>
        {/* 머리 */}
        <ellipse cx="100" cy="88" rx="50" ry="52" fill="#FAEBD7"/>
        {/* 얼굴 흰 부분 (주둥이) */}
        <ellipse cx="100" cy="104" rx="30" ry="22" fill="white"/>
        {/* 눈 흰 배경 */}
        <circle cx="82" cy="82" r="14" fill="white"/>
        <circle cx="118" cy="82" r="14" fill="white"/>
        {/* 눈동자 (타원형 염소 눈) */}
        <ellipse cx="84" cy="84" rx="8" ry="10" fill="#1A1A2E"/>
        <ellipse cx="120" cy="84" rx="8" ry="10" fill="#1A1A2E"/>
        {/* 눈 하이라이트 */}
        <circle cx="87" cy="80" r="3.5" fill="white"/>
        <circle cx="123" cy="80" r="3.5" fill="white"/>
        <circle cx="89" cy="86" r="1.5" fill="white" opacity="0.7"/>
        <circle cx="125" cy="86" r="1.5" fill="white" opacity="0.7"/>
        {/* 눈썹 */}
        <path d="M72 72 Q82 66 90 70" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M110 70 Q118 66 128 72" stroke="#8B7355" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* 코 */}
        <ellipse cx="100" cy="100" rx="10" ry="7" fill="#E8A0A0"/>
        {/* 콧구멍 */}
        <circle cx="96" cy="101" r="2.5" fill="#C07070"/>
        <circle cx="104" cy="101" r="2.5" fill="#C07070"/>
        {/* 입 (활짝 웃는) */}
        <path d="M82 114 Q100 128 118 114" stroke="#C07070" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M90 118 Q100 124 110 118" fill="#FFB5B5"/>
        {/* 볼터치 */}
        <circle cx="65" cy="96" r="13" fill="#FFB5B5" opacity="0.5"/>
        <circle cx="135" cy="96" r="13" fill="#FFB5B5" opacity="0.5"/>
        {/* 파란 바람막이 재킷 */}
        <rect x="50" y="148" width="110" height="50" rx="18" fill="#2563EB"/>
        <rect x="50" y="148" width="20" height="50" rx="10" fill="#1D4ED8"/>
        <rect x="130" y="148" width="20" height="50" rx="10" fill="#1D4ED8"/>
        {/* 지퍼선 */}
        <rect x="97" y="148" width="6" height="50" rx="3" fill="#1E40AF"/>
        {/* 재킷 포켓 */}
        <rect x="60" y="168" width="26" height="18" rx="6" fill="#1D4ED8"/>
        <rect x="114" y="168" width="26" height="18" rx="6" fill="#1D4ED8"/>
        {/* 분홍 배낭 */}
        <rect x="130" y="100" width="44" height="60" rx="14" fill="#EC4899"/>
        <rect x="136" y="93" width="6" height="15" rx="3" fill="#DB2777"/>
        <rect x="162" y="93" width="6" height="15" rx="3" fill="#DB2777"/>
        <rect x="139" y="120" width="30" height="24" rx="8" fill="#F472B6"/>
        {/* 앞 왼발 (도약 포즈) */}
        <ellipse cx="65" cy="188" rx="18" ry="12" fill="#E8D5B0"/>
        {/* 앞 오른발 (올라간 포즈 — 활기찬) */}
        <ellipse cx="145" cy="170" rx="15" ry="10" fill="#E8D5B0" transform="rotate(-30 145 170)"/>
        {/* 발굽 */}
        <ellipse cx="65" cy="196" rx="16" ry="7" fill="#8B7355"/>
        <ellipse cx="148" cy="178" rx="14" ry="6" fill="#8B7355" transform="rotate(-30 148 178)"/>
        {/* 꼬리 (위로 올라간 귀여운 꼬리) */}
        <ellipse cx="52" cy="148" rx="10" ry="14" fill="white" transform="rotate(30 52 148)"/>
      </svg>
    </div>
  );
}

// ─── 로드맵 존 헤더 ───
function ZoneHeader({ zone }) {
  const styles = {
    '입문':   { bg: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', text: '#065F46', border: '#6EE7B7' },
    '성장':   { bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', text: '#1E40AF', border: '#93C5FD' },
    '고수':   { bg: 'linear-gradient(135deg,#FFF7ED,#FED7AA)', text: '#9A3412', border: '#FDBA74' },
    '전문가': { bg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', text: '#5B21B6', border: '#C4B5FD' },
    '신선':   { bg: 'linear-gradient(135deg,#FDF4FF,#F5D0FE)', text: '#86198F', border: '#E879F9' },
  };
  const s = styles[zone] || styles['입문'];
  return (
    <div style={{
      background: s.bg, border: `2px solid ${s.border}`, borderRadius: 20,
      padding: '12px 24px', margin: '4px 0 28px',
      textAlign: 'center', fontSize: 16, fontWeight: 900, color: s.text,
      letterSpacing: 1.5, boxShadow: `0 4px 12px ${s.border}66`,
    }}>
      ─── {zone} 구간 ───
    </div>
  );
}

// ─── 산이 이미지 폴백 컴포넌트 (Mountain Card) ───
const SEASON_EMOJI_BG = {
  '🌸': 'linear-gradient(135deg,#FFF0F5,#FFD6E7)',
  '🌺': 'linear-gradient(135deg,#FFF0F5,#FECDD3)',
  '🌷': 'linear-gradient(135deg,#FFF0F5,#FECDD3)',
  '🌸 복꿃': 'linear-gradient(135deg,#FFF0F5,#FFD6E7)',
  '🌊': 'linear-gradient(135deg,#EFF6FF,#BFDBFE)',
  '🌿': 'linear-gradient(135deg,#ECFDF5,#A7F3D0)',
  '💧': 'linear-gradient(135deg,#EFF6FF,#BFDBFE)',
  '🌳': 'linear-gradient(135deg,#F0FDF4,#BBF7D0)',
  '🍁': 'linear-gradient(135deg,#FFF7ED,#FED7AA)',
  '🍂': 'linear-gradient(135deg,#FFF7ED,#FDBA74)',
  '❄️': 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
};
function MountainCardImage({ src, emoji }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div style={{
        width: '100%', height: 110, flexShrink: 0,
        background: SEASON_EMOJI_BG[emoji] || '#F0FDF4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48,
      }}>{emoji}</div>
    );
  }
  return <img src={src} alt="" onError={() => setBroken(true)} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />;
}

// ─── GPS 플 트래킹 컴포넌트 ───
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function GpsWidget({ active, distance, steps, onStart, onStop, error }) {
  return (
    <div style={{
      margin: '16px 20px 0',
      background: active
        ? 'linear-gradient(135deg,#0F4C2A,#166534)'
        : 'white',
      borderRadius: 20,
      padding: '16px 18px',
      boxShadow: active ? '0 6px 24px rgba(22,101,52,0.35)' : '0 1px 3px rgba(0,0,0,0.08)',
      border: active ? 'none' : '1px solid rgba(0,0,0,0.06)',
      transition: 'all 0.3s',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: active ? 'rgba(255,255,255,0.7)' : '#6B7280', marginBottom: 3 }}>오늘의 산행 트래킹</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: active ? 'white' : '#111827' }}>
            {active ? '📡 GPS 측정 중다...' : '📍 GPS로 산행을 기록해요!'}
          </div>
        </div>
        <button
          onClick={active ? onStop : onStart}
          style={{
            padding: '10px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
            background: active ? '#EF4444' : '#16A34A',
            color: 'white', fontWeight: 800, fontSize: 14,
            boxShadow: active ? '0 4px 12px rgba(239,68,68,0.4)' : '0 4px 12px rgba(22,163,74,0.4)',
          }}
        >
          {active ? '⏹ 정지' : '▶ 시작'}
        </button>
      </div>
      {error && <div style={{ color:'#FCA5A5', fontSize:13, marginBottom:8 }}>{error}</div>}
      <div style={{ display:'flex', gap:10 }}>
        {[{ val: distance.toFixed(2), unit:'km', label:'이동거리', color:'#34D399', bg: active?'rgba(255,255,255,0.12)':'#F0FDF4' },
          { val: steps.toLocaleString(), unit:'걸음', label:'걸음수', color:'#60A5FA', bg: active?'rgba(255,255,255,0.12)':'#EFF6FF' }]
          .map(({ val, unit, label, bg, color }) => (
          <div key={label} style={{ flex:1, background:bg, borderRadius:14, padding:'10px 0', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:900, color: active ? 'white' : color }}>{val}</div>
            <div style={{ fontSize:11, fontWeight:700, color: active ? 'rgba(255,255,255,0.6)' : color, marginTop:1 }}>{unit}</div>
            <div style={{ fontSize:11, color: active ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [tab, setTab] = useState('home');
  const [xp, setXp] = useState(350);
  const [monthly, setMonthly] = useState(2);
  const [toast, setToast] = useState(false);
  // GPS state
  const [gpsActive, setGpsActive] = useState(false);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [gpsError, setGpsError] = useState(null);
  const watchIdRef = useRef(null);
  const lastPosRef = useRef(null);
  const GOAL = 4;

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(false), 2500); return () => clearTimeout(t); }
  }, [toast]);

  // GPS 시작
  const startGps = () => {
    if (!navigator.geolocation) { setGpsError('GPS를 지원하지 않는 브라우저입니다.'); return; }
    setGpsError(null);
    lastPosRef.current = null;
    setGpsActive(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        if (lastPosRef.current) {
          const d = haversine(lastPosRef.current.lat, lastPosRef.current.lon, lat, lon);
          if (d > 0.005) {
            setDistance(prev => parseFloat((prev + d).toFixed(3)));
            setSteps(prev => prev + Math.round(d * 1333));
            lastPosRef.current = { lat, lon };
          }
        } else {
          lastPosRef.current = { lat, lon };
        }
      },
      err => { setGpsError('위치 사용 권한이 거부되었습니다. 브라우저 설정을 확인해주세요.'); setGpsActive(false); },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  };

  const stopGps = () => {
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    setGpsActive(false);
  };

  // 등산 인증 시 GPS도 맞춰 XP 반영
  const handleCertify = () => {
    setXp(p => p + 100 + Math.floor(distance * 20) + Math.floor(steps / 100));
    setMonthly(p => Math.min(p + 1, GOAL));
    setToast(true);
    stopGps();
    setDistance(0);
    setSteps(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const go = t => { setTab(t); window.scrollTo(0, 0); };

  return (
    <div id="root">
      {toast && (
        <div className="toast">
          <Trophy size={20} color="#F4A261" />
          등산 인증 완료! <strong>+100 XP</strong> 획득!
        </div>
      )}
      {tab === 'home'    && <HomeTab monthly={monthly} goal={GOAL} onCertify={handleCertify}
        gpsActive={gpsActive} distance={distance} steps={steps} gpsError={gpsError}
        onGpsStart={startGps} onGpsStop={stopGps} />}
      {tab === 'market'  && <MarketTab />}
      {tab === 'chat'    && <ChatTab />}
      {tab === 'profile' && <ProfileTab xp={xp} monthly={monthly} goal={GOAL} />}
      <nav className="bottom-nav">
        {[
          { key: 'home', icon: Mountain, label: '동행' },
          { key: 'market', icon: Store, label: '장터' },
          { key: 'chat', icon: MessageCircle, label: '채팅' },
          { key: 'profile', icon: User, label: '내 정보' },
        ].map(({ key, icon: Icon, label }) => (
          <div key={key} className={`nav-item ${tab === key ? 'active' : ''}`} onClick={() => go(key)}>
            <Icon size={24} /><span>{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

// ─── HOME TAB ───
function HomeTab({
  monthly, goal, onCertify,
  gpsActive, distance, steps, gpsError, onGpsStart, onGpsStop
}) {
  const season = getCurrentSeason();
  const info = SEASON_INFO[season];
  const mountains = SEASONAL_MOUNTAINS[season];

  return (
    <div className="page-content">
      <div className="hero">
        <img className="hero-bg" src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=640&fit=crop&q=85" alt="산 배경" />
        <div className="hero-gradient" />
        <div className="hero-content">
          <p className="greeting">내 동네: 서초구 ⛰️</p>
          <h1>오늘, 어느<br/>산으로 떠나볼까요?</h1>
        </div>
      </div>

      {/* GPS 트래킹 위젯 */}
      <GpsWidget
        active={gpsActive}
        distance={distance}
        steps={steps}
        onStart={onGpsStart}
        onStop={onGpsStop}
        error={gpsError}
      />

      <div className="widget">
        <div className="widget-icon">🔥</div>
        <div className="widget-text">
          <p>이번 달 목표 달성 현황</p>
          <h4>{monthly} / {goal}회 완료 · 딱 {goal - monthly}번만 더!</h4>
        </div>
        <Flame size={26} color="#FF6B35" />
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <span className="section-title">{info.emoji} {info.label}</span>
            <p style={{ fontSize: 13, color: 'var(--text-300)', marginTop: 2 }}>{info.desc}</p>
          </div>
          <span className="section-more">전국 확대</span>
        </div>
      </div>
      <div className="h-scroll">
        {mountains.map(m => (
          <div className="mountain-card" key={m.id}>
            <MountainCardImage src={m.img} emoji={m.emoji} />
            <div className="mountain-card-info">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
                <h5 style={{ margin:0 }}>{m.name}</h5>
                <span style={{ fontSize:11, color:'var(--text-400)' }}>{m.region}</span>
              </div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                <span className={`difficulty ${m.levelClass}`} style={{ padding:'2px 8px' }}>{m.level}</span>
                <span style={{ fontSize:11, background:'#F3F4F6', padding:'2px 8px', borderRadius:100, fontWeight:700, color:'#4B5563' }}>{m.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 산이 가이드 — 크고 생동감 있는 캐릭터 */}
      <div className="character-banner sani-banner" style={{ marginTop: 24 }}>
        <div className="character-banner-mascot">
          <SaniBear size={140} />
        </div>
        <div className="character-banner-content">
          <div className="character-banner-name">산이 <span className="role-tag">🐻 안전 가이드</span></div>
          <div className="character-banner-speech">
            "지금은 {info.label} 시즌이에요! {info.emoji}<br/>{info.desc.split('요')[0]}요!<br/>즐거운 산행 되세요!"
          </div>
        </div>
      </div>

      <button className="certify-btn" onClick={onCertify}>
        <CheckCircle2 size={26} />
        오늘 등산 인증하기 (+100 XP)
      </button>

      <div className="section">
        <div className="section-header">
          <span className="section-title">이번 주 추천 모임</span>
        </div>
        {MEETINGS.map(m => (
          <div className="meeting-card" key={m.id}>
            <img src={m.img} alt={m.title} />
            <div className="meeting-card-body">
              <span className={`badge ${m.status === 'urgent' ? 'red' : 'green'}`}>
                {m.status === 'urgent' ? '마감 임박' : '모집 중'}
              </span>
              <h3>{m.title}</h3>
              <div className="info-row"><MapPin size={17} color="#40916C" />{m.course}</div>
              <div className="info-row"><Users size={17} color="#40916C" />{m.current}명 참여 / 최대 {m.max}명</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MARKET TAB ───
function MarketTab() {
  return (
    <div className="page-content">
      <div className="page-header"><h1>장터 🎒</h1><p>우리 동네 안전한 등산 용품 거래</p></div>

      {/* 양이 가이드 — 크고 생동감 있는 캐릭터 */}
      <div className="character-banner yangi-banner">
        <div className="character-banner-mascot">
          <YangiGoat size={140} />
        </div>
        <div className="character-banner-content">
          <div className="character-banner-name" style={{ color: 'white' }}>양이 <span className="role-tag" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>🐐 가성비 추천</span></div>
          <div className="character-banner-speech" style={{ color: 'white', background: 'rgba(0,0,0,0.2)' }}>
            "청계산 가신다면 스틱 하나면 충분해요! 👇<br/>서초3동 레키 스틱<br/>4만원대 특가 올라왔어요!"
          </div>
        </div>
      </div>

      <div className="section">
        {MARKET_ITEMS.map(item => (
          <div className="market-item" key={item.id} onClick={() => alert('판매자와 채팅이 시작됩니다.')}>
            <MarketItemImage src={item.img} alt={item.title} emoji={item.emoji} />
            <div className="market-item-info">
              <h4>{item.title}</h4>
              <p className="market-meta">{item.location} · {item.time}</p>
              <p className="market-price">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT TAB ───
function ChatTab() {
  return (
    <div className="page-content">
      <div className="page-header"><h1>채팅 💬</h1><p>모임과 거래 모든 대화</p></div>
      <div style={{ background: 'white' }}>
        {CHATS.map(c => (
          <div className="chat-item" key={c.id} onClick={() => alert('채팅방')}>
            <div className="chat-avatar">{c.icon}</div>
            <div className="chat-info">
              <div className="chat-name" style={{ fontWeight: c.unread ? 900 : 700 }}>{c.name}</div>
              <div className="chat-preview" style={{ fontWeight: c.unread ? 700 : 500 }}>{c.last}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span className="chat-time">{c.time}</span>
              {c.unread && <div className="unread-dot" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE TAB ───
function ProfileTab({ xp, monthly, goal }) {
  const xpPct = Math.min(((xp % 500) / 500) * 100, 100);

  const zones = [];
  let lastZone = null;
  QUESTS.forEach((q, i) => {
    if (q.zone !== lastZone) { zones.push({ type: 'zone', zone: q.zone, key: `zone-${q.zone}` }); lastZone = q.zone; }
    zones.push({ type: 'quest', quest: q, idx: i, key: `q-${q.id}` });
  });

  return (
    <div className="page-content">
      <div className="xp-card">
        <div className="profile-row">
          <div className="avatar">🏔️</div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900 }}>김영남 고수님</div>
            <div style={{ fontSize: 13, color: 'var(--text-300)', fontWeight: 600, marginTop: 4 }}>
              서초3동 · 산친구 온도 <span style={{ color: '#FF6B35', fontWeight: 800 }}>38.5°</span>
            </div>
          </div>
        </div>
        <div className="xp-label"><span>현재 경험치</span><span style={{ color: 'var(--primary)', fontWeight: 800 }}>{xp} XP</span></div>
        <div className="xp-bar-bg"><div className="xp-bar-fill" style={{ width: `${xpPct}%` }} /></div>
        <div style={{ fontSize: 12, color: 'var(--text-400)', textAlign: 'right', marginTop: 5, fontWeight: 600 }}>다음 레벨까지 {500 - (xp % 500)} XP</div>
        <div style={{ display: 'flex', marginTop: 18 }}>
          {[{ label: '이번 달 산행', value: `${monthly}/${goal}회` }, { label: '참여 모임', value: '4개' }, { label: '장터 거래', value: '2회' }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
              <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-300)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 듀오 캐릭터 축하 배너 */}
      <div className="duo-cheer-banner">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SaniBear size={100} />
          <span className="duo-label">산이</span>
        </div>
        <div className="duo-speech">
          "아차산 도전 중이시군요!<br/>응원해요! 화이팅! 💪<br/>북한산도 곧 정복해요~"
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <YangiGoat size={100} />
          <span className="duo-label">양이</span>
        </div>
      </div>

      <div className="section" style={{ marginTop: 20, marginBottom: 4 }}>
        <div className="section-header">
          <span className="section-title">⛰️ 나의 등산 정복기</span>
          <span style={{ fontSize: 13, color: 'var(--text-400)', fontWeight: 600 }}>{QUESTS.length}개 퀘스트</span>
        </div>
      </div>

      <div className="roadmap-wrap">
        <div className="roadmap-track" />
        {zones.map(item => {
          if (item.type === 'zone') return <ZoneHeader key={item.key} zone={item.zone} />;
          const q = item.quest;
          const isEven = item.idx % 2 === 0;
          return (
            <div className="roadmap-row" key={item.key} style={{ flexDirection: isEven ? 'row' : 'row-reverse' }}>
              <div className={`roadmap-node ${q.done ? 'done' : q.current ? 'current' : ''}`}>
                {q.done ? <CheckCircle2 size={30} color="white" /> : q.current ? <span style={{ fontSize: 28 }}>{q.icon}</span> : <Lock size={22} color="#D1D5DB" />}
              </div>
              <div className="roadmap-label" style={{ textAlign: isEven ? 'left' : 'right' }}>
                <h5 style={{ color: q.done ? 'var(--primary)' : q.current ? 'var(--text-100)' : 'var(--text-400)' }}>
                  {q.icon} {q.label}
                </h5>
                <p style={{ color: q.done ? '#34D399' : q.current ? 'var(--accent)' : 'var(--text-400)' }}>
                  +{q.xp} XP {q.done ? '✅ 달성' : q.current ? '← 도전 중!' : '🔒 잠김'}
                </p>
              </div>
            </div>
          );
        })}
        <div style={{ textAlign: 'center', padding: '20px 24px 40px' }}>
          <div style={{ fontSize: 64 }}>👑</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginTop: 8 }}>전설의 한라산 신선</div>
          <div style={{ fontSize: 14, color: 'var(--text-400)', marginTop: 4 }}>모든 퀘스트를 달성한 최강의 산친구</div>
        </div>
      </div>
    </div>
  );
}
