import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function splitIntoChunks(text: string, maxLen = 160): string[] {
  const cleanText = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLen) return [cleanText];

  const sentences = cleanText.split(/([.!?,;:\n]+)/);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if ((current + part).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    } else {
      current += part;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Thiếu nội dung văn bản' }, { status: 400 });
    }

    const chunks = splitIntoChunks(text);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=vi&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuf));
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json({ error: 'Không thể tạo âm thanh giọng đọc' }, { status: 500 });
    }

    const combined = Buffer.concat(audioBuffers);

    return new NextResponse(combined, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.length.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
      }
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    return NextResponse.json({ error: error.message || 'Lỗi tạo giọng đọc' }, { status: 500 });
  }
}
