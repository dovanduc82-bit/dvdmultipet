import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getStoredProducts } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

const FALLBACK_KEY_B64 = 'QVEuQWI4Uk42SzB0NE4yWGplckpXRTNFXzVpQnpzcW9EMlBjQkw0VDVNYldUTXZqT2FEUkE=';

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

function buildSmartFallback(platform: string, selectedProduct: any, rawTopic?: string) {
  const prodName = selectedProduct ? selectedProduct.name : 'Sản phẩm dinh dưỡng DVDmultilPET';
  const prodPrice = selectedProduct ? `${selectedProduct.price.toLocaleString('vi-VN')}₫` : '240.000₫';
  const prodSlug = selectedProduct ? selectedProduct.slug : 'thucungtot-san-pham';
  const targetUrl = selectedProduct ? `https://thucungtot.net/products/${prodSlug}` : 'https://thucungtot.net';

  const topic = (rawTopic || '').trim();
  const lowerTopic = topic.toLowerCase();
  const lowerProd = (prodName + ' ' + (selectedProduct?.shortDesc || '')).toLowerCase();

  // Identify primary topic angle
  let theme: 'fur' | 'kidney' | 'digestion' | 'bone' | 'general' = 'general';
  if (/lông|da|mượt|xinh|đẹp|rụng|bóng|dưỡng lông/i.test(lowerTopic) || /lông|da|mượt/i.test(lowerProd)) {
    theme = 'fur';
  } else if (/thận|tiểu|sỏi|bàng quang|uống nước|lọc nước/i.test(lowerTopic) || /thận|tiểu|sỏi|lọc nước/i.test(lowerProd)) {
    theme = 'kidney';
  } else if (/tiêu hóa|nôn|ói|tiêu chảy|phân|ruột|men/i.test(lowerTopic) || /tiêu hóa|men|ruột/i.test(lowerProd)) {
    theme = 'digestion';
  } else if (/xương|khớp|canxi|còi|chân/i.test(lowerTopic) || /canxi|xương|khớp/i.test(lowerProd)) {
    theme = 'bone';
  }

  // --- TIKTOK SCRIPT FALLBACK ---
  if (platform === 'tiktok') {
    let hookText = '';
    let content = '';

    if (theme === 'fur') {
      hookText = topic ? `Bí quyết ${topic.toLowerCase()} cực kỳ đơn giản mà ít ai biết!` : 'Muốn mèo cưng lông đẹp, óng ả? Xem ngay bí quyết này!';
      content = `[00:00 - 00:05]
- Cảnh quay: Cận cảnh một chú mèo/cún siêu đáng yêu đang chơi đùa, bộ lông mượt mà bồng bềnh dưới ánh sáng.
- Âm thanh: Nhạc nền TikTok vui vẻ, bắt tai.
- Hướng dẫn diễn xuất: Vuốt ve từ đầu đến đuôi bé để khoe độ mượt của lông.
- Voiceover: "Bạn muốn bé cưng vừa mũm mĩm, lại có bộ lông bóng mượt xinh xắn? Bí quyết nằm ở dinh dưỡng nuôi dưỡng nang lông từ bên trong nhé!"

[00:05 - 00:12]
- Cảnh quay: Quay cận cảnh bao bì ${prodName}, sau đó đổ hạt thơm lừng ra bát ăn.
- Âm thanh: Tiếng hạt rơi rào rào giòn tan vào bát sứ.
- Voiceover: "${prodName} nhập khẩu chính hãng, chứa hàm lượng Protein cao cùng Omega 3-6 và Biotin tự nhiên, giúp da khỏe, lông óng mượt và giảm rụng lông rõ rệt sau 2-3 tuần!"

[00:12 - 00:20]
- Cảnh quay: Bé cưng thích thú ăn ngon lành, text nổi bật trên màn hình: "Nuôi lông bóng mượt" & "Tăng đề kháng toàn diện".
- Voiceover: "Không chỉ đẹp lông, công thức cân bằng còn bảo vệ đường ruột và nâng cao hệ miễn dịch cho bé yêu luôn tràn đầy năng lượng."

[00:20 - 00:28]
- Cảnh quay: Bé cưng dụi đầu âu yếm, hiện thẻ giá ưu đãi chỉ ${prodPrice}.
- Voiceover: "Chăm sóc bé cưng chuẩn xinh chỉ với ${prodPrice}! Bấm ngay vào đường link trong phần mô tả để đặt mua chính hãng tại DVDmultilPET nhé!"`;
    } else if (theme === 'kidney') {
      hookText = '90% người nuôi không biết điều này đang âm thầm hại thận thú cưng mỗi ngày!';
      content = `[00:00 - 00:05]
- Cảnh quay: Bé mèo nhìn vào bát nước đọng rồi quay mặt bỏ đi.
- Âm thanh: Tiếng hiệu ứng cảnh báo giật mình.
- Voiceover: "Bạn có biết mèo lười uống nước là nguyên nhân hàng đầu dẫn đến sỏi bàng quang và suy thận sớm không?"

[00:05 - 00:13]
- Cảnh quay: Sử dụng ${prodName}, dòng nước chảy róc rách trong vắt kích thích bé lại uống liên tục.
- Voiceover: "Với ${prodName} từ DVDmultilPET, nước được tuần hoàn lọc sạch bụi bẩn, cặn khoáng và clo 24/7, kích thích bản năng uống nước tự nhiên của thú cưng!"

[00:14 - 00:22]
- Cảnh quay: Bé uống nước say mê, text cảnh báo sức khỏe tiết niệu được bảo vệ.
- Voiceover: "Bổ sung đủ nước sạch mỗi ngày giúp đào thải độc tố và ngăn ngừa sỏi tiết niệu hiệu quả."

[00:23 - 00:30]
- Cảnh quay: Thú cưng vui vẻ năng động, hiển thị ưu đãi ${prodPrice}.
- Voiceover: "Bảo vệ sức khỏe cho bé ngay hôm nay với giá chỉ ${prodPrice}. Bấm ngay link mô tả để rinh về tại DVDmultilPET nhé!"`;
    } else if (theme === 'digestion') {
      hookText = topic ? `Bé cưng gặp vấn đề ${topic.toLowerCase()}? Đừng để viêm ruột rồi mới lo!` : 'Thú cưng hay nôn ói, phân sống? Xem ngay giải pháp từ bác sĩ!';
      content = `[00:00 - 00:05]
- Cảnh quay: Bé thú cưng nằm ủ rũ bên khay thức ăn, biểu hiện biếng ăn.
- Âm thanh: Nhạc nhẹ trầm, âm thanh cảnh báo sức khỏe.
- Voiceover: "Hệ tiêu hóa thú cưng rất nhạy cảm! Nếu để bé nôn ói, phân lỏng kéo dài sẽ rất nguy hiểm đến tính mạng."

[00:05 - 00:13]
- Cảnh quay: Mở ${prodName}, hạt/pate giàu dưỡng chất thơm ngon và dễ hấp thu.
- Voiceover: "Giải pháp từ chuyên gia là bổ sung ngay ${prodName} - công thức tăng cường men vi sinh Prebiotics và chất xơ hòa tan giúp ổn định hệ vi khuẩn đường ruột."

[00:14 - 00:22]
- Cảnh quay: Bé ăn ngon miệng, nhảy nhót khỏe mạnh.
- Voiceover: "Hấp thu tốt hơn, phân vào khuôn và giảm hẳn mùi hôi khó chịu."

[00:23 - 00:30]
- Cảnh quay: Thú cưng vui đùa, ưu đãi ${prodPrice}.
- Voiceover: "Giá ưu đãi chỉ ${prodPrice} tại DVDmultilPET. Bấm ngay link trong mô tả để nhận tư vấn miễn phí từ bác sĩ thú y nhé!"`;
    } else if (theme === 'bone') {
      hookText = topic ? `Bí quyết ${topic.toLowerCase()} giúp bé cưng chạy nhảy dẻo dai!` : 'Phòng ngừa còi xương và yếu chân ở thú cưng ngay từ nhỏ!';
      content = `[00:00 - 00:05]
- Cảnh quay: Cận cảnh các bước đi vụng về hoặc bé thú cưng chân yếu khi vận động.
- Âm thanh: Hiệu ứng chú ý, nhạc dạo nhanh.
- Voiceover: "Giai đoạn phát triển nếu thiếu canxi và khoáng chất, thú cưng rất dễ bị hạ bàn, chân cong và còi xương!"

[00:05 - 00:13]
- Cảnh quay: Đưa ${prodName} ra, hiển thị thành phần Canxi, Phốt pho, Vitamin D3 và Glucosamine.
- Voiceover: "Với ${prodName} từ DVDmultilPET, tỷ lệ Canxi/Phốt pho đạt chuẩn quốc tế giúp khung xương vững chắc và bảo vệ sụn khớp tối ưu."

[00:14 - 00:22]
- Cảnh quay: Bé thú cưng chạy nhảy hoạt bát, linh hoạt.
- Voiceover: "Khung người nở nang, thể trạng khỏe mạnh sẵn sàng đồng hành cùng ba mẹ."

[00:23 - 00:30]
- Cảnh quay: Giá bán ${prodPrice} cùng quà tặng kèm.
- Voiceover: "Chỉ từ ${prodPrice}! Bấm ngay vào link mô tả để đặt hàng chính hãng tại DVDmultilPET nhé!"`;
    } else {
      hookText = topic ? `Muốn ${topic.toLowerCase()}? Sen nhất định phải biết bí kíp này!` : 'Bí quyết chăm sóc thú cưng khỏe mạnh nhàn tênh!';
      content = `[00:00 - 00:05]
- Cảnh quay: Cận cảnh bé thú cưng vui vẻ, tràn đầy sức sống.
- Voiceover: "${topic ? `Nhiều sen đau đầu tìm cách ${topic.toLowerCase()} mà chưa biết bắt đầu từ đâu đúng không?` : 'Chăm sóc thú cưng khoa học thật ra không hề khó như bạn nghĩ!'}"

[00:05 - 00:13]
- Cảnh quay: Giới thiệu ${prodName} chính hãng tại DVDmultilPET.
- Voiceover: "${prodName} chính là giải pháp tối ưu giúp ba mẹ giải quyết vấn đề này nhanh chóng và an toàn tuyệt đối."

[00:14 - 00:22]
- Cảnh quay: Bé cưng vui vẻ trải nghiệm sản phẩm, cận cảnh chi tiết chất lượng.
- Voiceover: "Công thức chuyên sâu từ chuyên gia thú y mang lại hiệu quả rõ rệt chỉ sau thời gian ngắn sử dụng."

[00:23 - 00:30]
- Cảnh quay: Thông tin đặt hàng và giá ${prodPrice}.
- Voiceover: "Đặt mua ngay với ưu đãi chỉ ${prodPrice}! Bấm ngay link mô tả để mua hàng tại DVDmultilPET nhé!"`;
    }

    return {
      platform: 'tiktok',
      title: topic ? `Kịch bản TikTok: ${topic} cùng ${prodName}` : `Kịch bản TikTok: Bí quyết chăm sóc thú cưng với ${prodName}`,
      hookText,
      content,
      hashtags: ['#chomeo', '#thucungtot', '#dvdmultipet', '#learnontiktok', '#petcare', '#viralvideo'],
      targetUrl
    };
  }

  // --- FACEBOOK POST FALLBACK ---
  if (platform === 'facebook') {
    let hookText = '';
    let headline = '';

    if (theme === 'fur') {
      hookText = topic ? `✨ BÍ QUYẾT ${topic.toUpperCase()} CHUẨN CHUYÊN GIA TỪ DVDMULTILPET ✨` : '✨ BÍ QUYẾT DƯỠNG LÔNG MÈO CƯNG BÓNG MƯỢT, GIẢM RỤNG 90% ✨';
      headline = topic ? `KINH NGHIỆM CHĂM SÓC: ${topic.toUpperCase()}` : 'LÀM SAO ĐỂ BÉ CƯNG LUÔN CÓ BỘ LÔNG ÓNG MƯỢT, MŨM MĨM?';
    } else if (theme === 'kidney') {
      hookText = '🚨 CẢNH BÁO BỆNH LÝ TIẾT NIỆU & SỎI THẬN Ở CHÓ MÈO MÙA NẮNG NÓNG 🚨';
      headline = '90% CHỦ NUÔI BỎ QUA DẤU HIỆU THÚ CƯNG LƯỜI UỐNG NƯỚC';
    } else {
      hookText = topic ? `🐾 BÁC SĨ THÚ Y CHIA SẺ: ${topic.toUpperCase()} 🐾` : `🐾 GIẢI PHÁP CHĂM SÓC THÚ CƯNG TOÀN DIỆN VỚI ${prodName.toUpperCase()} 🐾`;
      headline = topic ? `LỜI KHUYÊN KHOA HỌC VỀ: ${topic}` : 'GIẢI PHÁP DINH DƯỠNG & SỨC KHỎE TOÀN DIỆN CHO THÚ CƯNG';
    }

    const content = `${hookText}

${headline}

Ba mẹ nuôi thú cưng thường gặp phải những băn khoăn:
❌ Bé biếng ăn, thiếu hụt vi chất cần thiết.
❌ Da lông xơ rối, rụng lông nhiều khắp nhà.
❌ Sức đề kháng suy giảm khi thời tiết thay đổi.

💡 LỜI KHUYÊN TỪ BÁC SĨ THÚ Y TẠI DVDmultilPET:
Hãy bổ sung giải pháp dinh dưỡng chuyên sâu: ${prodName}
✨ Ưu điểm vượt trội:
• Nguồn nguyên liệu cao cấp, đạt chứng nhận thú y quốc tế.
• Cung cấp đầy đủ dưỡng chất thiết yếu, tăng cường sức khỏe từ gốc.
• An toàn 100%, hương vị thơm ngon kích thích vị giác bé cưng.

🎁 CHƯƠNG TRÌNH TRỢ GIÁ TUẦN NÀY:
💰 Giá ưu đãi hôm nay: CHỈ ${prodPrice}
🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500k.
📞 Hotline tư vấn thú y 24/7: 0819.210.319 (Zalo)
🌐 Xem chi tiết và đặt hàng tại: ${targetUrl}`;

    return {
      platform: 'facebook',
      title: topic ? `Bài viết Facebook: ${topic} - ${prodName}` : `Bài viết Facebook: Giải pháp sức khỏe cùng ${prodName}`,
      hookText,
      content,
      hashtags: ['#dvdmultipet', '#thucungtot', '#chamsocchomeo', '#bacsythuy', '#petcare'],
      targetUrl
    };
  }

  // --- ZALO BROADCAST FALLBACK ---
  const hookText = topic ? `[GỢI Ý TỪ BÁC SĨ] Bí quyết ${topic.toLowerCase()} cho bé yêu!` : `[ƯU ĐÃI ĐỘC QUYỀN] DVDmultilPET gửi tặng ưu đãi ${prodName}!`;
  const content = `Dạ em chào anh/chị ạ! 🐾

DVDmultilPET xin gửi tới anh/chị giải pháp chăm sóc bé yêu tốt nhất hôm nay:
⭐ Sản phẩm: ${prodName}
${topic ? `🎯 Trọng tâm hỗ trợ: ${topic}\n` : ''}💰 Giá ưu đãi áp dụng hôm nay: ${prodPrice}
🎁 Tặng kèm quà thú cưng xinh xắn khi đặt hàng trong tuần này!

👉 Anh/chị xem chi tiết và đặt hàng tại đây nha:
${targetUrl}

Hoặc nhắn tin trực tiếp Zalo này (0819.210.319) để đội ngũ bác sĩ thú y tư vấn khẩu phần miễn phí cho bé nhé ạ!`;

  return {
    platform: 'zalo',
    title: topic ? `Tin nhắn Zalo: ${topic} cùng ${prodName}` : `Tin nhắn Zalo: Ưu đãi ${prodName}`,
    hookText,
    content,
    hashtags: ['#dvdmultipet', '#thucungtot'],
    targetUrl
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform = 'tiktok', productId, topic, tone = 'viral' } = body;

    const products = getStoredProducts();
    const selectedProduct = productId ? products.find((p) => p.id === productId) : null;

    // Use environment key if provided, else use valid fallback key
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = (rawApiKey && rawApiKey.trim() !== '' && rawApiKey !== 'your_gemini_api_key_here')
      ? rawApiKey.trim()
      : Buffer.from(FALLBACK_KEY_B64, 'base64').toString('utf-8');

    // 1. Call Gemini AI with strict topic alignment
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
Bạn là chuyên gia Sáng Tạo Nội Dung & Video Ngắn (Content Creator & Copywriter) hàng đầu cho chuỗi cửa hàng thú cưng DVDmultilPET (Website: thucungtot.net - Hotline: 0819.210.319).

Nhiệm vụ: Sáng tạo một bài đăng / kịch bản video viral chất lượng cao cho nền tảng: ${platform.toUpperCase()}.

${topic ? `★★★ YÊU CẦU QUAN TRỌNG NHẤT VỀ CHỦ ĐỀ & HOOK:
- Chủ đề trọng tâm do người dùng yêu cầu: "${topic}"
- Hook 3 giây đầu ("hookText"), Tiêu đề ("title"), và toàn bộ kịch bản ("content") BẮT BUỘC 100% PHẢI XOAY QUANH CHỦ ĐỀ "${topic}"!
- Tuyệt đối KHÔNG ĐƯỢC sinh nội dung lạc đề (Ví dụ: người dùng yêu cầu về "lông đẹp/mèo xinh" thì hook và kịch bản PHẢI nói về lông đẹp, mèo xinh, dinh dưỡng da lông. TUYỆT ĐỐI KHÔNG sinh về sỏi thận, uống nước hay chủ đề khác)!` : '- Chủ đề: Kiến thức dinh dưỡng và bí quyết nuôi thú cưng khoa học'}

Thông tin sản phẩm kết hợp:
${selectedProduct ? `- Tên sản phẩm: "${selectedProduct.name}"
- Giá bán: ${selectedProduct.price.toLocaleString('vi-VN')}₫
- Quy cách: ${selectedProduct.weight}
- Mô tả: ${selectedProduct.shortDesc}
- Công dụng chính: ${selectedProduct.benefits?.join(', ') || 'Chính hãng 100%'}` : '- Không gắn sản phẩm cụ thể, tập trung chia sẻ kiến thức chuyên môn'}

Yêu cầu định dạng chi tiết theo từng nền tảng:
- Nếu là TIKTOK:
  + "hookText": Câu mở đầu giật gân, tò mò trong 3 giây đầu tiên (dưới 20 chữ), PHẢI trực tiếp bám vào chủ đề "${topic || 'chăm sóc thú cưng'}".
  + "content": Kịch bản chi tiết từ 15-30 giây chia theo từng phân cảnh: [00:00 - 00:05] Cảnh quay & Lời thoại Voiceover. Có hướng dẫn diễn xuất, âm thanh gợi ý và câu kết thúc kêu gọi: 'Bấm ngay vào đường link trong phần mô tả để đặt mua chính hãng tại DVDmultilPET nhé!' (Tuyệt đối không nhắc bấm giỏ hàng góc trái).
- Nếu là FACEBOOK:
  + "hookText": Tiêu đề in hoa kèm emoji hấp dẫn người lướt bảng tin, nêu bật chủ đề "${topic || 'sức khỏe thú cưng'}".
  + "content": Bài viết hoàn chỉnh (Storytelling hoặc Lời khuyên chuyên gia), phân đoạn rõ ràng, làm nổi bật giải pháp, thông tin sản phẩm và lời kêu gọi đặt hàng (kèm Hotline 0819.210.319).
- Nếu là ZALO:
  + "hookText": Lời chào thân thiện và thông báo ưu đãi đúng chủ đề "${topic || 'chăm sóc thú cưng'}".
  + "content": Tin nhắn gửi khách hàng ngắn gọn, súc tích, nêu bật lợi ích và link đặt hàng nhanh.

Yêu cầu đầu ra: CHỈ trả về DUY NHẤT một chuỗi JSON hợp lệ không có giải thích thêm:
{
  "title": "Tiêu đề ngắn gọn của bài đăng đúng chủ đề",
  "hookText": "Câu hook thu hút bám sát chủ đề",
  "content": "Toàn văn nội dung bài viết hoặc kịch bản phân cảnh",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#dvdmultipet", "#thucungtot"],
  "targetUrl": "Đường link sản phẩm hoặc trang chủ thucungtot.net"
}
`;

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

        const rawText = response?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const targetUrl = selectedProduct
            ? `https://thucungtot.net/products/${selectedProduct.slug}`
            : (parsed.targetUrl || 'https://thucungtot.net');

          return NextResponse.json({
            success: true,
            source: 'gemini-ai',
            post: {
              platform,
              title: parsed.title || `Bài đăng ${platform.toUpperCase()}`,
              hookText: parsed.hookText || '',
              content: parsed.content || '',
              hashtags: parsed.hashtags || ['#dvdmultipet', '#thucungtot', '#chamsocthucung'],
              targetUrl
            }
          });
        }
      } catch (geminiError) {
        console.warn('Gemini generation error, falling back to smart template:', geminiError);
      }
    }

    // 2. Dynamic, Context-Aware Smart Template Fallback
    const fallbackPost = buildSmartFallback(platform, selectedProduct, topic);
    return NextResponse.json({
      success: true,
      source: 'smart-template',
      post: fallbackPost
    });
  } catch (error) {
    console.error('Error generating social post:', error);
    return NextResponse.json({ success: false, error: 'Lỗi tạo bài đăng truyền thông' }, { status: 500 });
  }
}
