'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { mockProducts } from '@/lib/data/products';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { Filter, Star, ShoppingBag, CheckCircle, Search, Sparkles, PackageOpen } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả sản phẩm', group: 'all' },
  // Nhóm thức ăn
  { id: 'dry_kibble', label: '🌾 Hạt khô', group: 'food' },
  { id: 'wet_pate', label: '🥫 Pate ướt', group: 'food' },
  { id: 'dietary', label: '🏥 Hạt trị liệu', group: 'food' },
  { id: 'treats', label: '🦴 Bánh thưởng', group: 'food' },
  // Nhóm phụ kiện & đồ dùng thiết yếu
  { id: 'feeding_tools', label: '🥣 Bát ăn & Máy lọc nước', group: 'accessory' },
  { id: 'hygiene_litter', label: '🚽 Khay cát & Vệ sinh', group: 'accessory' },
  { id: 'toys_scratchers', label: '🧶 Đồ chơi & Cào móng', group: 'accessory' },
  { id: 'grooming_health', label: '🧴 Sữa tắm & Da móng', group: 'accessory' },
  { id: 'accessories_collars', label: '🦮 Vòng cổ & Dây dắt', group: 'accessory' },
  // Nhóm thuốc thú y & dược phẩm
  { id: 'veterinary_medicine', label: '💊 Thuốc Thú Y & Trị Liệu', group: 'medicine' },
];

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialPet = searchParams.get('pet') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSection = searchParams.get('section') || 'all';

  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [petFilter, setPetFilter] = useState<string>(initialPet);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [sectionFilter, setSectionFilter] = useState<string>(
    initialSection === 'accessories' ? 'accessory' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products) && d.products.length > 0) {
          setAllProducts(d.products);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Pet filter
      if (petFilter !== 'all' && product.petType !== petFilter && product.petType !== 'all') {
        return false;
      }

      // Section filter (food vs accessory vs medicine)
      const isFood = ['dry_kibble', 'wet_pate', 'dietary', 'treats'].includes(product.category);
      const isMedicine = product.category === 'veterinary_medicine';
      const isAccessory = !isFood && !isMedicine;

      if (sectionFilter === 'food' && !isFood) return false;
      if (sectionFilter === 'accessory' && !isAccessory) return false;
      if (sectionFilter === 'medicine' && !isMedicine) return false;

      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.shortDesc.toLowerCase().includes(q);
        const matchIng = product.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        const matchMat = product.specifications?.material?.toLowerCase().includes(q);
        const matchAct = product.veterinarySpecs?.activeIngredient?.toLowerCase().includes(q);
        const matchInd = product.veterinarySpecs?.indication?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchIng && !matchMat && !matchAct && !matchInd) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [petFilter, categoryFilter, sectionFilter, searchQuery, sortBy, allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Cửa Hàng Dinh Dưỡng, Thuốc Thú Y & Phụ Kiện Cho Thú Cưng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tuyển chọn thức ăn chuẩn y khoa, thuốc đặc trị Fivevet chính hãng và phụ kiện thiết yếu cao cấp.
          </p>
        </div>

        {/* Big Section Tabs: Tất cả vs Thức Ăn vs Đồ Dùng vs Thuốc Thú Y */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl shrink-0 gap-1">
          <button
            onClick={() => {
              setSectionFilter('all');
              setCategoryFilter('all');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả ({allProducts.length})
          </button>
          <button
            onClick={() => {
              setSectionFilter('food');
              setCategoryFilter('all');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === 'food'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-orange-600'
            }`}
          >
            🍲 Thức Ăn ({allProducts.filter(p => ['dry_kibble', 'wet_pate', 'dietary', 'treats'].includes(p.category)).length})
          </button>
          <button
            onClick={() => {
              setSectionFilter('medicine');
              setCategoryFilter('all');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === 'medicine'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            💊 Thuốc Thú Y ({allProducts.filter(p => p.category === 'veterinary_medicine').length})
          </button>
          <button
            onClick={() => {
              setSectionFilter('accessory');
              setCategoryFilter('all');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sectionFilter === 'accessory'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            🎾 Phụ Kiện ({allProducts.filter(p => !['dry_kibble', 'wet_pate', 'dietary', 'treats', 'veterinary_medicine'].includes(p.category)).length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Search box */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên hạt, máy lọc nước, bát ăn, cát vệ sinh, sữa tắm..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Sort selection */}
          <div className="sm:col-span-5 flex items-center justify-end gap-3">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="default">Phổ biến nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Species selector */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Thú cưng:
          </span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'cat', label: '🐱 Dành cho Mèo' },
            { id: 'dog', label: '🐶 Dành cho Chó' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPetFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                petFilter === item.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Detailed Category Tabs */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 block mb-2">
            Danh mục chi tiết:
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.filter((tab) => {
              if (sectionFilter === 'food') return tab.group === 'all' || tab.group === 'food';
              if (sectionFilter === 'accessory') return tab.group === 'all' || tab.group === 'accessory';
              return true;
            }).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === tab.id
                    ? tab.group === 'accessory'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-lg font-bold text-slate-700">Không tìm thấy sản phẩm phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Hãy thử đổi danh mục hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${
                    ['feeding_tools', 'hygiene_litter', 'toys_scratchers', 'grooming_health', 'accessories_collars'].includes(product.category)
                      ? 'bg-teal-600'
                      : 'bg-orange-500'
                  }`}>
                    {['feeding_tools', 'hygiene_litter', 'toys_scratchers', 'grooming_health', 'accessories_collars'].includes(product.category)
                      ? 'Đồ Dùng Thiết Yếu'
                      : product.petType === 'cat' ? 'Thức Ăn Mèo' : 'Thức Ăn Chó'}
                  </span>
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} đánh giá)</span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black text-orange-600">
                      {product.price.toLocaleString('vi-VN')}₫
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">Quy cách: {product.weight}</div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-md ${
                      addedId === product.id
                        ? 'bg-teal-600 scale-95'
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Đã thêm
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Mua Ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Đang tải danh mục sản phẩm...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
