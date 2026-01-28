
import React, { useState } from 'react';

interface AdminLoginProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSubmit }) => {
  const [pass, setPass] = useState('');

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-brandDark/90 backdrop-blur-lg">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-10 transform animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-brandPrimary rounded-full"></div>
            <h2 className="text-3xl font-black text-brandDark tracking-tighter italic">Admin</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-brandDark transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(pass); }} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Protected Access Key</label>
            <input 
              autoFocus
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full px-4 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-4 focus:ring-brandPrimary/10 text-center text-4xl tracking-[0.4em] outline-none font-black text-brandDark"
              placeholder="••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-brandDark text-brandHighlight font-black text-lg rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            대시보드 접속하기
          </button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-xs font-medium">관리 본부 승인 계정으로만 접근이 가능합니다.</p>
      </div>
    </div>
  );
};