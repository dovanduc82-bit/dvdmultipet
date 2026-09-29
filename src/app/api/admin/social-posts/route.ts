import { NextRequest, NextResponse } from 'next/server';
import { getStoredSocialPosts, saveStoredSocialPost, deleteStoredSocialPost, parseValidDate } from '@/lib/data/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SocialPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Primary: Fetch live from Supabase Cloud if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('social_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const posts: SocialPost[] = data.map((r: any) => ({
            id: r.id,
            platform: r.platform,
            title: r.title,
            content: r.content,
            hookText: r.hook_text || undefined,
            hashtags: Array.isArray(r.hashtags) ? r.hashtags : [],
            mediaUrls: Array.isArray(r.media_urls) ? r.media_urls : [],
            targetUrl: r.target_url || undefined,
            publishedUrl: r.published_url || undefined,
            status: r.status || 'draft',
            scheduledAt: r.scheduled_at || undefined,
            createdAt: r.created_at || new Date().toISOString()
          }));

          return NextResponse.json({ success: true, posts, source: 'supabase' });
        }
      } catch (sbErr) {
        console.warn('[SocialPosts GET] Supabase query error, falling back to local store:', sbErr);
      }
    }

    // 2. Secondary fallback: Local JSON store
    const posts = getStoredSocialPosts();
    return NextResponse.json({ success: true, posts, source: 'local' });
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return NextResponse.json({ success: false, error: 'Lỗi lấy danh sách bài đăng' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, title, content, hookText, hashtags, targetUrl, publishedUrl, status, scheduledAt, mediaUrls } = body;

    if (!title || !content || !platform) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc (platform, title, content)' }, { status: 400 });
    }

    const newPost: SocialPost = {
      id: body.id || `sp-${Date.now().toString().slice(-6)}`,
      platform: platform || 'tiktok',
      title,
      content,
      hookText: hookText || undefined,
      hashtags: Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(/[\s,]+/).filter(Boolean) : []),
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
      targetUrl: targetUrl || 'https://thucungtot.net',
      publishedUrl: publishedUrl || undefined,
      status: status || 'draft',
      scheduledAt: scheduledAt || undefined,
      createdAt: body.createdAt || new Date().toISOString()
    };

    // 1. Direct await write to Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbErr } = await supabase.from('social_posts').upsert([
          {
            id: newPost.id,
            platform: newPost.platform,
            title: newPost.title,
            content: newPost.content,
            hook_text: newPost.hookText || null,
            hashtags: newPost.hashtags || [],
            media_urls: newPost.mediaUrls || [],
            target_url: newPost.targetUrl || null,
            published_url: newPost.publishedUrl || null,
            status: newPost.status || 'draft',
            scheduled_at: parseValidDate(newPost.scheduledAt),
            created_at: newPost.createdAt
          }
        ]);
        if (sbErr) {
          console.error('[SocialPosts POST] Supabase upsert error:', sbErr);
        }
      } catch (err: any) {
        console.error('[SocialPosts POST] Supabase exception:', err);
      }
    }

    // 2. Local store backup
    saveStoredSocialPost(newPost);

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving social post:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Lỗi lưu bài đăng' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, publishedUrl, mediaUrls, scheduledAt } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã bài đăng id' }, { status: 400 });
    }

    // 1. Update in Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (publishedUrl !== undefined) updateData.published_url = publishedUrl;
        if (mediaUrls !== undefined) updateData.media_urls = mediaUrls;
        if (scheduledAt !== undefined) updateData.scheduled_at = parseValidDate(scheduledAt);

        const { error: sbErr } = await supabase.from('social_posts').update(updateData).eq('id', id);
        if (sbErr) {
          console.error('[SocialPosts PATCH] Supabase update error:', sbErr);
        }
      } catch (err) {
        console.error('[SocialPosts PATCH] Supabase exception:', err);
      }
    }

    // 2. Update local fallback store
    const posts = getStoredSocialPosts();
    const target = posts.find((p) => p.id === id);
    if (target) {
      if (status !== undefined) target.status = status;
      if (publishedUrl !== undefined) target.publishedUrl = publishedUrl;
      if (mediaUrls !== undefined) target.mediaUrls = mediaUrls;
      if (scheduledAt !== undefined) target.scheduledAt = scheduledAt;
      saveStoredSocialPost(target);
      return NextResponse.json({ success: true, post: target });
    }

    return NextResponse.json({ success: true });
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

    // 1. Delete in Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbErr } = await supabase.from('social_posts').delete().eq('id', id);
        if (sbErr) console.error('[SocialPosts DELETE] Supabase delete error:', sbErr);
      } catch (err) {
        console.error('[SocialPosts DELETE] Supabase exception:', err);
      }
    }

    // 2. Delete local store backup
    const deleted = deleteStoredSocialPost(id);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi xóa bài đăng' }, { status: 500 });
  }
}
