
import React from 'react';
import { InstallationCase } from '../types';

interface InstallationSectionProps {
  cases: InstallationCase[];
}

export const InstallationSection: React.FC<InstallationSectionProps> = ({ cases }) => {
  // 무한 루프 애니메이션을 위해 데이터를 반복
  const displayCases = cases.length > 0 ? [...cases, ...cases, ...cases] : [];

  return (
    <section id="cases" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-brandPrimary font-black text-lg mb-2 tracking-widest uppercase italic">Actual Results</h2>
            <p className="text-4xl md:text-5xl font-black text-brandDark tracking-tighter">솔루션 설치 사례</p>
          </div>
          <div className="h-px flex-grow bg-gray-200 hidden md:block mx-8 mb-4"></div>
          <p className="text-gray-400 font-medium text-right max-w-xs text-sm">
            전국 등촌샤브칼국수 매장에 도입된 KT의 스마트한 혁신 현장을 확인하세요.
          </p>
        </div>
      </div>

      {cases.length > 0 ? (
        <div className="relative w-full">
          {/* 좌우 페이드 효과 */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-ticker">
            {displayCases.map((item, index) => {
              return (
                <div key={`${item.id}-${index}`} className="px-5">
                  <div className="group relative block w-[320px] bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.storeName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brandDark/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-brandPrimary rounded-full group-hover:h-8 transition-all"></div>
                          <h3 className="text-2xl font-black text-white tracking-tighter group-hover:text-brandHighlight transition-colors">
                            {item.storeName}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20">
                        <i className="fa-solid fa-camera-retro text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <i className="fa-solid fa-image-portrait text-gray-200 text-6xl mb-4"></i>
            <p className="text-gray-400 font-bold uppercase tracking-widest">등록된 설치 사례가 없습니다</p>
          </div>
        </div>
      )}
    </section>
  );
};
