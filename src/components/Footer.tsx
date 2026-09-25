import React from 'react';
import Link from 'next/link';
import { PawPrint, ShieldCheck, Truck, Clock, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">100% Chính Hãng</h4>
              <p className="text-xs text-slate-400 mt-1">Đầy đủ tem kiểm dịch, date mới nhất, nhập khẩu chính ngạch từ Pháp, Ý, Thổ Nhĩ Kỳ.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Bác Sĩ AI Tư Vấn</h4>
              <p className="text-xs text-slate-400 mt-1">Trợ lý dinh dưỡng thông minh 24/7 giúp bạn chọn đúng loại hạt cho từng thể trạng.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Giao Nhanh 2 Giờ</h4>
              <p className="text-xs text-slate-400 mt-1">Hỗ trợ giao hỏa tốc nội thành cho các "boss" đang cần thức ăn hoặc pate gấp.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Cẩm Nang Chuẩn Y Khoa</h4>
              <p className="text-xs text-slate-400 mt-1">Cập nhật tự động các bài viết hướng dẫn phòng bệnh và khẩu phần ăn mỗi ngày.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                DVD<span className="text-orange-500">multilPET</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống bán lẻ thức ăn & phụ kiện thú cưng chuyên sâu kết hợp cẩm nang dinh dưỡng và tư vấn tự động chuẩn thú y.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 Trụ sở: Hệ sinh thái DVDmultilPET Việt Nam</p>
              <p>📞 Hotline: <strong className="text-slate-200">0819.210.319</strong> (08:00 - 22:00 hàng ngày)</p>
              <p>✉️ Email: <strong className="text-slate-200">Dovanduc82@gmail.com</strong></p>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">Danh Mục Sản Phẩm</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/products?pet=cat&category=dry_kibble" className="hover:text-orange-400 transition-colors">Hạt khô cho mèo mẹ & mèo con</Link></li>
              <li><Link href="/products?pet=cat&category=dietary" className="hover:text-orange-400 transition-colors">Hạt trị liệu sỏi bàng quang, tiết niệu</Link></li>
              <li><Link href="/products?pet=dog&category=dry_kibble" className="hover:text-orange-400 transition-colors">Hạt Grain-Free cá hồi cho chó Poodle</Link></li>
              <li><Link href="/products?pet=dog&category=wet_pate" className="hover:text-orange-400 transition-colors">Pate Ý Monge Fresh thịt tươi</Link></li>
              <li><Link href="/products?category=treats" className="hover:text-orange-400 transition-colors">Súp thưởng Ciao Churu bổ sung nước</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">Cẩm Nang & Tiện Ích</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Cẩm nang chăm sóc thú cưng</Link></li>
              <li><Link href="/#calorie-calculator" className="hover:text-orange-400 transition-colors">Công cụ tính calo khẩu phần ăn</Link></li>
              <li><Link href="/#ai-chat" className="hover:text-orange-400 transition-colors">Trò chuyện với Bác sĩ Thú y AI</Link></li>
              <li><Link href="/blog/dau-hieu-soi-tiet-nieu-o-meo-va-che-do-an-tri-lieu" className="hover:text-orange-400 transition-colors">Dấu hiệu nhận biết mèo bị sỏi thận</Link></li>
              <li><Link href="/blog/che-do-an-chuan-cho-meo-con-cai-sua-tu-1-den-4-thang" className="hover:text-orange-400 transition-colors">Thực đơn ăn dặm cho mèo con 1-4 tháng</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm mb-4">Phương Thức Thanh Toán</h5>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">VietQR</div>
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">MoMo</div>
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">VNPAY</div>
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">Visa/Master</div>
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">COD</div>
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">Auto-Ship</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Next.js & Gemini AI</span>
              <Link href="/admin" className="text-slate-400 hover:text-orange-400 flex items-center gap-1 font-semibold transition-colors">
                <span>🔑 Quản Trị Shop</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DVDmultilPET Inc. Bản quyền thuộc về thương hiệu DVDmultilPET.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Thiết kế vì sức khỏe của các bạn bốn chân</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
