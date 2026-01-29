
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface SiteSettings {
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  buttonLabels: {
    navConsultation: string;
    heroConsultation: string;
    heroSolutions: string;
    submitConsultation: string;
  };
  footer: {
    description: string;
    supportPhone: string;
    hqPhone: string;
    faultPhone: string;
  };
  webhookUrl: string;
  googleSheetsUrl: string;
  firebaseConfig?: FirebaseConfig; // Firebase 설정 추가
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  linkUrl: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

export interface InstallationCase {
  id: string;
  storeName: string;
  description: string;
  imageUrl: string;
  installedSolutions: string[];
  linkUrl: string;
}

export interface Consultation {
  id: string;
  createdAt: string;
  storeName: string;
  customerName: string;
  phoneNumber: string;
  interests: string[];
}
