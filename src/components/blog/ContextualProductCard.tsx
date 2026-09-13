'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Star, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  product: Product;
  calloutTitle?: string;
}

export default function ContextualProductCard({ product, calloutTitle }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 p-5 sm:p-6 shadow-md shadow-orange-100/50 hover:border-orange-300 transition-all">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
          ⭐ {calloutTitle || 'Sản phẩm Bác sĩ Khuyên dùng trong bài viết'}
        </span>
        <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
          {product.petType === 'cat' ? 'Dành cho Mèo' : product.petType === 'dog' ? 'Dành cho Chó' : 'Tất cả thú cưng'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Product Image */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-white border border-orange-100 shrink-0 shadow-inner">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 144px, 160px"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 text-left space-y-2">
          <Link
            href={`/products/${product.slug}`}
            className="text-lg font-bold text-slate-800 hover:text-orange-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-700 font-bold">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Quy cách: {product.weight}</span>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-orange-600">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-white transition-colors"
              >
                Chi tiết <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleAdd}
                className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all ${
                  added
                    ? 'bg-teal-600 text-white scale-95'
                    : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-200'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Mua Nhanh
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
