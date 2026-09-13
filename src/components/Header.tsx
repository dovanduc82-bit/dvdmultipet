'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { PawPrint, ShoppingBag, Menu, X, PhoneCall, Sparkles, BookOpen, PackageOpen, ChevronDown } from 'lucide-react';

export default function Header() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessoriesDropdown, setAccessoriesDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Miễn phí vận chuyển cho đơn hàng từ 499.000đ • Thức ăn & Đồ dùng thú cưng chính hãng 100%</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
              <PawPrint className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
                DVD<span className="text-orange-600">multilPET</span>
              </span>
              <p className="text-[9.5px] text-slate-500 font-bold tracking-wider uppercase">
                Dinh Dưỡng & Đồ Dùng Thú Cưng
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links with Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              Trang Chủ
            </Link>

            <Link
              href="/products?pet=dog"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
            >
              <span>🐶</span> Thức Ăn Chó
            </Link>

            <Link
              href="/products?pet=cat"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
            >
              <span>🐱</span> Thức Ăn Mèo
            </Link>

            {/* NEW TAB: Phụ Kiện & Đồ Dùng Thiết Yếu */}
            <div
              className="relative"
              onMouseEnter={() => setAccessoriesDropdown(true)}
              onMouseLeave={() => setAccessoriesDropdown(false)}
            >
              <Link
                href="/products?section=accessories"
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
              >
                <PackageOpen className="w-4 h-4 text-orange-500" />
                <span>Phụ Kiện & Đồ Dùng</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {/* Dropdown Menu */}
              {accessoriesDropdown && (
                <div className="absolute left-0 mt-1 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    href="/products?category=feeding_tools"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-xs font-semibold text-slate-700 hover:text-orange-600"
                  >
                    <span className="text-base">🥣</span>
                    <div>
                      <p className="font-bold">Bát Ăn & Máy Lọc Nước</p>
                      <p className="text-[10px] text-slate-400 font-normal">Chống gù, chống nghẹn, lọc ion</p>
                    </div>
                  </Link>
                  <Link
                    href="/products?category=hygiene_litter"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-xs font-semibold text-slate-700 hover:text-orange-600"
                  >
                    <span className="text-base">🚽</span>
                    <div>
                      <p className="font-bold">Khay Cát & Vệ Sinh</p>
                      <p className="text-[10px] text-slate-400 font-normal">Cát đậu nành Tofu xả bồn cầu</p>
                    </div>
                  </Link>
                  <Link
                    href="/products?category=toys_scratchers"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-xs font-semibold text-slate-700 hover:text-orange-600"
                  >
                    <span className="text-base">🧶</span>
                    <div>
                      <p className="font-bold">Đồ Chơi & Cào Móng</p>
                      <p className="text-[10px] text-slate-400 font-normal">Nhà cây Cat Tree, bóng vờn</p>
                    </div>
                  </Link>
                  <Link
                    href="/products?category=grooming_health"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-xs font-semibold text-slate-700 hover:text-orange-600"
                  >
                    <span className="text-base">🧴</span>
                    <div>
                      <p className="font-bold">Sữa Tắm & Chăm Sóc Da</p>
                      <p className="text-[10px] text-slate-400 font-normal">Trị nấm ngứa, mượt lông</p>
                    </div>
                  </Link>
                  <Link
                    href="/products?category=accessories_collars"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-xs font-semibold text-slate-700 hover:text-orange-600"
                  >
                    <span className="text-base">🦮</span>
                    <div>
                      <p className="font-bold">Vòng Cổ & Dây Dắt Yếm</p>
                      <p className="text-[10px] text-slate-400 font-normal">Chống giật, phản quang ban đêm</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4 text-orange-500" />
              Cẩm Nang
            </Link>

            <Link
              href="/#calorie-calculator"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors flex items-center gap-1"
            >
              <span>⚖️</span> Tính Khẩu Phần
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0819210319"
              className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 px-3 py-2 rounded-xl transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-500" />
              <span>0819.210.319</span>
            </a>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm group"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
          >
            🏠 Trang Chủ
          </Link>
          <Link
            href="/products?pet=dog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
          >
            🐶 Thức Ăn Cho Chó
          </Link>
          <Link
            href="/products?pet=cat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
          >
            🐱 Thức Ăn Cho Mèo
          </Link>
          <Link
            href="/products?section=accessories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
          >
            🎾 Phụ Kiện & Đồ Dùng Thiết Yếu
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
          >
            📚 Cẩm Nang Nuôi Thú Cưng
          </Link>
          <Link
            href="/#calorie-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-teal-700 bg-teal-50"
          >
            ⚖️ Công Cụ Tính Khẩu Phần Ăn Thú Cưng
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-orange-600 bg-orange-50"
          >
            🛒 Giỏ Hàng ({totalItems} sản phẩm)
          </Link>
        </div>
      )}
    </header>
  );
}
