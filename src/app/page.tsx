'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockProducts } from '@/lib/data/products';
import { mockArticles } from '@/lib/data/articles';
import { useCart } from '@/context/CartContext';
import CalorieCalculator from '@/components/tools/CalorieCalculator';
import {
  Sparkles,
  ShoppingBag,
  Star,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  RefreshCw,
  PackageOpen,
  Layers,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [articles, setArticles] = useState(mockArticles);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const triggerAutoPublishDemo = async () => {
    setPublishing(true);
    setPublishSuccessMessage(null);
    try {
      const res = await fetch('/api/cron/auto-publish');
      const data = await res.json();
      if (data.success) {
        setPublishSuccessMessage(data.message + ` Bài viết: "${data.article.title}"`);
        // Refresh articles
        setArticles([...mockArticles]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const featuredFoods = mockProducts
    .filter((p) => ['dry_kibble', 'wet_pate', 'dietary', 'treats'].includes(p.category) && p.featured)
    .slice(0, 4);

  const featuredAccessories = mockProducts
    .filter((p) => ['feeding_tools', 'hygiene_litter', 'toys_scratchers', 'grooming_health', 'accessories_collars'].includes(p.category))
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-amber-50/40 to-transparent pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Nền tảng Thương mại Điện tử & Dinh Dưỡng Thú Cưng Thông Minh</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Dinh Dưỡng & Đồ Dùng{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Chuẩn Y Khoa
                </span>{' '}
                Cho Thú Cưng
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Hơn cả một cửa hàng thức ăn, DVDmultilPET kết hợp **cẩm nang chuyên sâu** từ bác sĩ thú y, **Trợ lý AI tư vấn 24/7** cùng hệ sinh thái phụ kiện, bát ăn công thái học, máy lọc nước tuần hoàn giúp boss sống khỏe trọn vẹn.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-300/60 hover:shadow-orange-400 transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4" /> Mua Thức Ăn Cho Boss
                </Link>
                <Link
                  href="/products?section=accessories"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-300/60 transition-all hover:scale-105"
                >
                  <PackageOpen className="w-4 h-4" /> Phụ Kiện & Đồ Dùng
                </Link>
                <Link
                  href="#calorie-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-sm sm:text-base transition-all hover:border-orange-300 shadow-sm"
                >
                  ⚖️ Tính Khẩu Phần Ăn
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-orange-100 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500">Chính hãng kiểm duyệt</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500">Bác sĩ AI trực tuyến</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">2 Giờ</div>
                  <div className="text-xs text-slate-500">Giao hỏa tốc nội thành</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80"
                  alt="Dinh dưỡng và phụ kiện thú cưng DVDmultilPET"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-lg">
                      🐱
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Combo Tiết Niệu: Hạt S/O + Máy Lọc Nước</p>
                      <p className="text-[11px] text-teal-600 font-medium">Phòng và trị sỏi bàng quang toàn diện</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                    Hot Combo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK LINKS (FOOD & ACCESSORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Khám Phá Các Danh Mục Thức Ăn & Đồ Dùng
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Phân loại khoa học giúp bạn dễ dàng tìm đúng món đồ phù hợp nhất cho thú cưng.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/products?pet=cat&category=dry_kibble"
            className="group p-4 rounded-3xl bg-amber-50/70 border border-amber-200/70 hover:bg-amber-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🐱
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Hạt Cho Mèo</h3>
            <p className="text-[10px] text-slate-500">Mèo con, sỏi thận</p>
          </Link>

          <Link
            href="/products?pet=dog&category=dry_kibble"
            className="group p-4 rounded-3xl bg-orange-50/70 border border-orange-200/70 hover:bg-orange-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🐶
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Hạt Cho Chó</h3>
            <p className="text-[10px] text-slate-500">Cá hồi Grain-Free</p>
          </Link>

          <Link
            href="/products?category=feeding_tools"
            className="group p-4 rounded-3xl bg-teal-50/70 border border-teal-200/70 hover:bg-teal-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🥣
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Bát Ăn & Máy Lọc</h3>
            <p className="text-[10px] text-slate-500">Chống gù, lọc ion 2.5L</p>
          </Link>

          <Link
            href="/products?category=hygiene_litter"
            className="group p-4 rounded-3xl bg-cyan-50/70 border border-cyan-200/70 hover:bg-cyan-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🚽
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Khay Cát & Vệ Sinh</h3>
            <p className="text-[10px] text-slate-500">Cát đậu nành Tofu</p>
          </Link>

          <Link
            href="/products?category=toys_scratchers"
            className="group p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200/70 hover:bg-indigo-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🧶
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Đồ Chơi & Cào Móng</h3>
            <p className="text-[10px] text-slate-500">Nhà cây Cat Tree</p>
          </Link>

          <Link
            href="/products?category=grooming_health"
            className="group p-4 rounded-3xl bg-rose-50/70 border border-rose-200/70 hover:bg-rose-100/70 hover:shadow-lg transition-all text-center space-y-2"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🧴
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Sữa Tắm & Da Lông</h3>
            <p className="text-[10px] text-slate-500">Trị nấm thảo dược</p>
          </Link>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS: THỨC ĂN DINH DƯỠNG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Dinh Dưỡng Đỉnh Cao</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Thức Ăn Thú Cưng Bác Sĩ Khuyên Dùng
            </h2>
          </div>
          <Link
            href="/products?section=food"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline"
          >
            Xem tất cả thức ăn <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-orange-200 transition-all flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow-sm">
                    {product.petType === 'cat' ? 'Mèo' : 'Chó'}
                  </span>
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount})</span>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-orange-600">
                      {product.price.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="text-[10px] text-slate-400">Quy cách: {product.weight}</div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md ${
                      addedId === product.id
                        ? 'bg-teal-600 scale-95'
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                    }`}
                    title="Thêm vào giỏ hàng"
                  >
                    {addedId === product.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEW SECTION: PHỤ KIỆN & ĐỒ DÙNG THIẾT YẾU CHO THÚ CƯNG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Đồ Dùng Đời Sống Boss</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Phụ Kiện & Đồ Dùng Thiết Yếu Bác Sĩ Đề Xuất
            </h2>
          </div>
          <Link
            href="/products?section=accessories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            Xem tất cả phụ kiện <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAccessories.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-teal-300 transition-all flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-sm">
                    Đồ Dùng Thiết Yếu
                  </span>
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount})</span>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-teal-700">
                      {product.price.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="text-[10px] text-slate-400">Trọng lượng: {product.weight}</div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md ${
                      addedId === product.id
                        ? 'bg-teal-600 scale-95'
                        : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
                    }`}
                    title="Thêm vào giỏ hàng"
                  >
                    {addedId === product.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE CALORIE CALCULATOR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalorieCalculator />
      </div>

      {/* 6. CONTEXTUAL KNOWLEDGE ARTICLES WITH IN-CONTENT PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Kiến Thức Nuôi Dưỡng Chuẩn Y Khoa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Cẩm Nang Chăm Sóc & Phối Hợp Dinh Dưỡng + Đồ Dùng
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                    {article.category}
                  </span>
                </div>
                {article.isAiGenerated && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Auto-Post
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="font-bold text-base text-slate-900 hover:text-teal-700 transition-colors line-clamp-2 leading-snug block"
                  >
                    {article.title}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Gắn kèm <strong className="text-orange-600 font-bold">{article.relatedProductIds.length} món gợi ý</strong>
                  </span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    Đọc ngay <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. AUTOMATED SCHEDULER LIVE DEMO TEST PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white p-6 sm:p-8 border border-orange-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Hệ Thống Tự Động Biên Tập & Lên Lịch Đăng Bài
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Cơ chế Tự Động Up Bài Mới Theo Giờ (Cron Engine)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Hệ thống được cấu hình để đúng các khung giờ vàng tự động lấy chủ đề, gọi Gemini AI viết bài chuẩn SEO, quét từ khóa để chèn link thức ăn & phụ kiện tương thích trong shop và xuất bản ngay lập tức.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
            <button
              onClick={triggerAutoPublishDemo}
              disabled={publishing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/30 hover:scale-105 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${publishing ? 'animate-spin' : ''}`} />
              {publishing ? 'AI Đang Viết & Đăng Bài...' : '⚡ Bấm Thử Nghiệm Kích Hoạt Auto-Publish Ngay'}
            </button>
            <span className="text-[11px] text-slate-400">
              Gọi trực tiếp API Endpoint: <code className="text-amber-300">/api/cron/auto-publish</code>
            </span>
          </div>
        </div>

        {publishSuccessMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{publishSuccessMessage}</span>
          </div>
        )}
      </section>
    </div>
  );
}
