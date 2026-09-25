import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getStoredProducts } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform = 'tiktok', productId, topic, tone = 'viral' } = body;

    const products = getStoredProducts();
    const selectedProduct = productId ? products.find((p) => p.id === productId) : null;

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is available
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
Bạn là chuyên gia Sáng Tạo Nội Dung Truyền Thông & Video Ngắn (Content Creator & Copywriter) hàng đầu cho chuỗi cửa hàng thú cưng DVDmultilPET (Website: thucungtot.net - Hotline: 0819.210.319).

Nhiệm vụ: Hãy sáng tạo một bài đăng / kịch bản video viral chất lượng cao cho nền tảng: ${platform.toUpperCase()}.

Thông tin đầu vào:
${selectedProduct ? `- Sản phẩm mục tiêu: "${selectedProduct.name}"
- Giá bán: ${selectedProduct.price.toLocaleString('vi-VN')}₫
- Quy cách: ${selectedProduct.weight}
- Mô tả: ${selectedProduct.shortDesc}
- Công dụng chính: ${selectedProduct.benefits?.join(', ') || 'Chính hãng 100%'}` : ''}
${topic ? `- Chủ đề yêu cầu: "${topic}"` : '- Chủ đề: Kiến thức chăm sóc dinh dưỡng và mẹo nuôi thú cưng khoa học'}

Yêu cầu định dạng theo từng nền tảng:
- Nếu là TIKTOK:
  + "hookText": Câu mở đầu giật gân, tò mò trong 3 giây đầu tiên (dưới 20 chữ).
  + "content": Kịch bản chi tiết từ 15-30 giây chia theo từng phân cảnh: [00:00 - 00:05] Cảnh quay & Lời thoại Voiceover. Có hướng dẫn diễn xuất, âm thanh gợi ý và câu kết thúc kêu gọi: 'Bấm ngay vào đường link trong phần mô tả để đặt mua chính hãng tại DVDmultilPET nhé!' (Tuyệt đối không nhắc bấm giỏ hàng góc trái).
- Nếu là FACEBOOK:
  + "hookText": Tiêu đề in hoa kèm emoji hấp dẫn người lướt bảng tin.
  + "content": Bài viết hoàn chỉnh (Storytelling hoặc Cảnh báo bệnh lý thú cưng), phân đoạn rõ ràng, lời khuyên chuyên gia, thông tin sản phẩm và lời kêu gọi đặt hàng (kèm Hotline 0819.210.319).
- Nếu là ZALO:
  + "hookText": Lời chào thân thiện và thông báo ưu đãi.
  + "content": Tin nhắn gửi khách hàng ngắn gọn, súc tích, nêu bật lợi ích và link đặt hàng nhanh.

