import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clipsDir = path.join(process.cwd(), 'public', 'media', 'pet-clips');
    if (!fs.existsSync(clipsDir)) {
      fs.mkdirSync(clipsDir, { recursive: true });
    }

    // Auto-sync videos from E:\Thú cưng and E:\Thú cưng\Video up tiktok if on Windows host
    if (process.platform === 'win32') {
      const sourceDirs = ['E:\\Thú cưng', 'E:\\Thú cưng\\Video up tiktok'];
      for (const sDir of sourceDirs) {
        try {
          if (fs.existsSync(sDir)) {
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
          }
        } catch {
          // ignore local access error
        }
      }
    }

    const files = fs.readdirSync(clipsDir);
    // Filter video files, and deduplicate 1 (1).mp4 if Thu cung 1.mp4 is already present
    const rawVideoFiles = files.filter((file) => /\.(mp4|webm|mov)$/i.test(file));
    const videoFiles = rawVideoFiles.filter((file) => {
      if (file === '1 (1).mp4' && rawVideoFiles.includes('Thu cung 1.mp4')) {
        return false; // skip duplicate
      }
      return true;
    });

    // Custom sorting: Put best TikTok-ready vertical videos and top clips first
    const getPriority = (f: string) => {
      if (f === '5.mp4') return 1;
      if (f.toLowerCase().includes('thu cung') || f.includes('0924')) return 2;
      if (f === '1.mp4') return 3;
      if (f === '4.mp4') return 4;
      if (f === '3.mp4') return 5;
      if (f === '7.mp4') return 6;
      if (f === '8.mp4') return 7;
      if (f === '9.mp4') return 8;
      if (f === '12.mp4') return 9;
      if (f === '14.mp4') return 10;
      if (f === '15.mp4') return 11;
      if (f === '2.mp4') return 12;
      if (f === '6.mp4') return 13;
      return 20;
    };

    videoFiles.sort((a, b) => getPriority(a) - getPriority(b) || a.localeCompare(b));

    const clips = videoFiles.map((file, idx) => {
      let title = `Cảnh quay video #${idx + 1} (${file})`;
      if (file === '5.mp4') {
        title = '⭐ Cảnh 5: Chú cún khỏe mạnh chạy nhảy tự do trên cỏ (Khuyên dùng)';
      } else if (file.toLowerCase().includes('thu cung') || file === '1 (1).mp4') {
        title = '⭐ Cảnh TikTok 1: Video dọc chuyên nghiệp chuẩn TikTok 9:16 (Khuyên dùng)';
      } else if (file.includes('0924')) {
        title = '⭐ Cảnh TikTok 2: Video dọc thú cưng tinh nghịch chuẩn Reels/TikTok 9:16';
      } else if (file === '1.mp4') {
        title = 'Cảnh 1: Cún đi dạo đường công viên rợp bóng mát';
      } else if (file === '2.mp4') {
        title = 'Cảnh 2: Thú cưng bơi lội dưới hồ nước thiên nhiên';
      } else if (file === '3.mp4') {
        title = 'Cảnh 3: Cún vui đùa trên thảm cỏ xanh mướt';
      } else if (file === '4.mp4') {
        title = 'Cảnh 4: Bé cún lông mượt chơi đùa tinh nghịch';
      } else if (file === '6.mp4') {
        title = 'Cảnh 6: Thú cưng tắm mát sảng khoái dưới hồ';
      } else if (file === '7.mp4') {
        title = 'Cảnh 7: Cận cảnh cún cưng dễ thương, năng động';
      } else if (file === '8.mp4') {
        title = 'Cảnh 8: Bé cún chạy nhảy vui vẻ ngoài trời';
      } else if (file === '9.mp4') {
        title = 'Cảnh 9: Cận cảnh thú cưng đáng yêu, hoạt bát';
      } else if (file === '12.mp4') {
        title = 'Cảnh 12: Thú cưng nô đùa khỏe khoắn, tràn đầy năng lượng';
      } else if (file === '14.mp4') {
        title = 'Cảnh 14: Cảnh quay góc rộng thú cưng vui chơi ngoài trời';
      } else if (file === '15.mp4') {
        title = 'Cảnh 15: Khoảnh khắc thú cưng tinh nghịch, lanh lợi';
      }

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
