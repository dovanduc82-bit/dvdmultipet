import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clipsDir = path.join(process.cwd(), 'public', 'media', 'pet-clips');
    if (!fs.existsSync(clipsDir)) {
      fs.mkdirSync(clipsDir, { recursive: true });
    }

    // Auto-sync videos from E:\Thú cưng and E:\Thú cưng\Video up tiktok
    const sourceDirs = ['E:\\Thú cưng', 'E:\\Thú cưng\\Video up tiktok'];
    for (const sDir of sourceDirs) {
      if (fs.existsSync(sDir)) {
        try {
          const sFiles = fs.readdirSync(sDir);
          for (const sf of sFiles) {
            if (/\.(mp4|webm|mov)$/i.test(sf)) {
              const srcPath = path.join(sDir, sf);
              const dstPath = path.join(clipsDir, sf);
              if (!fs.existsSync(dstPath)) {
                fs.copyFileSync(srcPath, dstPath);
              }
            }
          }
        } catch (e) {
          // ignore permission errors
        }
      }
    }

    const files = fs.readdirSync(clipsDir);
    // Prioritize videos: 5.mp4, Thu cung 1.mp4, 1.mp4, 3.mp4, 4.mp4, 2.mp4, 6.mp4, 7.mp4
    const videoFiles = files.filter((file) => /\.(mp4|webm|mov)$/i.test(file));

    // Sort order: put 5.mp4 (dog running on grass) and Thu cung 1.mp4 (tiktok vertical) first
    videoFiles.sort((a, b) => {
      if (a === '5.mp4') return -1;
      if (b === '5.mp4') return 1;
      if (a.toLowerCase().includes('thu cung')) return -1;
      if (b.toLowerCase().includes('thu cung')) return 1;
      return a.localeCompare(b);
    });

    const clips = videoFiles.map((file, idx) => {
      let title = `Cảnh quay video #${idx + 1} (${file})`;
      if (file === '5.mp4') title = '⭐ Cảnh 5: Chú cún khỏe mạnh chạy nhảy tự do trên cỏ (Khuyên dùng)';
      else if (file.toLowerCase().includes('thu cung')) title = '⭐ Cảnh 8: Video dọc chuyên nghiệp chuẩn TikTok (Khuyên dùng)';
      else if (file === '1.mp4') title = 'Cảnh 1: Cún đi dạo đường công viên rợp bóng mát';
      else if (file === '3.mp4') title = 'Cảnh 3: Cún vui đùa trên thảm cỏ xanh mướt';
      else if (file === '4.mp4') title = 'Cảnh 4: Bé cún lông mượt chơi đùa tinh nghịch';
      else if (file === '2.mp4') title = 'Cảnh 2: Thú cưng bơi lội dưới hồ nước thiên nhiên';
      else if (file === '6.mp4') title = 'Cảnh 6: Thú cưng tắm mát sảng khoái dưới hồ';
      else if (file === '7.mp4') title = 'Cảnh 7: Cận cảnh cún cưng dễ thương, năng động';

      return {
        id: `clip-${idx + 1}`,
        filename: file,
        name: title,
        url: `/media/pet-clips/${encodeURIComponent(file)}`,
        type: 'video'
      };
    });

    return NextResponse.json({ success: true, clips });
  } catch (error: any) {
    console.error('Error listing media library:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
