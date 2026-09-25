'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Truck,
  Phone,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ConfirmedOrder {
  id: string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    weight?: string;
  }[];
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod'>('vietqr');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const shippingFee = totalPrice >= 499000 || totalPrice === 0 ? 0 : 30000;
  const grandTotal = totalPrice + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    if (items.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    const calculatedShipping = totalPrice >= 499000 ? 0 : 30000;
    const finalAmount = totalPrice + calculatedShipping;
    const generatedId = `PN-${Date.now().toString().slice(-6)}`;

    // Lưu lại thông tin đơn hàng trước khi reset giỏ hàng
    const orderData = {
      id: generatedId,
      totalAmount: finalAmount,
      subtotal: totalPrice,
      shippingFee: calculatedShipping,
      customerName,
      phone,
      address,
      note,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        weight: i.product.weight,
        image: i.product.image,
      })),
    };

    setConfirmedOrder(orderData);

    // Đồng bộ đơn hàng lên hệ thống lưu trữ Admin
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        paymentMethod,
      }),
    }).catch((err) => console.warn('Error saving order to store:', err));

    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced && confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Đặt hàng thành công!
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Cảm Ơn Bạn Đã Mua Sắm Tại DVDmultilPET
          </h1>
          <p className="text-sm text-slate-600">
            Mã đơn hàng của bạn là: <strong className="text-orange-600 font-mono text-base">{confirmedOrder.id}</strong>
          </p>
        </div>

        {/* Chi tiết đơn hàng tóm tắt */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs text-slate-700 space-y-3 max-w-md mx-auto shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center justify-between">
            <span>📦 Chi Tiết Đơn Hàng</span>
            <span className="text-orange-600 font-mono">{confirmedOrder.items.length} món</span>
          </h3>

          <div className="space-y-2 divide-y divide-slate-100">
            {confirmedOrder.items.map((it) => (
              <div key={it.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                <div className="pr-2">
                  <p className="font-semibold text-slate-900">{it.name}</p>
                  <p className="text-slate-500">Số lượng: {it.quantity} {it.weight ? `• ${it.weight}` : ''}</p>
                </div>
                <span className="font-bold text-slate-800 shrink-0">
                  {(it.price * it.quantity).toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Tạm tính:</span>
              <span>{confirmedOrder.subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Phí vận chuyển:</span>
              <span>{confirmedOrder.shippingFee === 0 ? 'MIỄN PHÍ' : `${confirmedOrder.shippingFee.toLocaleString('vi-VN')}₫`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
              <span>Tổng thanh toán:</span>
              <span className="text-orange-600 text-base">{confirmedOrder.totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500">
            <p><strong>Người nhận:</strong> {confirmedOrder.customerName} ({confirmedOrder.phone})</p>
            <p><strong>Giao đến:</strong> {confirmedOrder.address}</p>
          </div>
        </div>

        {paymentMethod === 'vietqr' ? (
          <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-3xl p-6 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
              <QrCode className="w-3.5 h-3.5" /> Quét Mã VietQR Chuyển Khoản Nhanh
            </div>
            <p className="text-xs text-slate-600">
              Mở App ngân hàng bất kỳ (VietinBank, VCB, MB, Techcombank, MoMo...) quét mã bên dưới để thanh toán đúng số tiền:
            </p>

            {/* Generated QR Code with exact order amount */}
            <div className="bg-white p-4 rounded-2xl shadow-inner inline-block border border-orange-200">
              <img
                src={`https://img.vietqr.io/image/vietinbank-108006693663-compact2.png?amount=${confirmedOrder.totalAmount}&addInfo=DVDmultilPET%20${confirmedOrder.id}&accountName=DO%20VAN%20DUC`}
                alt="VietQR Payment Code - Đỗ Văn Đức"
                className="w-60 h-auto mx-auto rounded-lg shadow-sm"
              />
            </div>

            <div className="text-xs text-slate-700 space-y-2 text-left bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
              <p>• Ngân hàng: <strong className="text-slate-900">VietinBank (Ngân hàng TMCP Công Thương VN)</strong></p>
              <p>• Số tài khoản: <strong className="text-orange-600 font-mono text-sm tracking-wider">108006693663</strong></p>
              <p>• Tên thụ hưởng: <strong className="text-slate-900 uppercase">ĐỖ VĂN ĐỨC</strong></p>
              <p>• Số tiền thanh toán: <strong className="text-orange-600 font-black text-base">{confirmedOrder.totalAmount.toLocaleString('vi-VN')}₫</strong></p>
              <p>• Nội dung chuyển khoản: <strong className="text-blue-700 font-mono bg-blue-50 px-2 py-0.5 rounded">DVDmultilPET {confirmedOrder.id}</strong></p>
            </div>
          </div>
        ) : (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 max-w-md mx-auto text-center space-y-2">
            <Truck className="w-8 h-8 text-teal-600 mx-auto" />
            <h3 className="font-bold text-teal-900 text-base">Thanh Toán Khi Nhận Hàng (COD)</h3>
            <p className="text-xs text-teal-700">
              Đơn hàng sẽ được nhân viên đóng gói và giao đến bạn trong vòng 2 - 24 giờ. Vui lòng chuẩn bị sẵn số tiền{' '}
              <strong className="text-base text-slate-900">{confirmedOrder.totalAmount.toLocaleString('vi-VN')}₫</strong> khi nhận hàng.
            </p>
          </div>
        )}

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md hover:bg-orange-600 transition-colors"
          >
            Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Giỏ Hàng Của Bạn ({totalItems} món)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kiểm tra các sản phẩm thức ăn và điền thông tin để chúng tôi giao tận nơi cho boss.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
            🛒
          </div>
          <h2 className="text-lg font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-slate-500">Hãy dạo qua cửa hàng để chọn loại hạt hoặc pate thơm ngon nhất cho thú cưng nhé!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs"
          >
            Xem danh mục sản phẩm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Table / Items List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-bold text-slate-900 text-base">Danh Sách Món Đã Chọn</h2>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa toàn bộ
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-slate-900 hover:text-orange-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-slate-400">Quy cách: {product.weight}</p>
                    <p className="text-sm font-black text-orange-600">
                      {product.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                    title="Xóa món"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Free shipping banner */}
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                {totalPrice >= 499000
                  ? '🎉 Bạn đã được MIỄN PHÍ VẬN CHUYỂN cho đơn hàng này!'
                  : `Mua thêm ${(499000 - totalPrice).toLocaleString('vi-VN')}₫ để được Miễn phí vận chuyển toàn quốc!`}
              </span>
            </div>
          </div>

          {/* Checkout & Customer Info Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 text-base">Thông Tin Giao Hàng & Thanh Toán</h2>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại nhận hàng *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0987 654 321"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Hình thức thanh toán
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-2 ring-orange-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-orange-600" />
                    <span>Quét Mã VietQR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-2 ring-orange-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-teal-600" />
                    <span>Tiền mặt (COD)</span>
                  </button>
                </div>
              </div>

              {/* Order calculation summary */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tiền hàng:</span>
                  <span className="font-bold text-slate-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Tổng thanh toán:</span>
                  <span className="text-xl text-orange-600">{grandTotal.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base shadow-xl shadow-orange-300 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Xác Nhận Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
