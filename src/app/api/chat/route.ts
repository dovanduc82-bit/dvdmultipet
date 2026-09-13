import { NextRequest, NextResponse } from 'next/server';
import { askPetNutritionist } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Tin nhắn không hợp lệ' },
        { status: 400 }
      );
    }

    const result = await askPetNutritionist(message, history || []);

    return NextResponse.json({
      reply: result.reply,
      suggestedProducts: result.suggestedProducts
    });
  } catch (error) {
    console.error('API Chat Error:', error);
    return NextResponse.json(
      { error: 'Lỗi trong quá trình xử lý tư vấn dinh dưỡng' },
      { status: 500 }
    );
  }
}
