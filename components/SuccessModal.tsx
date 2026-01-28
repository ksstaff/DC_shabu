
import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brandDark/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-10 text-center transform animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-brandHighlight/10 text-brandHighlight rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-2xl font-black text-brandDark mb-4 tracking-tight">상담 신청이 완료되었습니다</h2>
        <p className="text-gray-500 leading-relaxed mb-10 text-sm font-medium">
          등촌샤브 x KT 전담 매니저가 확인 후<br />신속하게 안내 전화를 드리겠습니다.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-5 bg-brandPrimary text-white font-black text-lg rounded-2xl hover:brightness-110 transition-all shadow-xl active:scale-95"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};