import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, fileType, rawText } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Chưa tìm thấy Gemini API Key trong hệ thống. Vui lòng kiểm tra lại cấu hình .env.local.'
      }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
Bạn là chuyên gia phân tích tài liệu và số hóa dữ liệu báo giá sản phẩm cho chuỗi cửa hàng thú cưng DVDmultilPET.
Nhiệm vụ của bạn là đọc nội dung trong tài liệu (hình ảnh chụp bảng giá, trang catalog sản phẩm thức ăn chó mèo, phụ kiện, khay cát, sữa tắm, đồ chơi hoặc văn bản báo giá đính kèm).

Hãy đọc kỹ và trích xuất danh sách tất cả các sản phẩm có trong tài liệu này và chuẩn hóa thành một mảng JSON.
Mỗi sản phẩm gồm các trường:
- "name": string (Tên đầy đủ của sản phẩm, ví dụ: "Hạt Royal Canin Indoor 2kg", "Pate Monge Vị Vịt Tươi", "Máy Lọc Nước 2.5L", v.v.)
- "price": number (Giá bán thực tế dạng số nguyên, ví dụ: 385000, 120000. Nếu có nhiều mức giá đại lý/lẻ hãy lấy giá bán lẻ)
- "originalPrice": number | null (Giá gốc hoặc giá niêm yết trước giảm giá nếu có)
- "weight": string (Quy cách đóng gói, ví dụ: "2kg", "400g", "85g", "5L", "2.5L", "Cái", v.v.)
- "category": string (Chọn 1 trong các mã sau:
    "dry_kibble" (hạt khô),
    "wet_pate" (pate ướt, sốt),
    "dietary" (hạt trị liệu, sỏi, thận, dị ứng),
    "treats" (bánh thưởng, súp thưởng),
    "feeding_tools" (bát ăn, máy lọc nước, bình nước),
    "hygiene_litter" (cát vệ sinh, xẻng, khay vệ sinh),
    "toys_scratchers" (đồ chơi, trụ cào móng, cat tree),
    "grooming_health" (sữa tắm, dưỡng lông, kìm bấm móng),
    "accessories_collars" (vòng cổ, dây dắt, yếm, đệm)
  )
- "petType": "dog" | "cat" | "all" (Loài sử dụng phù hợp)
- "shortDesc": string (Mô tả công dụng hoặc đặc tính nổi bật)

