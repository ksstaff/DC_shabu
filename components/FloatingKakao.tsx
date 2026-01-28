
import React from 'react';

export const FloatingKakao: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center group">
      {/* Persistent Label / Tooltip */}
      <div className="mr-3 pointer-events-none translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
        <div className="bg-brandDark text-white text-[11px] font-black px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
          <span className="text-brandHighlight">FREE</span> 실시간 카톡 상담
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brandDark rotate-45"></div>
        </div>
      </div>

      {/* Button Container */}
      <div className="relative">
        <a
          href="http://pf.kakao.com/_xlWgqG"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-16 h-16 bg-[#FEE500] text-[#3c1e1e] rounded-full flex flex-col items-center justify-center shadow-[0_15px_35px_rgba(254,229,0,0.5)] hover:shadow-[0_20px_45px_rgba(254,229,0,0.7)] hover:-translate-y-3 transition-all duration-500 active:scale-90 animate-wobble"
        >
          <i className="fa-solid fa-comment text-2xl mb-0.5"></i>
          <span className="text-[9px] font-black uppercase tracking-tighter">Talk</span>
          
          {/* Multi-layered Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-[#FEE500] animate-ping opacity-30"></span>
          <span className="absolute inset-0 rounded-full bg-[#FEE500] animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></span>
        </a>

        {/* Small constant notification dot */}
        <span className="absolute top-0 right-0 w-5 h-5 bg-brandPrimary border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-black animate-bounce shadow-md">
          1
        </span>
      </div>
    </div>
  );
};
