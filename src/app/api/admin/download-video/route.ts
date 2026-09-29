import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');
    const customFilename = searchParams.get('filename') || 'video-tiktok.mp4';

    if (!videoUrl) {
      return NextResponse.json({ error: 'Thiếu tham số url video' }, { status: 400 });
    }

    // 1. Nếu là đường dẫn cục bộ trong public/
    let filePath = '';
    const cleanUrl = decodeURIComponent(videoUrl).replace(/^\//, '');

    // Tìm trong public/media/pet-clips hoặc public/uploads/videos
    const candidatePath = path.join(process.cwd(), 'public', cleanUrl);
    if (fs.existsSync(candidatePath)) {
      filePath = candidatePath;
    } else {
      // Tìm theo tên file
      const baseName = path.basename(cleanUrl);
      const inClips = path.join(process.cwd(), 'public', 'media', 'pet-clips', baseName);
      const inUploads = path.join(process.cwd(), 'public', 'uploads', 'videos', baseName);
      if (fs.existsSync(inClips)) {
        filePath = inClips;
      } else if (fs.existsSync(inUploads)) {
        filePath = inUploads;
      }
    }

    if (filePath && fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const stat = fs.statSync(filePath);

      // Đảm bảo tên file an toàn cho header HTTP
      const asciiName = customFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': stat.size.toString(),
          'Content-Disposition': `attachment; filename="${asciiName}"`,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // 2. Nếu là URL ngoài http/https
    if (videoUrl.startsWith('http')) {
      const fetchRes = await fetch(videoUrl);
      if (fetchRes.ok) {
        const arrayBuf = await fetchRes.arrayBuffer();
        const asciiName = customFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
        return new NextResponse(Buffer.from(arrayBuf), {
          headers: {
            'Content-Type': fetchRes.headers.get('content-type') || 'video/mp4',
            'Content-Disposition': `attachment; filename="${asciiName}"`
          }
        });
      }
    }

    return NextResponse.json({ error: 'Không tìm thấy file video' }, { status: 404 });
  } catch (error: any) {
    console.error('Error downloading video:', error);
    return NextResponse.json({ error: error?.message || 'Lỗi tải video' }, { status: 500 });
  }
}
