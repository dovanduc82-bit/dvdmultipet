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

    const newArticle: Article = {
      id: `art-${now.getTime()}`,
      slug,
      title,
      summary,
      content,
      category: category || 'Chăm Sóc & Dinh Dưỡng',
      targetPet: targetPet || 'all',
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
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
