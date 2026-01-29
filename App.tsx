import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

/* =========================
   Firebase ENV Config (공용)
========================= */
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* =========================
   Local Storage Keys
========================= */
export const STORAGE_KEYS = {
  SETTINGS: 'deungchon_kt_v4_settings',
  NEWS: 'deungchon_kt_v4_news',
  PRODUCTS: 'deungchon_kt_v4_products',
  CASES: 'deungchon_kt_v4_cases',
  CONSULTATIONS: 'deungchon_kt_v4_consultations',
};

/* =========================
   Initial Settings
========================= */
const INITIAL_SETTINGS: SiteSettings = {
  heroTitle: '등촌샤브칼국수 x KT',
  heroSubtitle: '전국 300여 개 매장의 성공 파트너, 차세대 프랜차이즈 DX 솔루션과 함께 미래를 설계합니다.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1542623024-a797a755b8d0?auto=format&fit=crop&q=80&w=2070',
  announcement:
    '등촌샤브칼국수 가맹점 전용 프리미엄 DX 솔루션 프로모션 진행 중 - 지금 확인하세요!',
  webhookUrl: '',
  googleSheetsUrl: '',
  buttonLabels: {
    navConsultation: '상담 신청',
    heroConsultation: '전문 상담 예약하기',
    heroSolutions: '솔루션 상세보기',
    submitConsultation: '상담 예약 신청하기',
  },
  footer: {
    description:
      '본 웹사이트는 등촌샤브칼국수 가맹 본부와 KT의 전략적 파트너십을 기반으로 운영되는 공식 프랜차이즈 지원 사이트입니다.',
    supportPhone: '1551-8891',
    hqPhone: '1577-0000',
    faultPhone: '100',
  },
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

  /* =========================
     Firebase Helper
  ========================= */
  const getFirebaseApp = (config: any) => {
    try {
      return getApps().length ? getApp() : initializeApp(config);
    } catch (e) {
      console.error('Firebase init error:', e);
      return null;
    }
  };

  /* =========================
     Firebase Config 결정
  ========================= */
  const firebaseConfig =
    settings.firebaseConfig?.projectId
      ? settings.firebaseConfig
      : DEFAULT_FIREBASE_CONFIG;

  const hasFirebase = !!firebaseConfig?.projectId;

  /* =========================
     Firebase Realtime Sync
  ========================= */
  useEffect(() => {
    let unsubMaster: any;
    let unsubConsult: any;

    if (hasFirebase) {
      const app = getFirebaseApp(firebaseConfig);
      if (!app) {
        setIsLoading(false);
        return;
      }

      const db = getFirestore(app);

      // 메인 데이터
      unsubMaster = onSnapshot(doc(db, 'site', 'master_data'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
          if (data.news) setNews(data.news);
          if (data.products) setProducts(data.products);
          if (data.cases) setCases(data.cases);
        }
        setIsLoading(false);
      });

      // 상담 내역
      const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
      unsubConsult = onSnapshot(q, (qs) => {
        const list: Consultation[] = [];
        qs.forEach((d) => list.push({ id: d.id, ...d.data() } as Consultation));
        setConsultations(list);
      });
    } else {
      setIsLoading(false);
    }

    return () => {
      unsubMaster && unsubMaster();
      unsubConsult && unsubConsult();
    };
  }, [firebaseConfig?.projectId]);

  /* =========================
     상담 제출
  ========================= */
  const handleConsultationSubmit = async (data: Omit<Consultation, 'id' | 'createdAt'>) => {
    const entry = {
      ...data,
      createdAt: serverTimestamp(),
    };

    if (hasFirebase) {
      const app = getFirebaseApp(firebaseConfig);
      if (app) {
        const db = getFirestore(app);
        await addDoc(collection(db, 'consultations'), entry);
      }
    }

    if (settings.googleSheetsUrl) {
      fetch(settings.googleSheetsUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(entry) });
    }

    if (settings.webhookUrl) {
      fetch(settings.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          content: `🔔 신규 상담\n매장명: ${data.storeName}\n고객명: ${data.customerName}`,
        }),
      });
    }

    setShowSuccessModal(true);
  };

  /* =========================
     Admin Auth (임시)
  ========================= */
  const handleAdminAuth = (password: string) => {
    if (password === '8999') {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  /* =========================
     Render
  ========================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brandDark text-white">
        Syncing Cloud Data...
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminPanel
        settings={settings}
        setSettings={setSettings}
        news={news}
        setNews={setNews}
        products={products}
        setProducts={setProducts}
        cases={cases}
        setCases={setCases}
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
