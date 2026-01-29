
import React, { useState, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { SiteSettings, NewsPost, Consultation, Product, InstallationCase, FirebaseConfig } from '../types';
import { STORAGE_KEYS } from '../App';

interface AdminPanelProps {
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  news: NewsPost[];
  setNews: React.Dispatch<React.SetStateAction<NewsPost[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cases: InstallationCase[];
  setCases: React.Dispatch<React.SetStateAction<InstallationCase[]>>;
  consultations: Consultation[];
  onLogout: () => void;
}

const COMMON_ICONS = [
  'fa-solid fa-tablet-screen-button',
  'fa-solid fa-robot',
  'fa-solid fa-wifi',
  'fa-solid fa-video',
  'fa-solid fa-desktop',
  'fa-solid fa-microchip',
  'fa-solid fa-network-wired',
  'fa-solid fa-bell',
  'fa-solid fa-shield-halved',
  'fa-solid fa-print',
  'fa-solid fa-credit-card',
  'fa-solid fa-mobile-screen'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  settings, setSettings, news, setNews, products, setProducts, cases, setCases, consultations, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'buttons' | 'products' | 'news' | 'cases' | 'consultations' | 'footer' | 'integration'>('content');
  const [editingNews, setEditingNews] = useState<Partial<NewsPost> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCase, setEditingCase] = useState<Partial<InstallationCase> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFirebaseApp = (config: any) => {
    return getApps().length > 0 ? getApp() : initializeApp(config);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));

      if (settings.firebaseConfig?.projectId) {
        const app = getFirebaseApp(settings.firebaseConfig);
        const db = getFirestore(app);
        await setDoc(doc(db, 'site', 'master_data'), {
          settings,
          news,
          products,
          cases,
          updatedAt: new Date().toISOString()
        });
        alert('클라우드 서버에 동기화되었습니다.');
      } else {
        alert('로컬에 저장되었습니다.');
      }
    } catch (err: any) {
      alert('저장 실패: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    setProducts(newProducts);
  };

  const TABS = [
    { id: 'content', icon: 'fa-sliders', label: '메인' },
    { id: 'buttons', icon: 'fa-i-cursor', label: '버튼명' },
    { id: 'products', icon: 'fa-box', label: '상품' },
    { id: 'news', icon: 'fa-newspaper', label: '게시글' },
    { id: 'cases', icon: 'fa-camera-retro', label: '설치사례' },
    { id: 'consultations', icon: 'fa-clipboard-list', label: '상담내역' },
    { id: 'footer', icon: 'fa-window-maximize', label: '푸터' },
    { id: 'integration', icon: 'fa-gears', label: '시스템' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-brandDark text-white fixed h-full z-10 overflow-y-auto">
        <button onClick={onLogout} className="w-full text-left p-8 border-b border-white/5 hover:bg-white/5 transition-colors group">
          <div className="text-xl font-black italic text-brandPrimary flex items-center gap-2">KT <span className="text-white">Admin</span></div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 italic">V4 Cloud Synced</div>
        </button>
        <nav className="p-4 space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-brandPrimary text-white shadow-lg font-bold' : 'hover:bg-white/5 text-gray-400'}`}>
              <i className={`fa-solid ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="ml-64 flex-grow p-10">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-black text-brandDark italic tracking-tighter uppercase">{TABS.find(t => t.id === activeTab)?.label} Settings</h1>
          <button 
            disabled={isSaving}
            onClick={handleGlobalSave} 
            className="px-8 py-3 bg-brandPrimary text-white font-black rounded-xl shadow-lg hover:brightness-110 flex items-center gap-2 active:scale-95 transition-all"
          >
            {isSaving ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            전체 저장 및 배포
          </button>
        </header>

        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
             <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">띠배너 내용</label>
              <input type="text" value={settings.announcement} onChange={e => setSettings({...settings, announcement: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brandPrimary/10" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">히어로 영역</label>
                <input type="text" placeholder="제목" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-black text-xl outline-none" />
                <textarea rows={4} placeholder="부제목" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">이미지 설정</label>
                <div className="space-y-4">
                  <input type="text" placeholder="이미지 URL" value={settings.heroImageUrl} onChange={e => setSettings({...settings, heroImageUrl: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl text-xs" />
                  <div className="relative group">
                    {settings.heroImageUrl ? (
                      <img src={settings.heroImageUrl} className="w-full h-40 object-cover rounded-xl shadow-sm" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">No Image</div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl cursor-pointer transition-opacity">
                      <span className="text-white font-bold text-sm">이미지 업로드</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setSettings({...settings, heroImageUrl: url}))} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: '상단 네비 상담 버튼', key: 'navConsultation' },
                { label: '히어로 메인 버튼', key: 'heroConsultation' },
                { label: '상담 폼 제출 버튼', key: 'submitConsultation' },
                { label: '상품 자세히보기 버튼', key: 'heroSolutions' },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">{item.label}</label>
                  <input 
                    type="text" 
                    value={(settings.buttonLabels as any)[item.key]} 
                    onChange={e => setSettings({...settings, buttonLabels: {...settings.buttonLabels, [item.key]: e.target.value}})} 
                    className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold outline-none" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <button onClick={() => setEditingProduct({ icon: 'fa-solid fa-tablet-screen-button' })} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg hover:bg-black transition-all"><i className="fa-solid fa-plus mr-2"></i> 새 상품 추가</button>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {products.map((p, index) => (
                <div key={p.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveProduct(index, 'up')} className="text-gray-300 hover:text-brandPrimary"><i className="fa-solid fa-caret-up"></i></button>
                      <button onClick={() => moveProduct(index, 'down')} className="text-gray-300 hover:text-brandPrimary"><i className="fa-solid fa-caret-down"></i></button>
                    </div>
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brandPrimary shadow-inner">
                      <i className={`${p.icon} text-xl`}></i>
                    </div>
                    <img src={p.image} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                    <div className="font-black text-brandDark text-lg">{p.name}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingProduct(p)} className="px-4 py-2 bg-gray-100 rounded-lg font-bold hover:bg-gray-200">수정</button>
                    <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold hover:bg-red-100">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <button onClick={() => setEditingNews({})} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg hover:bg-black transition-all"><i className="fa-solid fa-plus mr-2"></i> 새 소식 작성</button>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {news.map(n => (
                <div key={n.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <img src={n.imageUrl} className="w-20 h-20 object-cover rounded-2xl" />
                    <div>
                      <div className="font-black text-brandDark">{n.title}</div>
                      <div className="text-xs text-gray-400">{n.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingNews(n)} className="px-4 py-2 bg-gray-100 rounded-lg font-bold">수정</button>
                    <button onClick={() => setNews(news.filter(x => x.id !== n.id))} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <button onClick={() => setEditingCase({})} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg hover:bg-black transition-all"><i className="fa-solid fa-camera mr-2"></i> 설치 사례 추가</button>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {cases.map(c => (
                <div key={c.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <img src={c.imageUrl} className="w-20 h-20 object-cover rounded-2xl" />
                    <div className="font-black text-brandDark">{c.storeName}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingCase(c)} className="px-4 py-2 bg-gray-100 rounded-lg font-bold">수정</button>
                    <button onClick={() => setCases(cases.filter(x => x.id !== c.id))} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2">푸터 설명 문구</label>
              <textarea rows={3} value={settings.footer.description} onChange={e => setSettings({...settings, footer: {...settings.footer, description: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: '대표 상담번호', key: 'supportPhone' },
                { label: '하이오더 AS', key: 'hqPhone' },
                { label: '기타 AS', key: 'faultPhone' },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2">{item.label}</label>
                  <input type="text" value={(settings.footer as any)[item.key]} onChange={e => setSettings({...settings, footer: {...settings.footer, [item.key]: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead>
                 <tr className="border-b border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                   <th className="pb-4 px-4">접수 일시</th>
                   <th className="pb-4 px-4">매장명</th>
                   <th className="pb-4 px-4">고객성함</th>
                   <th className="pb-4 px-4">연락처</th>
                   <th className="pb-4 px-4">관심사</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {consultations.length === 0 ? (
                   <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest italic">No data yet.</td></tr>
                 ) : (
                   consultations.map(c => (
                     <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                       <td className="py-5 px-4 text-xs font-bold text-gray-400">{c.createdAt}</td>
                       <td className="py-5 px-4 font-black">{c.storeName}</td>
                       <td className="py-5 px-4 font-bold">{c.customerName}</td>
                       <td className="py-5 px-4 font-black">{c.phoneNumber}</td>
                       <td className="py-5 px-4 text-xs font-bold text-brandPrimary uppercase">{c.interests.join(', ')}</td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === 'integration' && (
           <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-10 shadow-sm border border-gray-100">
             <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2"><i className="fa-solid fa-cloud"></i> Firebase Cloud Sync</h3>
               <div className="grid grid-cols-2 gap-4">
                 {['apiKey', 'projectId', 'authDomain', 'appId'].map(field => (
                   <div key={field}>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{field}</label>
                     <input 
                       type="password" 
                       value={(settings.firebaseConfig as any)?.[field] || ''} 
                       onChange={e => setSettings({...settings, firebaseConfig: {...(settings.firebaseConfig || {} as FirebaseConfig), [field]: e.target.value}})}
                       className="w-full p-4 bg-white border border-blue-100 rounded-xl text-xs font-mono" 
                     />
                   </div>
                 ))}
               </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-xs font-black text-gray-400 uppercase mb-2">Google Sheets URL</label>
                 <input type="text" value={settings.googleSheetsUrl} onChange={e => setSettings({...settings, googleSheetsUrl: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl text-xs" />
               </div>
               <div>
                 <label className="block text-xs font-black text-gray-400 uppercase mb-2">Webhook URL</label>
                 <input type="text" value={settings.webhookUrl} onChange={e => setSettings({...settings, webhookUrl: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl text-xs" />
               </div>
             </div>
           </div>
        )}
      </main>

      {/* Editing Modals */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] bg-brandDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingProduct.id 
              ? products.map(p => p.id === editingProduct.id ? ({...p, ...editingProduct} as Product) : p)
              : [{...editingProduct, id: Date.now().toString()} as Product, ...products];
            setProducts(updated);
            setEditingProduct(null);
          }} className="bg-white p-10 rounded-[40px] w-full max-w-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black">상품 설정</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <input type="text" placeholder="상품명" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" required />
                <textarea placeholder="설명" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-sm" rows={4} required />
              </div>
              <div className="space-y-4">
                <div className="relative group aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                  {editingProduct.image ? (
                    <img src={editingProduct.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">Image</div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white font-bold">사진 업로드</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditingProduct({...editingProduct, image: url}))} />
                  </label>
                </div>
                <input type="text" placeholder="또는 이미지 URL" value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full p-2 bg-gray-50 rounded-lg text-[10px]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-3">대표 아이콘 선택</label>
              <div className="grid grid-cols-6 gap-2">
                {COMMON_ICONS.map(icon => (
                  <button 
                    key={icon}
                    type="button"
                    onClick={() => setEditingProduct({...editingProduct, icon})}
                    className={`h-12 rounded-xl flex items-center justify-center text-xl transition-all ${editingProduct.icon === icon ? 'bg-brandPrimary text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    <i className={icon}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-grow py-4 bg-brandPrimary text-white font-black rounded-2xl active:scale-95 transition-all">설정 적용</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="px-8 py-4 bg-gray-100 rounded-2xl font-bold">닫기</button>
            </div>
          </form>
        </div>
      )}

      {editingNews && (
        <div className="fixed inset-0 z-[200] bg-brandDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingNews.id 
              ? news.map(n => n.id === editingNews.id ? ({...n, ...editingNews} as NewsPost) : n)
              : [{...editingNews, id: Date.now().toString(), date: new Date().toISOString().split('T')[0]} as NewsPost, ...news];
            setNews(updated);
            setEditingNews(null);
          }} className="bg-white p-10 rounded-[40px] w-full max-w-xl space-y-6">
            <h2 className="text-2xl font-black">게시글 작성</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <input type="text" placeholder="제목" value={editingNews.title || ''} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold" required />
                <textarea placeholder="내용" value={editingNews.content || ''} onChange={e => setEditingNews({...editingNews, content: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl" rows={6} required />
              </div>
              <div className="space-y-4 text-center">
                <div className="relative group aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-2">
                  {editingNews.imageUrl ? (
                    <img src={editingNews.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><i className="fa-solid fa-image text-3xl"></i></div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-xs font-bold">업로드</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditingNews({...editingNews, imageUrl: url}))} />
                  </label>
                </div>
                <input type="text" placeholder="URL 직접 입력" value={editingNews.imageUrl || ''} onChange={e => setEditingNews({...editingNews, imageUrl: e.target.value})} className="w-full p-2 bg-gray-50 rounded-lg text-[9px]" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-grow py-4 bg-brandPrimary text-white font-black rounded-2xl">저장하기</button>
              <button type="button" onClick={() => setEditingNews(null)} className="px-8 py-4 bg-gray-100 rounded-2xl">취소</button>
            </div>
          </form>
        </div>
      )}

      {editingCase && (
        <div className="fixed inset-0 z-[200] bg-brandDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingCase.id 
              ? cases.map(c => c.id === editingCase.id ? ({...c, ...editingCase} as InstallationCase) : c)
              : [{...editingCase, id: Date.now().toString(), installedSolutions: []} as InstallationCase, ...cases];
            setCases(updated);
            setEditingCase(null);
          }} className="bg-white p-10 rounded-[40px] w-full max-w-sm space-y-6">
            <h2 className="text-2xl font-black italic">CASE STUDY</h2>
            <div className="space-y-6">
              <div className="relative group aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-inner">
                {editingCase.imageUrl ? (
                  <img src={editingCase.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><i className="fa-solid fa-store text-4xl"></i></div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <span className="text-white font-black uppercase tracking-widest">Upload Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, (url) => setEditingCase({...editingCase, imageUrl: url}))} />
                </label>
              </div>
              <input type="text" placeholder="매장명 (예: 등촌샤브 강남점)" value={editingCase.storeName || ''} onChange={e => setEditingCase({...editingCase, storeName: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl font-black text-center" required />
              <input type="text" placeholder="이미지 URL (직접 입력)" value={editingCase.imageUrl || ''} onChange={e => setEditingCase({...editingCase, imageUrl: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-[10px]" />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-grow py-5 bg-brandPrimary text-white font-black rounded-2xl shadow-lg">사례 등록</button>
              <button type="button" onClick={() => setEditingCase(null)} className="px-8 py-5 bg-gray-100 rounded-2xl">닫기</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
