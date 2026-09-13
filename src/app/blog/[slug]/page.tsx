'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockArticles } from '@/lib/data/articles';
import { mockProducts } from '@/lib/data/products';
import ContextualProductCard from '@/components/blog/ContextualProductCard';
import { Clock, ArrowLeft, Sparkles, Share2, Tag, BookOpen } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const article = mockArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy bài viết</h1>
        <p className="text-sm text-slate-500">Bài viết có thể chưa được xuất bản hoặc đã đổi đường dẫn.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện bài viết
        </Link>
      </div>
    );
  }

  // Retrieve products attached to this article
  const attachedProducts = mockProducts.filter((p) =>
    article.relatedProductIds.includes(p.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-teal-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-teal-600">Cẩm nang</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold line-clamp-1">{article.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
            {article.category}
          </span>
          {article.isAiGenerated && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Hệ thống AI tự động đăng
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {article.title}
        </h1>

        {/* Author info & Read time */}
        <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900">{article.author.name}</p>
              <p className="text-[11px] text-slate-400">{article.author.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            <span>•</span>
            <span className="text-slate-400">
              {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </header>

      {/* Summary Box */}
      <div className="p-5 rounded-2xl bg-teal-50/70 border-l-4 border-teal-600 text-sm text-teal-950 font-medium leading-relaxed italic">
        "{article.summary}"
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-slate max-w-none prose-headings:font-black prose-h3:text-xl prose-h3:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed text-sm sm:text-base space-y-4">
        <div className="whitespace-pre-line leading-relaxed text-slate-700">
          {article.content}
        </div>
      </article>

      {/* CORE FEATURE: CONTEXTUAL PRODUCT EMBEDDING */}
      {attachedProducts.length > 0 && (
        <section className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50/80 border-2 border-orange-300/80 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🐾
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Sản Phẩm Khuyên Dùng Cho Vấn Đề Dinh Dưỡng Trong Bài Viết
              </h3>
              <p className="text-xs text-slate-500">
                Bạn có thể đặt mua trực tiếp các dòng thức ăn được bác sĩ khuyến nghị ngay tại đây:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {attachedProducts.map((prod) => (
              <ContextualProductCard
                key={prod.id}
                product={prod}
                calloutTitle={`Khuyến nghị cho bài viết: "${article.title.slice(0, 40)}..."`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
          <Tag className="w-3.5 h-3.5" /> Từ khóa:
        </span>
        {article.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Back button */}
      <div className="pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện cẩm nang dinh dưỡng
        </Link>
      </div>
    </div>
  );
}