CHÚ Ý QUAN TRỌNG:
- Chỉ trả về DUY NHẤT một mảng JSON hợp lệ theo định dạng: [ { ... }, { ... } ].
- Nếu không tìm thấy sản phẩm hoặc bảng giá nào trong tài liệu, trả về mảng rỗng: [].
- TUYỆT ĐỐI KHÔNG thêm bất kỳ lời giải thích nào khác ngoài chuỗi JSON!
`;

    let contents: any[] = [];

    if (fileData) {
      const cleanBase64 = fileData.replace(/^data:[^;]+;base64,/, '').trim();

      // Detect MIME type accurately
      let cleanMimeType = fileType || '';
      if (fileData.startsWith('data:application/pdf') || (fileType && fileType.includes('pdf')) || cleanBase64.startsWith('JVBERi0')) {
        cleanMimeType = 'application/pdf';
      } else if (fileData.startsWith('data:image/png') || cleanBase64.startsWith('iVBORw0KGgo')) {
        cleanMimeType = 'image/png';
      } else if (fileData.startsWith('data:image/webp')) {
        cleanMimeType = 'image/webp';
      } else if (fileData.startsWith('data:image/jpeg') || fileData.startsWith('data:image/jpg') || cleanBase64.startsWith('/9j/')) {
        cleanMimeType = 'image/jpeg';
      } else if (!cleanMimeType || cleanMimeType === 'application/octet-stream') {
        cleanMimeType = 'image/jpeg';
      }

      console.log(`[ScanCatalog] Processing file with detected MIME type: ${cleanMimeType}, size: ${cleanBase64.length} chars`);

      contents = [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: cleanMimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ];
    } else if (rawText && rawText.trim().length > 0) {
      contents = [
        {
          role: 'user',
          parts: [
            { text: `${promptText}\n\nNội dung văn bản báo giá cần trích xuất:\n${rawText}` }
          ]
        }
      ];
    } else {
      return NextResponse.json({
        success: false,
        error: 'Vui lòng cung cấp file ảnh/PDF hoặc nhập nội dung văn bản báo giá'
      }, { status: 400 });
    }

    // Call Gemini with candidate model fallback
    let response: any = null;
    let lastError: any = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        console.log(`[ScanCatalog] Trying model: ${model}`);
        response = await ai.models.generateContent({
          model,
          contents
        });

        if (response && response.text) {
          console.log(`[ScanCatalog] Successfully generated content using model: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[ScanCatalog] Model ${model} returned error: ${err.message?.slice(0, 120)}`);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      console.error('[ScanCatalog] All candidate models failed:', lastError);
      return NextResponse.json({
        success: false,
        error: `Máy chủ Google Gemini đang bận: ${lastError?.message?.slice(0, 150) || 'Vui lòng thử lại sau giây lát'}`
      }, { status: 502 });
    }

    const rawResponseText = response.text.trim();
    console.log('[ScanCatalog] Gemini Raw Output preview:', rawResponseText.slice(0, 250));

    // Parse JSON
    let parsedItems: any[] = [];

    // 1. Try array match [ ... ]
    const arrayMatch = rawResponseText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        const arr = JSON.parse(arrayMatch[0]);
        if (Array.isArray(arr)) {
          parsedItems = arr;
        }
      } catch (e) {
        console.warn('[ScanCatalog] Failed to parse array JSON:', e);
      }
    }

    // 2. Try object match { products: [ ... ] }
    if (parsedItems.length === 0) {
      const objMatch = rawResponseText.match(/\{[\s\S]*\}/);
      if (objMatch) {
        try {
          const obj = JSON.parse(objMatch[0]);
          if (Array.isArray(obj.products)) parsedItems = obj.products;
          else if (Array.isArray(obj.items)) parsedItems = obj.items;
          else if (Array.isArray(obj.data)) parsedItems = obj.data;
          else if (Array.isArray(obj.san_pham)) parsedItems = obj.san_pham;
          else if (Array.isArray(obj.danh_sach)) parsedItems = obj.danh_sach;
        } catch (e) {
          console.warn('[ScanCatalog] Failed to parse object JSON:', e);
        }
      }
    }

    // If Gemini extracted products successfully:
    if (parsedItems.length > 0) {
      const formattedItems = parsedItems.map((item: any, idx: number) => {
        const price = Number(item.price || item.gia || item.gia_ban) || 100000;
        const originalPrice = item.originalPrice || item.gia_goc ? Number(item.originalPrice || item.gia_goc) : undefined;
        return {
          tempId: `scanned-${Date.now()}-${idx}`,
          name: item.name || item.ten_san_pham || item.title || `Sản phẩm #${idx + 1}`,
          price,
          originalPrice,
          weight: item.weight || item.quy_cach || item.khoi_luong || '1kg',
          category: item.category || item.danh_muc || 'dry_kibble',
          petType: item.petType || item.loai_thu_cung || 'all',
          shortDesc: item.shortDesc || item.mo_ta || 'Sản phẩm trích xuất từ tài liệu báo giá.',
          selected: true
        };
      });

      return NextResponse.json({
        success: true,
        source: 'gemini-ai',
        items: formattedItems
      });
    }

    // If text mode was used and Gemini found nothing, try heuristic parser as backup
    if (rawText && rawText.trim().length > 0) {
      const lines = rawText.split('\n').filter((l: string) => l.trim().length > 0);
      const fallbackParsed = lines.slice(0, 20).map((line: string, idx: number) => {
        const priceMatch = line.match(/(\d{1,3}(?:[.,]\d{3})+|\d{4,7})/);
        const price = priceMatch ? Number(priceMatch[0].replace(/[.,]/g, '')) : 100000 + idx * 20000;
        const weightMatch = line.match(/(\d+(?:\.\d+)?\s*(?:kg|g|ml|l|tuýp|lon|bao))/i);
        const weight = weightMatch ? weightMatch[0] : '1kg';
        const cleanName = line.replace(/(\d{1,3}(?:[.,]\d{3})+|\d{4,7}).*/, '').replace(/[-–:|,]/g, ' ').trim();

        return {
          tempId: `scanned-${Date.now()}-${idx}`,
          name: cleanName || `Sản phẩm #${idx + 1}`,
          price,
          originalPrice: Math.round(price * 1.15),
          weight,
          category: 'dry_kibble',
          petType: 'all' as const,
          shortDesc: `Sản phẩm từ văn bản: ${line.slice(0, 50)}`,
          selected: true
        };
      });

      if (fallbackParsed.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'text-parser',
          items: fallbackParsed
        });
      }
    }

    // If image/PDF had no detectable products
    return NextResponse.json({
      success: false,
      error: 'AI đã đọc tài liệu/hình ảnh nhưng không nhận diện được tên sản phẩm hay bảng giá nào. Vui lòng kiểm tra lại: chụp ảnh rõ nét hơn, đủ sáng hoặc chuyển sang thẻ "Dán Văn Bản Báo Giá".'
    });

  } catch (error: any) {
    console.error('Unhandled error in scan-catalog:', error);
    return NextResponse.json({
      success: false,
      error: `Lỗi xử lý tài liệu: ${error?.message || 'Vui lòng thử lại'}`
    }, { status: 500 });
  }
}
