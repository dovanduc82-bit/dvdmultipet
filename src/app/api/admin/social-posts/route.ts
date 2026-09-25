import { NextRequest, NextResponse } from 'next/server';
import { getStoredSocialPosts, saveStoredSocialPost, deleteStoredSocialPost } from '@/lib/data/store';
import { SocialPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = getStoredSocialPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return NextResponse.json({ success: false, error: 'Lỗi lấy danh sách bài đăng' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, title, content, hookText, hashtags, targetUrl, publishedUrl, status, scheduledAt } = body;

    if (!title || !content || !platform) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc (platform, title, content)' }, { status: 400 });
    }

    const newPost: SocialPost = {
      id: `sp-${Date.now().toString().slice(-6)}`,
      platform: platform || 'facebook',
      title,
      content,
      hookText: hookText || undefined,
      hashtags: Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(/[\s,]+/).filter(Boolean) : []),
      targetUrl: targetUrl || 'https://thucungtot.net',
      publishedUrl: publishedUrl || undefined,
      status: status || 'draft',
      scheduledAt: scheduledAt || undefined,
      createdAt: new Date().toISOString()
    };

    const saved = saveStoredSocialPost(newPost);
    return NextResponse.json({ success: true, post: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi lưu bài đăng' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, publishedUrl, mediaUrls, scheduledAt } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng id' }, { status: 400 });
    }

    const posts = getStoredSocialPosts();
    const target = posts.find((p) => p.id === id);
    if (!target) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài đăng' }, { status: 404 });
    }

    if (status !== undefined) target.status = status;
    if (publishedUrl !== undefined) target.publishedUrl = publishedUrl;
    if (mediaUrls !== undefined) target.mediaUrls = mediaUrls;
    if (scheduledAt !== undefined) target.scheduledAt = scheduledAt;

    const saved = saveStoredSocialPost(target);
    return NextResponse.json({ success: true, post: saved });
  } catch (error) {
    console.error('Error updating social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật bài đăng' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng' }, { status: 400 });
    }

    const deleted = deleteStoredSocialPost(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi xóa bài đăng' }, { status: 500 });
  }
}
