'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mockArticles } from '@/lib/data/articles';
import { mockProducts } from '@/lib/data/products';
import ContextualProductCard from '@/components/blog/ContextualProductCard';
import { Article, Product } from '@/lib/types';
import { Clock, ArrowLeft, Sparkles, Share2, Tag, BookOpen, Check, AlertCircle, Calendar } from 'lucide-react';

function findArticleInList(list: Article[], query: string): Article | undefined {
  if (!query) return undefined;
  const decoded = decodeURIComponent(query).toLowerCase().trim();
  return (
    list.find((a) => a.slug === query || a.slug.toLowerCase() === decoded) ||
    list.find((a) => a.id === query || a.id.toLowerCase() === decoded) ||
    list.find((a) => a.slug && a.slug.toLowerCase().includes(decoded)) ||
    list.find((a) => decoded.includes(a.slug.toLowerCase()))
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || '';

  const [article, setArticle] = useState<Article | null>(() => {
    return findArticleInList(mockArticles, rawSlug) || null;
  });
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(!article);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.articles)) {
          const found = findArticleInList(data.articles, rawSlug);
          if (found) {
            setArticle(found);
          }
        }
      })
      .catch((err) => console.error('Error fetching dynamic article:', err))
      .finally(() => setLoading(false));

    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setAllProducts(data.products);
        }
      })
      .catch(() => {});
  }, [rawSlug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-slate-600">Đang tải nội dung bài viết cẩm nang...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy bài viết</h1>
        <p className="text-sm text-slate-500">Bài viết có thể chưa được xuất bản hoặc đã đổi đường dẫn.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện bài viết
        </Link>
      </div>
    );
  }

  // Retrieve products attached to this article
  const relatedIds = article.relatedProductIds || [];
  let attachedProducts = allProducts.filter((p) => relatedIds.includes(p.id));

  if (attachedProducts.length === 0) {
    const textToMatch = `${article.title} ${article.summary} ${article.content}`.toLowerCase();
    attachedProducts = allProducts.filter((p) => {
      const pName = p.name.toLowerCase();
      if (textToMatch.includes('canxi') && (pName.includes('canxi') || pName.includes('calcium') || pName.includes('five'))) return true;
      if (textToMatch.includes('ve rận') && (pName.includes('axolaner') || pName.includes('butomec'))) return true;
      if (textToMatch.includes('giun sán') && pName.includes('alben')) return true;
      return false;
    }).slice(0, 3);
  }

  // Format content paragraphs & section headings
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    return (
      <div className="space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
        {paragraphs.map((para, index) => {
          const trimmed = para.trim();

          if (trimmed.startsWith('###')) {
            const headingText = trimmed.replace(/^###\s*/, '');
            return (
              <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-900 pt-4 pb-1 border-b border-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
                {headingText}
              </h3>
            );
          }

          if (trimmed.startsWith('##')) {
            const headingText = trimmed.replace(/^##\s*/, '');
            return (
              <h2 key={index} className="text-2xl sm:text-3xl font-black text-teal-900 pt-6 pb-2 border-b-2 border-teal-200">
                {headingText}
              </h2>
            );
          }

          const isSectionTitle = /^(NGUYÊN NHÂN|CƠ CHẾ SINH BỆNH|TRIỆU CHỨNG|PHÒNG BỆNH|ĐIỀU TRỊ|CHẨN ĐOÁN|LỜI KHUYÊN BÁC SĨ|KẾT LUẬN)/i.test(trimmed) && trimmed.length < 50;
          if (isSectionTitle) {
            return (
              <div key={index} className="pt-6 pb-1">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-teal-100 text-teal-900 font-black text-sm tracking-wide uppercase border border-teal-200 shadow-xs">
                  📌 {trimmed}
                </span>
              </div>
            );
          }

          const lines = trimmed.split('\n');
          const isBulletList = lines.every((line) => line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim()));

          if (isBulletList) {
            return (
              <ul key={index} className="space-y-2.5 my-3 pl-2">
                {lines.map((line, lIdx) => {
                  const cleaned = line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
                  return (
                    <li key={lIdx} className="flex items-start gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                      <span className="flex-1">{cleaned}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }

          return (
            <p key={index} className="whitespace-pre-line leading-relaxed text-slate-700">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              {article.category || 'Cẩm Nang Y Khoa'}
            </span>
            {article.isAiGenerated ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 flex items-center gap-1 border border-orange-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Hệ thống AI tự động đăng
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1 border border-blue-200">
                👨‍⚕️ Bác Sĩ & Chuyên Gia Biên Soạn
              </span>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-teal-600 hover:border-teal-300 bg-white transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Đã sao chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ bài viết</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {article.title}
        </h1>

        {/* Author info & Read time */}
        <div className="flex flex-wrap items-center justify-between border-y border-slate-200 py-3 text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <Image
                src={article.author?.avatar || 'https://images.unsplash.com/photo-1594824813591-6893ddf4f2c0?w=150&auto=format&fit=crop&q=80'}
                alt={article.author?.name || 'Tác giả'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900">{article.author?.name || 'Đỗ Văn Đức - DVDmultilPET'}</p>
              <p className="text-[11px] text-slate-400">{article.author?.title || 'Chuyên gia Chăm sóc Thú cưng'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {article.readTime || '5 phút đọc'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
            </span>
          </div>
        </div>
      </header>

      {/* Summary Box */}
      {article.summary && (
        <div className="p-5 rounded-2xl bg-teal-50/80 border-l-4 border-teal-600 text-sm sm:text-base text-teal-950 font-medium leading-relaxed italic shadow-xs">
          "{article.summary}"
        </div>
      )}

      {/* Hero Image */}
      {article.featuredImage && (
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-slate max-w-none pt-2">
        {renderFormattedContent(article.content)}
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
                Sản Phẩm & Dược Liệu Bác Sĩ Khuyên Dùng Cho Bài Viết Này
              </h3>
              <p className="text-xs text-slate-500">
                Bạn có thể đặt mua trực tiếp các dòng dinh dưỡng và dược phẩm được bác sĩ thú y chỉ định:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {attachedProducts.map((prod) => (
              <ContextualProductCard
                key={prod.id}
                product={prod}
                calloutTitle={`Chỉ định cho bài viết: "${article.title.slice(0, 36)}..."`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            <Tag className="w-3.5 h-3.5" /> Từ khóa:
          </span>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Back button */}
      <div className="pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện cẩm nang dinh dưỡng & thú y
        </Link>
      </div>
    </div>
  );
}
