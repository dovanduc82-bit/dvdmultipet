'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockProducts } from '@/lib/data/products';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  ShoppingBag,
  Printer,
  Calculator,
  Search,
  ArrowRight,
  Filter,
  FileText,
  PhoneCall,
  Clock,
  Sparkles,
  Info,
  Layers,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

export default function PharmacyPage() {
  const [allProducts, setAllProducts] = useState<Product[]>(() =>
    mockProducts.filter((p) => p.category === 'veterinary_medicine')
  );
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'catalog'>('grid');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dosage Calculator state
  const [calcPet, setCalcPet] = useState<'dog' | 'cat'>('dog');
  const [calcWeight, setCalcWeight] = useState<number>(12);
  const [calcIssue, setCalcIssue] = useState<'ticks' | 'worms' | 'skin'>('ticks');

  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.products)) {
          const meds = d.products.filter(
            (p: Product) => p.category === 'veterinary_medicine' || p.veterinarySpecs
          );
          if (meds.length > 0) setAllProducts(meds);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Filtered medicines
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Group filter
      if (selectedGroup !== 'all') {
        const target = p.veterinarySpecs?.targetDisease;
        if (selectedGroup === 'antiparasitic' && target !== 'antiparasitic') return false;
        if (selectedGroup === 'dewormer' && target !== 'dewormer') return false;
        if (selectedGroup === 'skin_care' && target !== 'skin_care') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchActive = p.veterinarySpecs?.activeIngredient?.toLowerCase().includes(q);
        const matchInd = p.veterinarySpecs?.indication?.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchActive && !matchInd && !matchSku) return false;
      }

      return true;
    });
  }, [allProducts, selectedGroup, searchQuery]);

  // Recommended medicine based on Calculator
  const recommendedMedicine = useMemo(() => {
    if (calcIssue === 'ticks') {
      if (calcPet === 'dog') {
        if (calcWeight >= 10) {
          return allProducts.find((p) => p.id === 'prod-477745') || allProducts[0];
        } else if (calcWeight >= 4) {
          return allProducts.find((p) => p.id === 'prod-477744') || allProducts[0];
        } else {
          return allProducts.find((p) => p.id === 'prod-477743') || allProducts[0];
        }
      } else {
        return allProducts.find((p) => p.id === 'prod-519397') || allProducts[0];
      }
    } else if (calcIssue === 'worms') {
      return allProducts.find((p) => p.id === 'prod-395928') || allProducts[0];
    } else {
      return allProducts.find((p) => p.id === 'prod-519397') || allProducts[0];
    }
  }, [allProducts, calcIssue, calcPet, calcWeight]);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      {/* 1. Hero Section & Trust Badges */}
      <section className="bg-gradient-to-b from-rose-900 via-rose-850 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-rose-800/40">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Kho Dược Thú Y & Điều Trị Chuẩn Y Khoa
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Thuốc Thú Y & Dược Phẩm Trị Liệu Chính Hãng{' '}
                <span className="text-rose-400">FIVEVET</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Hệ thống phân phối dược phẩm thú y chính hãng tiêu chuẩn GMP-WHO. Đặc trị ve rận, bọ chét, ghẻ Demodex, tẩy giun sán và bệnh ngoài da cho chó mèo với bảng liều dùng y khoa chuẩn xác.
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 space-y-3 shrink-0 lg:w-80 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-rose-200">Hotline Bác Sĩ Thú Y</p>
                  <p className="text-lg font-black text-white">0819.210.319</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Tư vấn miễn phí phác đồ điều trị, cách phối hợp thuốc và liều lượng theo từng độ tuổi thú cưng.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Thuốc có sẵn giao ngay
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-white hover:text-rose-300 font-bold flex items-center gap-1 underline cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> In Catalog
                </button>
              </div>
            </div>
          </div>

          {/* 4 Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-rose-800/40">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">100% Chính Hãng</p>
                <p className="text-[10px] text-slate-300">Đầy đủ số đăng ký lưu hành</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Chuẩn GMP-WHO</p>
                <p className="text-[10px] text-slate-300">Sản xuất tại nhà máy 5 sao</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-6 h-6 text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Giao Hỏa Tốc 2H</p>
                <p className="text-[10px] text-slate-300">Đóng gói chuẩn bảo quản y tế</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Hạn Dùng Đến 2028</p>
                <p className="text-[10px] text-slate-300">Hàng mới xuất xưởng nguyên seal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Dosage Calculator */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Công Cụ Tra Cứu Liều Dùng Thuốc Theo Thể Trọng (Kg)
                </h3>
                <p className="text-xs text-slate-500">
                  Chọn triệu chứng và cân nặng của bé để hệ thống tính toán chính xác dòng thuốc Fivevet phù hợp.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Pet Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Loài vật nuôi:</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCalcPet('dog')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        calcPet === 'dog' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      🐶 Chó
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcPet('cat')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        calcPet === 'cat' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      🐱 Mèo
                    </button>
                  </div>
                </div>

                {/* Problem Type */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vấn đề cần điều trị:</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-center">
                    <button
                      type="button"
                      onClick={() => setCalcIssue('ticks')}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        calcIssue === 'ticks' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Ve rận & Bọ chét
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcIssue('worms')}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        calcIssue === 'worms' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Tẩy giun sán
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcIssue('skin')}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        calcIssue === 'skin' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Nấm ghẻ & Da lông
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Cân nặng hiện tại của bé:</span>
                  <span className="text-base font-black text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
                    {calcWeight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={0.5}
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1kg (Cún/Mèo nhỏ)</span>
                  <span>10kg (Chó trung bình)</span>
                  <span>25kg (Chó lớn)</span>
                  <span>40kg+</span>
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-rose-50 to-orange-50/60 p-5 rounded-3xl border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-200/60 px-2.5 py-0.5 rounded-full">
                  Phác Đồ Đề Xuất Phù Hợp
                </span>
                <span className="text-xs font-bold text-slate-500">Chuẩn Thú Y</span>
              </div>

              {recommendedMedicine && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-rose-200 shrink-0 relative">
                      <Image
                        src={recommendedMedicine.image}
                        alt={recommendedMedicine.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {recommendedMedicine.name}
                      </h4>
                      <p className="text-xs text-rose-600 font-bold mt-1">
                        {recommendedMedicine.price.toLocaleString('vi-VN')}₫
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          / {recommendedMedicine.weight}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                    <p className="font-semibold text-slate-700">
                      🎯 <strong>Liều dùng chuẩn:</strong>{' '}
                      <span className="text-rose-700 font-bold">
                        {recommendedMedicine.veterinarySpecs?.dosageByWeight || 'Theo hướng dẫn thú y'}
                      </span>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      💊 <strong>Hoạt chất:</strong>{' '}
                      {recommendedMedicine.veterinarySpecs?.activeIngredient || 'Dược chất chính hãng'} (
                      {recommendedMedicine.veterinarySpecs?.concentration || ''})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(recommendedMedicine)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {addedId === recommendedMedicine.id ? 'Đã thêm giỏ hàng!' : 'Đặt Thuốc Này Ngay'}
                    </button>
                    <Link
                      href={`/products/${recommendedMedicine.slug}`}
                      className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600 text-xs font-bold"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catalog & Product Filter Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📋</span> Danh Mục Thuốc & Bảng Báo Giá Chi Tiết
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cung cấp đầy đủ thông số dược lý, hoạt chất, quy cách và giá bán lẻ / bán sỉ đại lý.
            </p>
          </div>

          {/* View Mode Toggle & Print Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                }`}
                title="Xem dạng thẻ"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Dạng Thẻ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'catalog' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600'
                }`}
                title="Xem bảng báo giá catalog"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Bảng Catalog</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo Giá</span>
            </button>
          </div>
        </div>

        {/* Search & Pathology Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          {/* Group pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroup === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả thuốc ({allProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('antiparasitic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroup === 'antiparasitic'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🪱 Diệt Ve Rận & Bọ Chét
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('dewormer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroup === 'dewormer'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💊 Tẩy Giun Sán
            </button>
            <button
              type="button"
              onClick={() => setSelectedGroup('skin_care')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGroup === 'skin_care'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🧴 Nấm Ghẻ & Vệ Sinh Da Lông
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm thuốc, hoạt chất (Afoxolaner...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 4A. GRID VIEW MODE */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Top Image & Badge */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={med.image}
                    alt={med.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-rose-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md">
                      {med.veterinarySpecs?.activeIngredient || 'Dược Thú Y'}
                    </span>
                    {med.veterinarySpecs?.concentration && (
                      <span className="bg-slate-900/80 text-white font-semibold text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {med.veterinarySpecs.concentration}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm">
                    {med.weight}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      {med.veterinarySpecs?.manufacturer || 'FIVEVET CHÍNH HÃNG'}
                    </p>
                    <Link
                      href={`/products/${med.slug}`}
                      className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug"
                    >
                      {med.name}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {med.shortDesc}
                    </p>

                    {/* Veterinary Specs Mini Box */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Liều lượng:</span>
                        <span className="font-semibold text-slate-800 text-right">
                          {med.veterinarySpecs?.dosageByWeight || 'Theo chỉ định'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Đường dùng:</span>
                        <span className="font-semibold text-slate-800">
                          {med.veterinarySpecs?.routeOfAdministration || 'Uống trực tiếp'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Buy Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Giá bán lẻ niêm yết</p>
                      <p className="text-lg font-black text-rose-600">
                        {med.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(med)}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-rose-200 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {addedId === med.id ? 'Đã thêm!' : 'Mua ngay'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4B. CATALOG TABLE VIEW MODE (PRINTABLE) */}
        {viewMode === 'catalog' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header for Print only */}
            <div className="hidden print:block p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">DVDmultilPET</h2>
                  <p className="text-xs text-slate-600 font-semibold">BẢNG BÁO GIÁ & CATALOG DƯỢC THÚ Y CHÍNH HÃNG FIVEVET</p>
                  <p className="text-[10px] text-slate-500">Hotline: 0819.210.319 • Website: thucungtot.net • Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <p>Cam kết 100% hàng chính hãng</p>
                  <p>Hạn sử dụng: 2028</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Mã SKU</th>
                    <th className="py-3.5 px-4">Tên Thuốc & Quy Cách</th>
                    <th className="py-3.5 px-4">Hoạt Chất / Hàm Lượng</th>
                    <th className="py-3.5 px-4">Liều Dùng Khuyến Nghị</th>
                    <th className="py-3.5 px-4">Chỉ Định Điều Trị</th>
                    <th className="py-3.5 px-4 text-right">Giá Bán Lẻ</th>
                    <th className="py-3.5 px-4 text-right">Giá Đại Lý (Sỉ)</th>
                    <th className="py-3.5 px-4 text-center print:hidden">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{med.sku}</td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/products/${med.slug}`}
                          className="font-bold text-slate-900 hover:text-rose-600 transition-colors block"
                        >
                          {med.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Đóng gói: {med.weight} • Lô: {med.batchNumber || '2026'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          {med.veterinarySpecs?.activeIngredient || 'Dược chất'}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {med.veterinarySpecs?.concentration || ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium max-w-[200px]">
                        {med.veterinarySpecs?.dosageByWeight || med.usageGuide || 'Theo hướng dẫn'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[220px] text-[11px]">
                        {med.veterinarySpecs?.indication || med.shortDesc}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                        {med.price.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {med.wholesalePricing?.wholesalePrice
                          ? `${med.wholesalePricing.wholesalePrice.toLocaleString('vi-VN')}₫`
                          : 'Liên hệ sỉ'}
                        <span className="block text-[9px] text-slate-400 font-normal">
                          (Từ {med.wholesalePricing?.minWholesaleQty || 10} hộp)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center print:hidden">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(med)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-[11px] transition-all cursor-pointer"
                        >
                          {addedId === med.id ? '✓ Đã thêm' : '+ Đặt hàng'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Catalog Footer note */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                ⚠️ <em>Lưu ý: Đọc kỹ hướng dẫn sử dụng trước khi dùng. Để xa tầm tay trẻ em.</em>
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Phòng khám thú y / Đại lý liên hệ:</span>
                <span className="font-bold text-rose-600">0819.210.319 (Zalo)</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
