
import React from 'react';
import { NewsPost } from '../types';

interface NewsSectionProps {
  news: NewsPost[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-brandPrimary font-bold text-lg mb-2 tracking-widest uppercase">Press & Notice</h2>
            <p className="text-4xl md:text-5xl font-black text-brandDark tracking-tighter">최신 소식 및 공지</p>
          </div>
          <div className="hidden md:block">
            <button className="text-gray-400 font-bold hover:text-brandPrimary transition-colors flex items-center gap-2">
              전체보기 <i className="fa-solid fa-circle-plus"></i>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-6 shadow-sm group-hover:shadow-lg transition-all">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-brandPrimary text-white text-[10px] font-black px-3 py-1 rounded-md">
                  {post.date}
                </div>
              </div>
              <h3 className="text-xl font-black text-brandDark mb-3 group-hover:text-brandPrimary transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                {post.content}
              </p>
            </article>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 text-gray-400 font-bold">
            등록된 소식이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};
