
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { InstallationSection } from './components/InstallationSection';
import { ConsultationForm } from './components/ConsultationForm';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { SuccessModal } from './components/SuccessModal';
import { FloatingKakao } from './components/FloatingKakao';
import { SiteSettings, Consultation, NewsPost, Product, InstallationCase } from './types';

export const STORAGE_KEYS = {
  SETTINGS: 'deungchon_kt_master_v3_settings',
  NEWS: 'deungchon_kt_master_v3_news',
  PRODUCTS: 'deungchon_kt_master_v3_products',
  CASES: 'deungchon_kt_master_v3_cases',
  CONSULTATIONS: 'deungchon_kt_master_v3_consultations'
};

const INITIAL_SETTINGS: SiteSettings = {
  heroTitle: "등촌샤브칼국수 x KT",
  heroSubtitle: "전국 300여 개 매장의 성공 파트너, 차세대 프랜차이즈 DX 솔루션과 함께 미래를 설계합니다.",
  heroImageUrl: "https://images.unsplash.com/photo-1542623024-a797a755b8d0?auto=format&fit=crop&q=80&w=2070",
  announcement: "등촌샤브칼국수 가맹점 전용 프리미엄 DX 솔루션 프로모션 진행 중 - 지금 확인하세요!",
  webhookUrl: "",
  googleSheetsUrl: "", // 초기값
  buttonLabels: {
    navConsultation: "상담 신청",
    heroConsultation: "전문 상담 예약하기",
    heroSolutions: "솔루션 상세보기",
    submitConsultation: "상담 예약 신청하기"
  },
  footer: {
    description: "본 웹사이트는 등촌샤브칼국수 가맹 본부와 KT의 전략적 파트너십을 기반으로 운영되는 공식 프랜차이즈 지원 사이트입니다.",
    supportPhone: "1551-8891",
    hqPhone: "1577-0000",
    faultPhone: "100"
  }
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'KT 하이오더',
    description: '국내 1위 테이블 오더 솔루션. 매장 운영 효율성을 극대화하고 인건비를 획기적으로 절감합니다.',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
    icon: 'fa-solid fa-tablet-screen-button',
    linkUrl: '#consultation'
  },
  {
    id: '2',
    name: 'KT AI 서빙로봇',
    description: '안정적인 주행과 정밀한 서빙. 단순 반복 업무는 로봇에게 맡기고 직원은 서비스에 집중하세요.',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95961a?auto=format&fit=crop&q=80&w=800',
    icon: 'fa-solid fa-robot',
    linkUrl: '#consultation'
  }
];

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) return INITIAL_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        buttonLabels: { ...INITIAL_SETTINGS.buttonLabels, ...(parsed.buttonLabels || {}) },
        footer: { ...INITIAL_SETTINGS.footer, ...(parsed.footer || {}) }
      };
    } catch (e) { return INITIAL_SETTINGS; }
  });

  const [news, setNews] = useState<NewsPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cases, setCases] = useState<InstallationCase[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASES);
    return saved ? JSON.parse(saved) : [];
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const handleConsultationSubmit = async (data: Omit<Consultation, 'id' | 'createdAt'>) => {
    const newEntry: Consultation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString(),
    };
    
    // 1. 브라우저 저장
    const updated = [newEntry, ...consultations];
    setConsultations(updated);
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));

    // 2. 구글 스프레드시트 연동 전송
    if (settings.googleSheetsUrl) {
      try {
        await fetch(settings.googleSheetsUrl, {
          method: 'POST',
          mode: 'no-cors', // Apps Script 웹앱 CORS 대응
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        });
      } catch (e) { console.error('Google Sheets 연동 실패:', e); }
    }

    // 3. 기존 웹훅(디스코드 등) 전송
    if (settings.webhookUrl) {
      try {
        await fetch(settings.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🔔 **신규 상담 신청**\n매장명: ${newEntry.storeName}\n고객명: ${newEntry.customerName}\n연락처: ${newEntry.phoneNumber}\n관심사: ${newEntry.interests.join(', ')}`
          })
        });
      } catch (e) { console.error('Webhook 연동 실패:', e); }
    }
    
    setShowSuccessModal(true);
  };

  const handleAdminAuth = (password: string) => {
    if (password === '8999') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      window.scrollTo(0, 0);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  if (isAdmin) {
    return (
      <AdminPanel 
        settings={settings} setSettings={setSettings} 
        news={news} setNews={setNews} 
        products={products} setProducts={setProducts}
        cases={cases} setCases={setCases}
        consultations={consultations}
        onLogout={() => setIsAdmin(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar settings={settings} onAdminClick={() => setShowAdminLogin(true)} />
      <main className="flex-grow">
        <Hero settings={settings} />
        <div className="marquee-container">
          <div className="animate-marquee">
            {settings.announcement} &nbsp; &nbsp; &nbsp; &nbsp; {settings.announcement}
          </div>
        </div>
        <ProductSection products={products} />
        <InstallationSection cases={cases} />
        <NewsSection news={news} />
        <ConsultationForm settings={settings} onSubmit={handleConsultationSubmit} />
      </main>
      <Footer settings={settings} />
      <FloatingKakao />
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} onSubmit={handleAdminAuth} />}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </div>
  );
};

export default App;
