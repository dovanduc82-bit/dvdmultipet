import { NextRequest, NextResponse } from 'next/server';
import { getStoredArticles, saveStoredArticle, deleteStoredArticle } from '@/lib/data/store';
import { Article } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = getStoredArticles();
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 });
  }
}

function getRelevantArticleImage(title: string, category: string = '', targetPet: string = 'all'): string {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes('xương') || text.includes('còi xương') || text.includes('canxi') || text.includes('khớp') || text.includes('chân') || text.includes('vận động')) {
    return 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1000&auto=format&fit=crop&q=80';
  }
  if (text.includes('tiêu hóa') || text.includes('đường ruột') || text.includes('giun') || text.includes('sán') || text.includes('dạ dày') || text.includes('bụng') || text.includes('nôn')) {
    return 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1000&auto=format&fit=crop&q=80';
  }
  if (text.includes('ve') || text.includes('rận') || text.includes('bọ chét') || text.includes('da') || text.includes('lông') || text.includes('ngứa') || text.includes('nấm')) {
    return 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop&q=80';
  }
  if (text.includes('sỏi') || text.includes('tiết niệu') || text.includes('thận') || text.includes('bàng quang') || text.includes('tiểu')) {
    return 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1000&auto=format&fit=crop&q=80';
  }
  if (targetPet === 'cat' || text.includes('mèo con') || text.includes('cai sữa')) {
    return 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1000&auto=format&fit=crop&q=80';
  }
  if (targetPet === 'dog' || text.includes('chó con') || text.includes('cún con')) {
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1000&auto=format&fit=crop&q=80';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, summary, content, category, targetPet, featuredImage, relatedProductIds, tags } = body;

    if (!title || !summary || !content) {
      return NextResponse.json({ success: false, error: 'Tiêu đề, tóm tắt và nội dung là bắt buộc' }, { status: 400 });
    }

    const now = new Date();
    const slug = `${title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')}-${now.getTime().toString().slice(-4)}`;

    const effectiveCategory = category || 'Chăm Sóc & Dinh Dưỡng';
    const effectivePet = targetPet || 'all';
    const resolvedImage = featuredImage && featuredImage.trim().length > 0
      ? featuredImage.trim()
      : getRelevantArticleImage(title, effectiveCategory, effectivePet);

    const newArticle: Article = {
      id: `art-${now.getTime()}`,
      slug,
      title,
      summary,
      content,
      category: effectiveCategory,
      targetPet: effectivePet,
      featuredImage: resolvedImage,
      author: {
        name: 'Đỗ Văn Đức - DVDmultilPET',
        title: 'Chuyên gia Chăm sóc Thú cưng',
        avatar: 'https://images.unsplash.com/photo-1594824813591-6893ddf4f2c0?w=150&auto=format&fit=crop&q=80'
      },
      readTime: '5 phút đọc',
      publishedAt: now.toISOString(),
      status: 'published',
      isAiGenerated: false,
      relatedProductIds: relatedProductIds || [],
      tags: tags || ['Chăm sóc thú cưng', 'DVDmultilPET']
    };

    const saved = saveStoredArticle(newArticle);
    return NextResponse.json({ success: true, article: saved }, { status: 201 });
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json({ success: false, error: 'Lỗi đăng bài viết' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, summary, content, category, targetPet, featuredImage, relatedProductIds, tags } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài viết (id)' }, { status: 400 });
    }

    const currentArticles = getStoredArticles();
    const existing = currentArticles.find((a) => a.id === id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    const finalImage = (featuredImage && featuredImage.trim().length > 0)
      ? featuredImage.trim()
      : (existing.featuredImage && !existing.featuredImage.includes('photo-1548767797-d8c844163c4c'))
        ? existing.featuredImage
        : getRelevantArticleImage(title || existing.title, category || existing.category, targetPet || existing.targetPet);

    const updatedArticle: Article = {
      ...existing,
      title: title ?? existing.title,
      summary: summary ?? existing.summary,
      content: content ?? existing.content,
      category: category ?? existing.category,
      targetPet: targetPet ?? existing.targetPet,
      featuredImage: finalImage,
      relatedProductIds: relatedProductIds ?? existing.relatedProductIds,
      tags: tags ?? existing.tags
    };

    const saved = saveStoredArticle(updatedArticle);
    return NextResponse.json({ success: true, article: saved });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật bài viết' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài viết' }, { status: 400 });
    }

    const deleted = deleteStoredArticle(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, error: 'Lỗi xóa bài viết' }, { status: 500 });
  }
}

