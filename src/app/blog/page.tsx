'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockArticles } from '@/lib/data/articles';
import { Clock, BookOpen, Sparkles, ArrowRight, Search, RefreshCw, CheckCircle } from 'lucide-react';

export default function BlogListPage() {
  const [articles, setArticles] = useState(mockArticles);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [publishing, setPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const triggerAutoPublish = async () => {
    setPublishing(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/cron/auto-publish');
      const data = await res.json();
      if (data.success) {
        setStatusMsg(data.message);
        setArticles([...mockArticles]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    if (selectedTag !== 'all' && !art.tags.includes(selectedTag)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  const allTags = ['all', 'Mèo con', 'Sỏi thận', 'Chó Poodle', 'Dị ứng da', 'Ăn dặm'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <BookOpen className="w-3.5 h-3.5" /> Thư Viện Kiến Thức & Y Khoa Thú Cưng
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Cẩm Nang Dinh Dưỡng & Phòng Bệnh Cho Thú Cưng
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Các bài viết được biên soạn bởi Bác sĩ Thú y và Trợ lý AI y khoa. Mọi bài viết đều gắn liền với giải pháp sản phẩm dinh dưỡng tương thích để bạn dễ dàng áp dụng.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={triggerAutoPublish}
              disabled={publishing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${publishing ? 'animate-spin' : ''}`} />
              {publishing ? 'Đang viết và xuất bản bài mới...' : '⚡ Bấm Thử Nghiệm Tự Động Đăng Bài Mới (Cron API)'}
            </button>
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tag pills */}
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag === 'all' ? 'Tất cả bài viết' : tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm cẩm nang, bệnh lý..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all overflow-hidden flex flex-col"
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
                    <Sparkles className="w-3 h-3" /> AI Generated
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

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Gắn kèm <strong className="text-orange-600">{article.relatedProductIds.length} sản phẩm</strong>
                </span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
