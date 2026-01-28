
import React from 'react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-brandDark text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="text-white font-black text-2xl tracking-tighter mb-6">
              등촌샤브<span className="text-white/60">칼국수</span> <span className="text-brandPrimary">x KT</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              {settings.footer.description}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">고객센터</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">상품 & 상담 문의</span>
                <span className="text-white font-bold text-lg">{settings.footer.supportPhone}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">하이오더 AS 문의</span>
                <span className="text-white font-medium">{settings.footer.hqPhone}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">인터넷 AS 문의</span>
                <span className="text-white font-medium">{settings.footer.faultPhone}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">법적 고지</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-brandHighlight cursor-pointer transition-colors">개인정보처리방침</li>
              <li className="hover:text-brandHighlight cursor-pointer transition-colors">이용약관</li>
              <li className="hover:text-brandHighlight cursor-pointer transition-colors">이메일무단수집거부</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-tight">
          <p>© 2024 KT & Deungchon Shabu-Kalguksu. All Rights Reserved.</p>
          <div className="flex gap-6">
            <i className="fa-brands fa-instagram text-xl hover:text-brandHighlight cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-youtube text-xl hover:text-brandHighlight cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-facebook text-xl hover:text-brandHighlight cursor-pointer transition-colors"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};