Yêu cầu đầu ra: CHỈ trả về DUY NHẤT một chuỗi JSON hợp lệ không có giải thích thêm:
{
  "title": "Tiêu đề ngắn gọn của bài đăng",
  "hookText": "Câu hook thu hút",
  "content": "Toàn văn nội dung bài viết hoặc kịch bản",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#dvdmultipet", "#thucungtot"],
  "targetUrl": "Đường link sản phẩm hoặc trang chủ thucungtot.net"
}
`;

        const CANDIDATE_MODELS = [
          'gemini-3.5-flash',
          'gemini-3.5-flash-lite',
          'gemini-3.8-flash',
          'gemini-3.7-flash',
          'gemini-flash-latest'
        ];

        let response: any = null;
        for (const model of CANDIDATE_MODELS) {
          try {
            response = await ai.models.generateContent({
              model,
              contents: prompt
            });
            if (response && response.text) break;
          } catch (mErr) {
            console.warn(`[GenerateSocial] Model ${model} failed, trying next...`);
          }
        }

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            success: true,
            source: 'gemini-ai',
            post: {
              platform,
              title: parsed.title || `Bài đăng ${platform.toUpperCase()}`,
              hookText: parsed.hookText || '',
              content: parsed.content || '',
              hashtags: parsed.hashtags || ['#dvdmultipet', '#thucungtot', '#chamsocthucung'],
              targetUrl: parsed.targetUrl || (selectedProduct ? `https://thucungtot.net/products/${selectedProduct.slug}` : 'https://thucungtot.net')
            }
          });
        }
      } catch (geminiError) {
        console.warn('Gemini generation error, falling back to smart template:', geminiError);
      }
    }

    // 2. Smart Template Fallback (Offline / Demo)
    const prodName = selectedProduct ? selectedProduct.name : 'Máy Lọc Nước Tuần Hoàn 2.5L';
    const prodPrice = selectedProduct ? `${selectedProduct.price.toLocaleString('vi-VN')}₫` : '380.000₫';
    const prodSlug = selectedProduct ? selectedProduct.slug : 'may-loc-nuoc-tuan-hoan-khu-khoang-2-5l-prod-acc-01';

    if (platform === 'tiktok') {
      return NextResponse.json({
        success: true,
        source: 'smart-template',
        post: {
          platform: 'tiktok',
          title: `Kịch bản TikTok: Sai lầm nuôi thú cưng ít ai ngờ tới với ${prodName}`,
          hookText: `90% người nuôi không biết điều này đang âm thầm hại thận thú cưng mỗi ngày!`,
          content: `[00:00 - 00:03] Cận cảnh bé mèo/cún nhìn vào bát nước nhưng quay mặt bỏ đi.
Voiceover: "Bạn có biết tại sao mèo của bạn lại lười uống nước đến vậy không?"

[00:04 - 00:12] Cảnh đặt ${prodName} lên sàn, cắm điện nước phun róc rách. Bé thú cưng tò mò chạy lại liếm nước liên tục.
Voiceover: "Tập tính hoang dã của thú cưng chỉ thích nước chuyển động và giàu oxy tươi! Bát nước để lâu tích tụ vi khuẩn và bụi lông khiến các bé rất sợ."

[00:13 - 00:22] Cận cảnh dòng nước lọc qua lõi lọc than hoạt tính đa tầng.
Voiceover: "Với ${prodName} từ DVDmultilPET, nước được lọc sạch cặn khoáng, khử mùi clo 24/7. Phòng ngừa sỏi bàng quang ngay từ hôm nay!"

[00:23 - 00:30] Bé thú cưng vui vẻ nô đùa.
Voiceover: "Đang có ưu đãi trợ giá chỉ còn ${prodPrice} kèm quà tặng. Bấm ngay vào đường link trong phần mô tả để rinh về cho bé nhé!"`,
          hashtags: ['#meocung', '#chomeo', '#thucungtot', '#dvdmultipet', '#learnontiktok', '#petcare', '#viralvideo'],
          targetUrl: `https://thucungtot.net/products/${prodSlug}`
        }
      });
    }

    if (platform === 'facebook') {
      return NextResponse.json({
        success: true,
        source: 'smart-template',
        post: {
          platform: 'facebook',
          title: `Bài viết Facebook: Giải pháp dinh dưỡng chuẩn thú y với ${prodName}`,
          hookText: `🚨 CẢNH BÁO BỆNH LÝ MÙA THAY ĐỔI THỜI TIẾT Ở CHÓ MÈO & GIẢI PHÁP TỪ BÁC SĨ THÚ Y!`,
          content: `🚨 CẢNH BÁO: RẤT NHIỀU BÉ THÚ CƯNG ĐANG GẶP VẤN ĐỀ VỀ SỨC KHỎE VÌ THÓI QUEN NÀY!

Thời tiết giao mùa khiến hệ miễn dịch của các bé chó mèo suy giảm rõ rệt. Dấu hiệu dễ thấy nhất:
❌ Lông xơ xác, rụng từng mảng.
❌ Tiêu hóa kém, hay nôn ói hoặc phân lỏng.
❌ Lười vận động, uể oải.

💡 LỜI KHUYÊN TỪ BÁC SĨ THÚ Y DVDmultilPET:
Bổ sung ngay chế độ dinh dưỡng chuyên biệt: ${prodName}.
✨ Điểm nổi bật:
• Đạt chuẩn dinh dưỡng thú y quốc tế.
• Hỗ trợ đề kháng tự nhiên, củng cố tiêu hóa khỏe mạnh.
• An toàn 100%, không chất bảo quản nhân tạo.

🎁 ƯU ĐÃI ĐẶC BIỆT TUẦN NÀY:
Giá ưu đãi: CHỈ ${prodPrice} (Freeship toàn quốc cho đơn từ 500k).
📞 Hotline tư vấn thú y miễn phí: 0819.210.319 (Zalo)
🌐 Xem chi tiết và đặt hàng tại: https://thucungtot.net/products/${prodSlug}`,
          hashtags: ['#dvdmultipet', '#thucungtot', '#dinhduongchomeo', '#chamsocthucung', '#chomeo', '#bacsythuy'],
          targetUrl: `https://thucungtot.net/products/${prodSlug}`
        }
      });
    }

    // Zalo Broadcast
    return NextResponse.json({
      success: true,
      source: 'smart-template',
      post: {
        platform: 'zalo',
        title: `Tin nhắn Zalo: Thông báo ưu đãi ${prodName}`,
        hookText: `[ƯU ĐÃI ĐỘC QUYỀN] DVDmultilPET gửi tặng ba mẹ thú cưng deal hot hôm nay!`,
        content: `Dạ em chào anh/chị ạ! 🐾

DVDmultilPET xin gửi tới anh/chị giải pháp chăm sóc bé yêu tốt nhất tuần này:
⭐ Sản phẩm: ${prodName}
💰 Giá ưu đãi hôm nay: ${prodPrice}
🎁 Tặng kèm quà tặng thú cưng xinh xắn cho các đơn đặt sớm!

👉 Anh/chị xem chi tiết và chọn phân loại tại link này nha:
https://thucungtot.net/products/${prodSlug}

Hoặc nhắn tin trực tiếp Zalo này (0819.210.319) để được đội ngũ thú y hỗ trợ giao hàng tận nơi nhanh nhất ạ!`,
        hashtags: ['#dvdmultipet', '#thucungtot'],
        targetUrl: `https://thucungtot.net/products/${prodSlug}`
      }
    });
  } catch (error) {
    console.error('Error generating social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi tạo bài đăng truyền thông' }, { status: 500 });
  }
}
