
import React from 'react';
import { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
}

export const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brandPrimary font-bold text-lg mb-2 tracking-widest uppercase">Smart Solutions</h2>
          <p className="text-4xl md:text-5xl font-black text-brandDark mb-4 tracking-tighter">KT 프랜차이즈 전용 상품</p>
          <div className="w-16 h-1.5 bg-brandPrimary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            return (
              <div 
                key={product.id}
                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center text-brandPrimary shadow-sm border border-white/20">
                    <i className={`${product.icon} text-lg`}></i>
                  </div>
                </div>
                
                <div className="p-10 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black text-brandDark mb-4 tracking-tight">{product.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                    {product.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
