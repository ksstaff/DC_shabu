
import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, addDoc, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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
  SETTINGS: 'deungchon_kt_v4_settings',
  NEWS: 'deungchon_kt_v4_news',
  PRODUCTS: 'deungchon_kt_v4_products',
  CASES: 'deungchon_kt_v4_cases',
  CONSULTATIONS: 'deungchon_kt_v4_consultations'
};

const INITIAL_SETTINGS: SiteSettings = {
  heroTitle: "등촌샤브칼국수 x KT",
  heroSubtitle: "전국 300여 개 매장의 성공 파트너, 차세대 프랜차이즈 DX 솔루션과 함께 미래를 설계합니다.",
  heroImageUrl: "https://images.unsplash.com/photo-1542623024-a797a755b8d0?auto=format&fit=crop&q=80&w=2070",
  announcement: "등촌샤브칼국수 가맹점 전용 프리미엄 DX 솔루션 프로모션 진행 중 - 지금 확인하세요!",
  webhookUrl: "",
  googleSheetsUrl: "",
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

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [news, setNews] = useState<NewsPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cases, setCases] = useState<InstallationCase[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Firebase 초기화 도우미 함수
  const getFirebaseApp = (config: any) => {
    try {
      return getApps().length > 0 ? getApp() : initializeApp(config);
    } catch (e) {
      console.error("Firebase 초기화 에러:", e);
      return null;
    }
  };

  // Firebase 실시간 데이터 리스닝
  useEffect(() => {
    let unsubscribeMaster: any = null;
    let unsubscribeConsult: any = null;

    if (settings.firebaseConfig?.projectId) {
      try {
        const app = getFirebaseApp(settings.firebaseConfig);
        if (!app) {
          setIsLoading(false);
          return;
        }
        const db = getFirestore(app);

        // 1. 설정 및 메인 데이터 실시간 동기화
        unsubscribeMaster = onSnapshot(doc(db, 'site', 'master_data'), (docSnap) => {
          if (docSnap.exists()) {
            const remoteData = docSnap.data();
            if (remoteData.settings) setSettings(prev => ({...prev, ...remoteData.settings}));
            if (remoteData.news) setNews(remoteData.news);
            if (remoteData.products) setProducts(remoteData.products);
            if (remoteData.cases) setCases(remoteData.cases);
          }
          setIsLoading(false);
        }, (err) => {
          console.error("Firestore 접근 권한 오류 (Rules 확인 필요):", err);
          setIsLoading(false);
        });

        // 2. 상담 내역 동기화
        const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
        unsubscribeConsult = onSnapshot(q, (querySnapshot) => {
          const list: Consultation[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as Consultation));
          setConsultations(list);
        });

      } catch (e) {
        console.error("Firebase 연결 프로세스 오류:", e);
        setIsLoading(false);
      }
    } else {
      // Firebase가 없을 경우 로컬 데이터 로드
      const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const savedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      const savedConsults = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);

      if (savedNews) setNews(JSON.parse(savedNews));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedCases) setCases(JSON.parse(savedCases));
      if (savedConsults) setConsultations(JSON.parse(savedConsults));
      
      setIsLoading(false);
    }

    return () => { 
      if (unsubscribeMaster) unsubscribeMaster(); 
      if (unsubscribeConsult) unsubscribeConsult();
    };
  }, [settings.firebaseConfig?.projectId]);

  const handleConsultationSubmit = async (data: Omit<Consultation, 'id' | 'createdAt'>) => {
    const newEntry = {
      ...data,
      createdAt: new Date().toLocaleString(),
    };
    
    // Firebase 전송
    if (settings.firebaseConfig?.projectId) {
      try {
        const app = getFirebaseApp(settings.firebaseConfig);
        if (app) {
          const db = getFirestore(app);
          await addDoc(collection(db, 'consultations'), newEntry);
        }
      } catch (e) {
        console.error('Firebase 상담 저장 실패:', e);
      }
    } else {
      // 로컬 전송
      const localEntry = { ...newEntry, id: Date.now().toString() };
      const updated = [localEntry, ...consultations];
      setConsultations(updated);
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));
    }

    // 기타 연동 (Sheets, Webhook)
    if (settings.googleSheetsUrl) {
      fetch(settings.googleSheetsUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(newEntry) });
    }
    if (settings.webhookUrl) {
      fetch(settings.webhookUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ content: `🔔 **신규 상담 신청**\n매장명: ${newEntry.storeName}\n고객명: ${newEntry.customerName}` }) });
    }
    
    setShowSuccessModal(true);
  };

  const handleAdminAuth = (password: string) => {
    if (password === '8999') {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brandDark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brandHighlight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-black italic tracking-widest animate-pulse uppercase">Syncing Cloud Data...</p>
        </div>
      </div>
    );
  }

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
          <div className="animate-marquee">{settings.announcement} &nbsp; &nbsp; &nbsp; &nbsp; {settings.announcement}</div>
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
