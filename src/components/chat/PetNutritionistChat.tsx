'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, User, ShoppingBag } from 'lucide-react';
import { Product } from '../../lib/types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

const QUICK_PROMPTS = [
  '🐶 Chó Becgie 2 tuổi, 12kg, không bệnh gì',
  '🐱 Mèo bị đi tiểu rặn, nghi sỏi bàng quang?',
  '🐶 Cún Poodle hay chảy nước mắt & gãi da?',
  '🍼 Mèo con 1-2 tháng tuổi tập ăn dặm loại hạt nào?',
  '⚖️ Cách tính gram hạt ăn hàng ngày?'
];

export default function PetNutritionistChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Tôi là Bác sĩ Thú y AI tại DVDmultilPET 🐾. Bạn đang nuôi cún hay miu? Hãy chia sẻ về độ tuổi hoặc tình trạng sức khỏe của bé để tôi tư vấn thực đơn và đồ dùng chuẩn nhất nhé!',
      timestamp: 'Vừa xong'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: m.text
          }))
        })
      });

      const data = await res.json();
      const botReply = data.reply || 'Xin lỗi, hệ thống đang bận một chút. Bạn có thể gọi hotline 0819.210.319 để được hỗ trợ ngay!';
      const suggestedProducts = data.suggestedProducts || [];

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng hoặc liên hệ qua Zalo!',
          timestamp: 'Vừa xong'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-chat" className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-orange-300 transition-all hover:scale-105 active:scale-95"
          aria-label="Mở khung chat Bác sĩ AI"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-orange-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-orange-500 rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-orange-100 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" /> Trợ Lý Thú Y AI
            </p>
            <p className="text-sm font-black">Hỏi Bác Sĩ Dinh Dưỡng</p>
          </div>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[440px] h-[600px] bg-white rounded-3xl shadow-2xl border border-orange-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm flex items-center gap-1.5">
                  Bác Sĩ Dinh Dưỡng DVDmultilPET AI
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    Online 24/7
                  </span>
                </h3>
                <p className="text-[11px] text-orange-100">
                  Phân tích thể trạng, tính khẩu phần & gợi ý sản phẩm
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-2 bg-orange-50 border-b border-orange-100 flex gap-2 overflow-x-auto text-[11px] font-semibold text-slate-700 whitespace-nowrap scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-100 border border-orange-200 text-orange-800 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                    🐾
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}

                  {/* SUGGESTED PRODUCTS INTERACTIVE CARDS */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Sản phẩm bác sĩ gợi ý cho bé:
                      </p>
                      <div className="space-y-1.5">
                        {msg.suggestedProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl bg-orange-50/80 hover:bg-orange-100 border border-orange-200/60 text-slate-800 text-[11px] font-semibold group transition-all"
                          >
                            <span className="line-clamp-1 group-hover:text-orange-600">{p.name}</span>
                            <span className="text-orange-600 font-bold shrink-0 ml-2">
                              {p.price.toLocaleString('vi-VN')}₫ →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-2 ${
                      msg.sender === 'user' ? 'text-orange-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 bg-white p-3 rounded-2xl w-fit border border-slate-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>Bác sĩ AI đang phân tích dữ liệu lâm sàng và tính toán khẩu phần...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi về cân nặng, bệnh lý bé..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-all shadow-md shadow-orange-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
