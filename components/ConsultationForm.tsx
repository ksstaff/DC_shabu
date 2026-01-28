
import React, { useState } from 'react';
import { Consultation, SiteSettings } from '../types';

interface ConsultationFormProps {
  settings: SiteSettings;
  onSubmit: (data: Omit<Consultation, 'id' | 'createdAt'>) => Promise<void>;
}

const INTERESTS = ['하이오더', '서빙로봇', 'CCTV', '인터넷'];

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ settings, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    customerName: '',
    phoneNumber: '',
    interests: [] as string[],
    consent: false
  });

  const handleCheckbox = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.consent) return alert('개인정보 수집 동의가 필요합니다.');
    if (formData.interests.length === 0) return alert('관심 상품을 최소 하나 이상 선택해주세요.');
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        storeName: formData.storeName,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        interests: formData.interests
      });

      setFormData({
        storeName: '',
        customerName: '',
        phoneNumber: '',
        interests: [],
        consent: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-brandDark p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brandHighlight/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-6">전문 상담 신청</h2>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  등촌샤브칼국수 x KT 공식 공급 파트너의 특별한 혜택을 놓치지 마세요.
                  전문 매니저가 매장을 직접 방문하여 최적의 DX 솔루션을 제안해 드립니다.
                </p>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brandPrimary/20 flex items-center justify-center text-brandPrimary">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span className="font-bold">{settings.footer.supportPhone} (전담팀)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brandHighlight/20 flex items-center justify-center text-brandHighlight">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <span>평일 09:00 - 18:00</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-6">
              <div>
                <label className="block text-sm font-bold text-brandDark mb-2">매장명</label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={formData.storeName}
                  onChange={e => setFormData({...formData, storeName: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brandPrimary focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                  placeholder="등촌샤브칼국수 OOO점"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brandDark mb-2">성함</label>
                  <input 
                    type="text" 
                    required
                    disabled={isSubmitting}
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brandDark mb-2">연락처</label>
                  <input 
                    type="tel" 
                    required
                    disabled={isSubmitting}
                    value={formData.phoneNumber}
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brandDark mb-4">관심 상품 (중복 선택 가능)</label>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map(item => (
                    <button
                      key={item}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleCheckbox(item)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-bold transition-all ${
                        formData.interests.includes(item)
                          ? 'bg-brandPrimary border-brandPrimary text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-brandPrimary'
                      } disabled:opacity-50`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    required
                    disabled={isSubmitting}
                    checked={formData.consent}
                    onChange={e => setFormData({...formData, consent: e.target.checked})}
                    className="mt-1 w-4 h-4 text-brandPrimary border-gray-300 rounded focus:ring-brandPrimary"
                  />
                  <span className="text-[11px] text-gray-500 group-hover:text-gray-700 transition-colors leading-snug">
                    본인은 KT의 개인정보 수집 및 이용 안내에 동의하며, 위 기재 사항이 사실임을 확인합니다.
                  </span>
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-brandDark text-brandHighlight font-black text-lg rounded-xl hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i> 접수 중...
                  </>
                ) : (
                  settings.buttonLabels.submitConsultation
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};