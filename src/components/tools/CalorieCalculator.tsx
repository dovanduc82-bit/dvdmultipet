'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Sparkles, Droplets, Utensils, Calendar, ArrowRight } from 'lucide-react';
import { mockProducts } from '../../lib/data/products';

export default function CalorieCalculator() {
  const [species, setSpecies] = useState<'dog' | 'cat'>('cat');
  const [weight, setWeight] = useState<number>(4);
  const [lifeStage, setLifeStage] = useState<'puppy_kitten' | 'adult' | 'senior'>('adult');
  const [activity, setActivity] = useState<'low' | 'normal' | 'high'>('normal');
  const [isNeutered, setIsNeutered] = useState<boolean>(true);

  // Calculate veterinary standard RER = 70 * (weight ^ 0.75)
  const rer = Math.round(70 * Math.pow(Math.max(0.5, weight), 0.75));

  // Determine multiplier for MER
  let multiplier = 1.2;
  if (species === 'cat') {
    if (lifeStage === 'puppy_kitten') multiplier = 2.5;
    else if (isNeutered) multiplier = activity === 'high' ? 1.4 : activity === 'low' ? 1.0 : 1.2;
    else multiplier = activity === 'high' ? 1.6 : 1.4;
  } else {
    // Dog
    if (lifeStage === 'puppy_kitten') multiplier = 3.0;
    else if (isNeutered) multiplier = activity === 'high' ? 1.6 : activity === 'low' ? 1.2 : 1.4;
    else multiplier = activity === 'high' ? 2.0 : 1.6;
  }

  const mer = Math.round(rer * multiplier);
  // Average calorie density of dry kibble ~ 3.8 kcal/gram
  const dailyFoodGrams = Math.round(mer / 3.8);
  // Daily water requirement ~ 50-60ml per kg of body weight
  const dailyWaterMl = Math.round(weight * 55);
  // 1.5kg bag (1500g) lasts how many days
  const bagDays = Math.max(1, Math.round(1500 / dailyFoodGrams));

  // Recommend best product based on pet & lifeStage
  const recommendedProduct = mockProducts.find(
    (p) => p.petType === species && (p.lifeStage === lifeStage || p.lifeStage === 'all')
  ) || mockProducts[0];

  return (
    <section id="calorie-calculator" className="my-12 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-teal-800/40">
      {/* Glow background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
            <Calculator className="w-3.5 h-3.5" /> Công Cụ Thú Y Tương Tác
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tính Khẩu Phần Ăn & Nước Uống Hàng Ngày Cho Thú Cưng
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Áp dụng công thức chuẩn Hiệp hội Bác sĩ Thú y Hoa Kỳ (AAFCO) giúp thú cưng phát triển cân đối, không lo béo phì hay sỏi thận.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls form */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-5">
            {/* Species Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
                1. Loại Thú Cưng
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSpecies('cat')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    species === 'cat'
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-300'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg">🐱</span> Mèo Cưng
                </button>
                <button
                  type="button"
                  onClick={() => setSpecies('dog')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    species === 'dog'
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-300'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg">🐶</span> Chó Cưng
                </button>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  2. Cân Nặng Hiện Tại
                </label>
                <span className="text-lg font-black text-amber-400">{weight} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max={species === 'cat' ? 12 : 50}
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5 kg</span>
                <span>{species === 'cat' ? '6 kg (trung bình)' : '15 kg'}</span>
                <span>{species === 'cat' ? '12 kg' : '50 kg'}</span>
              </div>
            </div>

            {/* Life stage & Neutered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
                  3. Độ Tuổi
                </label>
                <select
                  value={lifeStage}
                  onChange={(e) => setLifeStage(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="puppy_kitten">Còn nhỏ (&lt; 12 tháng)</option>
                  <option value="adult">Trưởng thành (1 - 7 tuổi)</option>
                  <option value="senior">Lớn tuổi (&gt; 7 tuổi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2">
                  4. Tình Trạng Triệt Sản
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNeutered(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                      isNeutered ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Đã Triệt Sản
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNeutered(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                      !isNeutered ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Chưa
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-teal-500/20 via-slate-800 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Kết quả phân tích cho</span>
              <span className="text-sm font-bold text-teal-300">
                {species === 'cat' ? 'Mèo' : 'Chó'} • {weight}kg
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold mb-1">
                  <Utensils className="w-3.5 h-3.5" /> Khẩu Phần Hạt
                </div>
                <div className="text-2xl font-black text-white">{dailyFoodGrams} <span className="text-xs font-normal text-slate-400">g/ngày</span></div>
                <p className="text-[10px] text-slate-400 mt-1">Chia làm 2 - 3 bữa nhỏ</p>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
                  <Droplets className="w-3.5 h-3.5" /> Lượng Nước Uống
                </div>
                <div className="text-2xl font-black text-white">{dailyWaterMl} <span className="text-xs font-normal text-slate-400">ml/ngày</span></div>
                <p className="text-[10px] text-slate-400 mt-1">Phòng chống sỏi thận</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Một bao hạt 1.5kg sẽ ăn trong khoảng:</span>
              </div>
              <span className="text-base font-black text-amber-300">~{bagDays} ngày</span>
            </div>

            {/* Recommended Product Box */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Thức Ăn Phù Hợp Nhất Trong Shop:
              </span>
              <Link
                href={`/products/${recommendedProduct.slug}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-teal-600 transition-all text-xs font-semibold text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">⭐</span>
                  <span className="line-clamp-1">{recommendedProduct.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-300 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
