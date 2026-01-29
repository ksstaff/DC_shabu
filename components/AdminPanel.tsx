
import React, { useState, useRef } from 'react';
import { SiteSettings, NewsPost, Consultation, Product, InstallationCase } from '../types';
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

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  settings, setSettings, news, setNews, products, setProducts, cases, setCases, consultations, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'buttons' | 'products' | 'news' | 'cases' | 'consultations' | 'footer' | 'integration'>('content');
  const [editingNews, setEditingNews] = useState<Partial<NewsPost> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCase, setEditingCase] = useState<Partial<InstallationCase> | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        callback(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
      alert('모든 설정이 브라우저에 영구 저장되었습니다.');
    } catch (err) {
      alert('저장 용량이 부족합니다. 이미지 크기를 줄여주세요.');
    }
  };

  const handleExportData = () => {
    const data = { settings, news, products, cases };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deungchon_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) setSettings(data.settings);
        if (data.news) setNews(data.news);
        if (data.products) setProducts(data.products);
        if (data.cases) setCases(data.cases);
        alert('백업 데이터를 불러왔습니다. 반드시 상단의 전체 저장을 눌러주세요.');
      } catch (err) { alert('파일이 유효하지 않습니다.'); }
    };
    reader.readAsText(file);
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
        <button 
          onClick={onLogout}
          className="w-full text-left p-8 border-b border-white/5 hover:bg-white/5 transition-colors group"
        >
          <div className="text-xl font-black italic text-brandPrimary flex items-center gap-2">
            KT <span className="text-white">Admin</span>
            <i className="fa-solid fa-house text-[10px] text-white/20 group-hover:text-brandPrimary transition-colors"></i>
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Exit to Homepage</div>
        </button>

        <nav className="p-4 space-y-1">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-brandPrimary text-white shadow-lg font-bold' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <i className={`fa-solid ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 absolute bottom-0 w-full">
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors text-sm font-bold">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> 로그아웃
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-grow p-10">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-black text-brandDark">{TABS.find(t => t.id === activeTab)?.label}</h1>
          {['content', 'buttons', 'products', 'news', 'cases', 'footer', 'integration'].includes(activeTab) && (
            <button 
              onClick={() => handleGlobalSave()} 
              className="px-8 py-3 bg-brandPrimary text-white font-black rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i> 전체 변경 사항 저장
            </button>
          )}
        </header>

        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
             <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">띠배너 내용</label>
              <input type="text" value={settings.announcement} onChange={e => setSettings({...settings, announcement: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl outline-none font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">히어로 타이틀 & 서브</label>
                <input type="text" placeholder="히어로 제목" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
                <textarea rows={4} placeholder="히어로 부제목" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">히어로 배경 이미지</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50">
                   {settings.heroImageUrl && <img src={settings.heroImageUrl} className="h-40 w-full object-cover rounded-xl mb-4 shadow-md" />}
                   <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (url) => setSettings({...settings, heroImageUrl: url}))} className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brandDark italic mb-6">Button Labels</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">상단 네비 상담버튼</label>
                <input type="text" value={settings.buttonLabels.navConsultation} onChange={e => setSettings({...settings, buttonLabels: {...settings.buttonLabels, navConsultation: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">히어로 메인 상담버튼</label>
                <input type="text" value={settings.buttonLabels.heroConsultation} onChange={e => setSettings({...settings, buttonLabels: {...settings.buttonLabels, heroConsultation: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">상담폼 제출버튼</label>
                <input type="text" value={settings.buttonLabels.submitConsultation} onChange={e => setSettings({...settings, buttonLabels: {...settings.buttonLabels, submitConsultation: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setEditingProduct({})} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg flex items-center gap-2">
                <i className="fa-solid fa-plus"></i> 새 상품 등록
              </button>
              <span className="text-xs font-bold text-gray-400 italic">* 상품 옆 화살표로 진열 순서를 바꿀 수 있습니다.</span>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {products.map((p, index) => (
                <div key={p.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col gap-1">
                      <button 
                        disabled={index === 0}
                        onClick={() => moveProduct(index, 'up')}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === 0 ? 'opacity-10 cursor-not-allowed' : 'text-brandDark'}`}
                      >
                        <i className="fa-solid fa-caret-up"></i>
                      </button>
                      <button 
                        disabled={index === products.length - 1}
                        onClick={() => moveProduct(index, 'down')}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === products.length - 1 ? 'opacity-10 cursor-not-allowed' : 'text-brandDark'}`}
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </button>
                    </div>
                    <img src={p.image} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                    <div className="font-black text-brandDark text-lg">{p.name}</div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProduct(p)} className="px-4 py-2 bg-gray-100 text-brandDark rounded-lg font-bold hover:bg-gray-200 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) setProducts(products.filter(x => x.id !== p.id)); }} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold hover:bg-red-100 transition-colors">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <button onClick={() => setEditingNews({})} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> 새 게시글 작성
            </button>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {news.map(n => (
                <div key={n.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <img src={n.imageUrl} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                    <div className="font-black text-brandDark text-lg">{n.title}</div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingNews(n)} className="px-4 py-2 bg-gray-100 text-brandDark rounded-lg font-bold hover:bg-gray-200 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) setNews(news.filter(x => x.id !== n.id)); }} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold hover:bg-red-100 transition-colors">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <button onClick={() => setEditingCase({})} className="bg-brandDark text-brandHighlight px-8 py-4 rounded-xl font-black shadow-lg flex items-center gap-2">
              <i className="fa-solid fa-camera"></i> 새 설치 사례 추가
            </button>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y overflow-hidden">
              {cases.map(c => (
                <div key={c.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <img src={c.imageUrl} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                    <div className="font-black text-brandDark text-lg">{c.storeName}</div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingCase(c)} className="px-4 py-2 bg-gray-100 text-brandDark rounded-lg font-bold hover:bg-gray-200 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) setCases(cases.filter(x => x.id !== c.id)); }} className="px-4 py-2 bg-red-50 text-brandPrimary rounded-lg font-bold hover:bg-red-100 transition-colors">삭제</button>
                  </div>
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
                   <th className="pb-4 px-4">고객 성함</th>
                   <th className="pb-4 px-4">연락처</th>
                   <th className="pb-4 px-4">관심사</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {consultations.length === 0 ? (
                   <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-bold uppercase tracking-widest">접수된 상담 내역이 없습니다.</td></tr>
                 ) : (
                   consultations.map(c => (
                     <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                       <td className="py-5 px-4 text-xs text-gray-400 font-bold">{c.createdAt}</td>
                       <td className="py-5 px-4 font-black">{c.storeName}</td>
                       <td className="py-5 px-4 font-bold text-gray-600">{c.customerName}</td>
                       <td className="py-5 px-4 font-black">{c.phoneNumber}</td>
                       <td className="py-5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {c.interests.map(i => <span key={i} className="bg-brandHighlight/10 text-brandHighlight px-2 py-0.5 rounded text-[10px] font-bold">{i}</span>)}
                          </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === 'footer' && (
          <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brandDark italic mb-6">Footer Settings</h2>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">푸터 공지 문구</label>
              <textarea rows={3} value={settings.footer.description} onChange={e => setSettings({...settings, footer: {...settings.footer, description: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">대표 상담 번호</label>
                <input type="text" value={settings.footer.supportPhone} onChange={e => setSettings({...settings, footer: {...settings.footer, supportPhone: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">하이오더 AS 번호</label>
                <input type="text" value={settings.footer.hqPhone} onChange={e => setSettings({...settings, footer: {...settings.footer, hqPhone: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">기타 장애 신고 번호</label>
                <input type="text" value={settings.footer.faultPhone} onChange={e => setSettings({...settings, footer: {...settings.footer, faultPhone: e.target.value}})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
           <div className="bg-white rounded-3xl p-10 max-w-4xl space-y-10 shadow-sm border border-gray-100">
             <div className="space-y-8">
               <h3 className="text-xl font-black text-brandDark italic border-b pb-2">Automation & Data Sync</h3>
               
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <i className="fa-brands fa-google text-green-600"></i>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Google Spreadsheet API URL (웹 앱)</label>
                 </div>
                 <input 
                   type="text" 
                   placeholder="https://script.google.com/macros/s/.../exec" 
                   value={settings.googleSheetsUrl} 
                   onChange={e => setSettings({...settings, googleSheetsUrl: e.target.value})} 
                   className="w-full p-4 bg-gray-50 border-0 rounded-xl font-mono text-xs focus:ring-2 focus:ring-green-500/20" 
                 />
                 <p className="mt-2 text-[10px] text-gray-400 leading-relaxed font-medium">
                   * 구글 스프레드시트의 '도구 &gt; 스크립트 에디터'에서 웹 앱으로 배포한 URL을 입력하세요.<br />
                   상담 신청 시 자동으로 시트의 새로운 행으로 데이터가 추가됩니다.
                 </p>
               </div>

               <div className="pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2 mb-2">
                   <i className="fa-solid fa-bell text-indigo-500"></i>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Discord/Slack Webhook URL</label>
                 </div>
                 <input 
                   type="text" 
                   placeholder="https://discord.com/api/webhooks/..." 
                   value={settings.webhookUrl} 
                   onChange={e => setSettings({...settings, webhookUrl: e.target.value})} 
                   className="w-full p-4 bg-gray-50 border-0 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/20" 
                 />
               </div>
             </div>

             <div className="pt-10 border-t border-gray-100 flex flex-col gap-6">
               <h3 className="text-xl font-black text-brandDark italic">System Backup</h3>
               <div className="flex gap-4">
                 <button onClick={handleExportData} className="px-6 py-4 bg-brandDark text-brandHighlight rounded-xl font-black shadow-lg flex items-center gap-2">
                   <i className="fa-solid fa-download"></i> 전체 데이터 백업
                 </button>
                 <input type="file" accept=".json" ref={importFileRef} onChange={handleImportData} className="hidden" />
                 <button onClick={() => importFileRef.current?.click()} className="px-6 py-4 bg-white border-2 border-brandDark text-brandDark rounded-xl font-black hover:bg-gray-50 flex items-center gap-2">
                   <i className="fa-solid fa-upload"></i> 데이터 복구 (JSON)
                 </button>
               </div>
             </div>
           </div>
        )}
      </main>

      {/* Modals remain same as previous version */}
      {editingNews && (
        <div className="fixed inset-0 z-[100] bg-brandDark/80 flex items-center justify-center p-4 backdrop-blur-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingNews.id 
              ? news.map(n => n.id === editingNews.id ? ({...n, ...editingNews} as NewsPost) : n)
              : [{...editingNews, id: Date.now().toString(), date: new Date().toISOString().split('T')[0]} as NewsPost, ...news];
            setNews(updated);
            setEditingNews(null);
          }} className="bg-white p-10 rounded-3xl w-full max-w-xl space-y-6 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black">게시글 편집</h2>
            <input type="text" placeholder="제목" value={editingNews.title || ''} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" required />
            <textarea placeholder="내용" value={editingNews.content || ''} onChange={e => setEditingNews({...editingNews, content: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" rows={6} required />
            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (url) => setEditingNews({...editingNews, imageUrl: url}))} className="text-xs" />
            <div className="flex gap-3">
              <button type="submit" className="flex-grow bg-brandPrimary text-white py-4 rounded-xl font-black">적용</button>
              <button type="button" onClick={() => setEditingNews(null)} className="px-8 bg-gray-100 py-4 rounded-xl">취소</button>
            </div>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-brandDark/80 flex items-center justify-center p-4 backdrop-blur-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingProduct.id 
              ? products.map(p => p.id === editingProduct.id ? ({...p, ...editingProduct} as Product) : p)
              : [{...editingProduct, id: Date.now().toString()} as Product, ...products];
            setProducts(updated);
            setEditingProduct(null);
          }} className="bg-white p-10 rounded-3xl w-full max-w-xl space-y-6 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black">상품 편집</h2>
            <input type="text" placeholder="상품명" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" required />
            <textarea placeholder="상품 설명" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" rows={4} required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="아이콘 (font-awesome)" value={editingProduct.icon || 'fa-solid fa-box'} onChange={e => setEditingProduct({...editingProduct, icon: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400">상품 이미지</label>
                <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (url) => setEditingProduct({...editingProduct, image: url}))} className="text-xs" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-grow bg-brandPrimary text-white py-4 rounded-xl font-black">적용</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="px-8 bg-gray-100 py-4 rounded-xl">취소</button>
            </div>
          </form>
        </div>
      )}

      {editingCase && (
        <div className="fixed inset-0 z-[100] bg-brandDark/80 flex items-center justify-center p-4 backdrop-blur-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            const updated = editingCase.id 
              ? cases.map(c => c.id === editingCase.id ? ({...c, ...editingCase} as InstallationCase) : c)
              : [{...editingCase, id: Date.now().toString(), installedSolutions: [], linkUrl: editingCase.linkUrl || '#'} as InstallationCase, ...cases];
            setCases(updated);
            setEditingCase(null);
          }} className="bg-white p-10 rounded-3xl w-full max-w-xl space-y-6 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black">설치 사례 편집</h2>
            <input type="text" placeholder="지점명" value={editingCase.storeName || ''} onChange={e => setEditingCase({...editingCase, storeName: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl font-bold" required />
            <input type="text" placeholder="링크 URL" value={editingCase.linkUrl || ''} onChange={e => setEditingCase({...editingCase, linkUrl: e.target.value})} className="w-full p-4 bg-gray-50 border-0 rounded-xl" />
            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (url) => setEditingCase({...editingCase, imageUrl: url}))} className="text-xs" />
            <div className="flex gap-3">
              <button type="submit" className="flex-grow bg-brandPrimary text-white py-4 rounded-xl font-black">적용</button>
              <button type="button" onClick={() => setEditingCase(null)} className="px-8 bg-gray-100 py-4 rounded-xl">취소</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
