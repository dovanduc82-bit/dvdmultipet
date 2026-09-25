import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getStoredSocialPosts, saveStoredSocialPost } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const postId = formData.get('postId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Chưa có file video tải lên' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.mp4';
    const safeName = `video-${postId || 'temp'}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const videoUrl = `/uploads/videos/${safeName}`;

    // If postId provided, attach to post
    let updatedPost = null;
    if (postId) {
      const posts = getStoredSocialPosts();
      const post = posts.find((p) => p.id === postId);
      if (post) {
        if (!post.mediaUrls) post.mediaUrls = [];
        post.mediaUrls.unshift(videoUrl);
        updatedPost = saveStoredSocialPost(post);
      }
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      post: updatedPost,
      message: 'Video đã được lưu trữ thành công vào hệ thống!'
    });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    return NextResponse.json({
      success: false,
      error: `Lỗi lưu trữ video: ${error?.message || 'Vui lòng thử lại'}`
    }, { status: 500 });
  }
}
