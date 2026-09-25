'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockProducts, getProductBySlug } from '@/lib/data/products';
import { mockArticles } from '@/lib/data/articles';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import {
  Star,
  ShoppingBag,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  BookOpen,
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';

function findProductInList(list: Product[], query: string): Product | undefined {
  if (!query) return undefined;
  const q = decodeURIComponent(query).toLowerCase().trim();
  return (
    list.find((p) => p.slug === query || p.slug.toLowerCase() === q) ||
    list.find((p) => p.id === query || p.id.toLowerCase() === q) ||
    list.find((p) => p.id && q.includes(p.id.toLowerCase())) ||
    list.find((p) => p.slug && q.includes(p.slug.toLowerCase())) ||
    list.find((p) => p.slug && p.slug.toLowerCase().includes(q))
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.id as string) || '';
  const [product, setProduct] = useState<Product | null>(() => {
    return getProductBySlug(slug) || null;
  });
  const [isLoading, setIsLoading] = useState(!product);

  useEffect(() => {
    // If already found in static products, no need to wait
    if (product) {
      setIsLoading(false);
    }
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products)) {
          const found = findProductInList(d.products, slug);
          if (found) setProduct(found);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h1>
        <p className="text-sm text-slate-500">Sản phẩm bạn đang tìm có thể đã hết hàng hoặc đổi đường dẫn.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Find articles mentioning or related to this product
  const relatedArticles = mockArticles.filter((a) =>
    a.relatedProductIds.includes(product.id)
  );

  const isAccessory = ['feeding_tools', 'hygiene_litter', 'toys_scratchers', 'grooming_health', 'accessories_collars'].includes(product.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-orange-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-600">Cửa hàng</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                isAccessory ? 'bg-teal-600' : 'bg-orange-500'
              }`}>
                {isAccessory ? 'Phụ Kiện & Đồ Dùng' : product.petType === 'cat' ? 'Dành Cho Mèo' : 'Dành Cho Chó'}
              </span>
            </div>
          </div>
        </div>

        {/* Info column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-500 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-sm">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount} đánh giá từ khách hàng)</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold">Mã SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {product.shortDesc}
            </p>
          </div>

          {/* Pricing box */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-baseline gap-3">
            <span className="text-3xl font-black text-orange-600">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            {product.originalPrice && (
              <span className="text-base text-slate-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-xs font-bold text-slate-500 ml-auto">
              Quy cách: <strong>{product.weight}</strong>
            </span>
          </div>

          {/* Add to cart section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-2xl p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3.5 px-6 rounded-2xl text-white font-black text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-teal-600 shadow-teal-200 scale-95'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200 hover:scale-105'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Thêm Vào Giỏ Hàng
                  </>
                )}
              </button>
            </div>

            {/* Quick value props */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Giao nhanh 2H</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>

          {/* Nutrition Table OR Specifications Table */}
          {product.nutritionAnalysis && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" /> Bảng Phân Tích Dinh Dưỡng
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Chất đạm (min)</span>
                  <span className="font-bold text-slate-800 text-sm">{product.nutritionAnalysis.protein}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Chất béo (min)</span>
                  <span className="font-bold text-slate-800 text-sm">{product.nutritionAnalysis.fat}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Chất xơ (max)</span>
                  <span className="font-bold text-slate-800 text-sm">{product.nutritionAnalysis.fiber}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Độ ẩm (max)</span>
                  <span className="font-bold text-slate-800 text-sm">{product.nutritionAnalysis.moisture}</span>
                </div>
              </div>
            </div>
          )}

          {product.specifications && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" /> Thông Số Kỹ Thuật & Chất Liệu
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {product.specifications.material && (
                  <p><strong className="text-slate-900">• Chất liệu:</strong> {product.specifications.material}</p>
                )}
                {product.specifications.capacity && (
                  <p><strong className="text-slate-900">• Dung tích / Công suất:</strong> {product.specifications.capacity}</p>
                )}
                {product.specifications.dimensions && (
                  <p><strong className="text-slate-900">• Kích thước:</strong> {product.specifications.dimensions}</p>
                )}
                {product.specifications.origin && (
                  <p><strong className="text-slate-900">• Đặc tính nổi bật:</strong> {product.specifications.origin}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients/Specs & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
        {product.ingredients && product.ingredients.length > 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">Thành Phần Nguyên Liệu</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              {product.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-600" /> Hướng Dẫn Sử Dụng & Bảo Quản
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.usageGuide || 'Sản phẩm dễ dàng lắp ráp và vệ sinh sau mỗi lần sử dụng. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.'}
            </p>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Lợi Ích Vượt Trội</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {product.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RELATED ARTICLES: Contextual Cross-link */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Cẩm Nang Kiến Thức Liên Quan Đến Sản Phẩm Này
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Đọc thêm lời khuyên của bác sĩ thú y về cách sử dụng và phối hợp thức ăn, đồ dùng hiệu quả nhất.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="group p-5 rounded-2xl bg-orange-50/50 border border-orange-100 hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-orange-600 uppercase">
                    {art.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{art.summary}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
