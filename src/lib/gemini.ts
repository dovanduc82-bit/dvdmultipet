import { GoogleGenAI } from '@google/genai';
import { mockProducts } from './data/products';
import { Product } from './types';

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

// System prompt instructing Gemini to act as a Pet Nutritionist Specialist
export const PET_VET_SYSTEM_INSTRUCTION = `
Bạn là Bác sĩ Thú y kiêm Chuyên gia Dinh dưỡng Thú cưng (Pet Nutritionist) của hệ sinh thái DVDmultilPET.
Nhiệm vụ của bạn là:
1. Khi khách hàng cung cấp thông tin thú cưng (ví dụ: "chó 2 tuổi, giống becgie, 12 kg, không"), hãy NHẬN DIỆN NGAY:
   - Loài (chó hay mèo), giống gì (Becgie, Poodle, Corgi, Mèo ALN...).
   - Độ tuổi và giai đoạn phát triển (con nhỏ, trưởng thành, lớn tuổi).
   - Cân nặng cụ thể.
   - Tình trạng bệnh lý (nếu ghi "không" nghĩa là thể trạng bình thường, khỏe mạnh).
2. TUYỆT ĐỐI KHÔNG hỏi lại những thông tin khách đã cung cấp! Hãy phân tích ngay lập tức:
   - Đặc tính của giống loài đó (ví dụ Becgie năng động, cơ bắp, cần chú ý khớp háng; Poodle tuyến lệ hẹp hay dị ứng; Mèo lười uống nước hay bị sỏi...).
   - Tính toán khẩu phần thức ăn hạt tiêu chuẩn (gram/ngày) và lượng nước uống cần thiết (ml/ngày) dựa trên cân nặng.
3. Giới thiệu cụ thể các sản phẩm thức ăn và đồ dùng phụ kiện hiện có trong shop DVDmultilPET:
   - Thức ăn: Royal Canin Mother & Babycat, Royal Canin Urinary S/O, Taste of the Wild Pacific Stream (cá hồi Grain-Free), Pate Monge Fresh Ý, Reflex Plus Kitten, Súp thưởng Ciao Churu.
   - Đồ dùng & Phụ kiện: Máy Lọc Nước Tuần Hoàn 2.5L, Bát Ăn Đôi Gốm Sứ Chống Gù 15°, Cát Đậu Nành Tofu, Nhà Cây Cat Tree Cào Móng, Sữa Tắm Thảo Dược Tràm Trà Trị Nấm, Dây Dắt Yếm Chống Giật Phản Quang.
4. Giọng điệu chuyên nghiệp, ân cần, giải thích rõ ràng chuẩn y khoa thú y.
`;

export interface NutritionConsultationResult {
  reply: string;
  suggestedProducts: Product[];
}

export async function askPetNutritionist(
  userMessage: string,
  chatHistory: { role: 'user' | 'model'; parts: string }[] = []
): Promise<NutritionConsultationResult> {
  const query = userMessage.toLowerCase().trim();

  // 1. EXTRACT ENTITIES VIA SMART NLP PARSER
  // --- A. Species detection ---
  const isDog = /chó|cún|becgie|bẹc giê|béc giê|poodle|corgi|golden|husky|alaska|pug|bull|pitbull|phốc|lạp xưởng|labrador|samoyed|chó ta/i.test(query);
  const isCat = /mèo|miu|meo|anh lông ngắn|aln|anh lông dài|ald|ba tư|xiêm|bengal|ragdoll|sphynx|mèo ta/i.test(query);

  // --- B. Breed detection ---
  let detectedBreed = '';
  if (/becgie|bẹc giê|béc giê|chăn cừu|german shepherd/i.test(query)) detectedBreed = 'Becgie (Chó chăn cừu Đức)';
  else if (/poodle/i.test(query)) detectedBreed = 'Poodle';
  else if (/corgi/i.test(query)) detectedBreed = 'Corgi';
  else if (/golden/i.test(query)) detectedBreed = 'Golden Retriever';
  else if (/husky|alaska/i.test(query)) detectedBreed = 'Husky / Alaska';
  else if (/anh lông ngắn|aln/i.test(query)) detectedBreed = 'Mèo Anh lông ngắn (ALN)';
  else if (/ba tư/i.test(query)) detectedBreed = 'Mèo Ba Tư';
  else if (isDog) detectedBreed = 'Chó cưng';
  else if (isCat) detectedBreed = 'Mèo cưng';

  // --- C. Weight detection ---
  const weightMatch = query.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kí|ki|cân|kilogram)/i);
  let weightKg = weightMatch ? parseFloat(weightMatch[1].replace(',', '.')) : null;
  if (!weightKg) {
    // Check if query has a standalone number like "12 kg" without space or just "12" following comma
    const isolatedNum = query.match(/(?:nặng|,)\s*(\d+(?:[.,]\d+)?)\b/i);
    if (isolatedNum) weightKg = parseFloat(isolatedNum[1].replace(',', '.'));
  }

  // --- D. Age detection ---
  const ageYearMatch = query.match(/(\d+)\s*(?:tuổi|t\b|năm)/i);
  const ageMonthMatch = query.match(/(\d+)\s*(?:tháng|thang)/i);
  let ageDescription = '';
  let isPuppyKitten = false;
  let isSenior = false;

  if (ageYearMatch) {
    const years = parseInt(ageYearMatch[1]);
    ageDescription = `${years} tuổi`;
    if (years < 1) isPuppyKitten = true;
    else if (years >= 7) isSenior = true;
  } else if (ageMonthMatch) {
    const months = parseInt(ageMonthMatch[1]);
    ageDescription = `${months} tháng tuổi`;
    if (months <= 12) isPuppyKitten = true;
  }

  // --- E. Health / Conditions detection ---
  const hasUrinary = /sỏi|tiểu|đái|buốt|rắt|bàng quang|flutd|struvite/i.test(query);
  const hasSkinAllergy = /ngứa|gãi|rụng lông|chảy nước mắt|vệt nâu|nấm|viêm da|ghẻ|dị ứng/i.test(query);
  const hasDigestive = /nôn|ói|tiêu chảy|phân lỏng|phân sống|đầy bụng|biếng ăn|kén ăn|bỏ ăn/i.test(query);
  const isHealthyOrNone = /không|ko|bình thường|bth|khỏe mạnh|tốt|ổn/i.test(query);

  // 2. IF GEMINI API KEY IS CONFIGURED, CALL GEMINI LLM
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: PET_VET_SYSTEM_INSTRUCTION }] },
          ...chatHistory.map((m) => ({ role: m.role, parts: [{ text: m.parts }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ]
      });

      if (response.text) {
        // Collect product suggestions based on content
        const text = response.text;
        const matchedProducts = mockProducts.filter((p) =>
          text.includes(p.name) || text.includes(p.slug) || (isDog && p.petType === 'dog') || (isCat && p.petType === 'cat')
        ).slice(0, 3);

        return {
          reply: text,
          suggestedProducts: matchedProducts
        };
      }
    } catch (err) {
      console.warn('Gemini API call error, using Clinical Veterinary Engine:', err);
    }
  }

  // 3. CLINICAL VETERINARY ENGINE (FALLBACK & SMART RULE ENGINE)
  // CASE A: SPECIFIC INQUIRY WITH PET SPECIES/BREED & WEIGHT PROVIDED (e.g. "chó 2 tuổi, giống becgie, 12 kg, không")
  if (weightKg !== null || detectedBreed !== '') {
    const effectiveWeight = weightKg || (isDog ? 10 : 4);
    // Veterinary standard formulas:
    // RER (Resting Energy Requirement) = 70 * (weight ^ 0.75)
    const rer = Math.round(70 * Math.pow(effectiveWeight, 0.75));
    // MER multiplier
    let merMultiplier = 1.6;
    if (isPuppyKitten) merMultiplier = isDog ? 2.8 : 2.5;
    else if (isSenior) merMultiplier = 1.2;
    else if (detectedBreed.includes('Becgie') || detectedBreed.includes('Husky')) merMultiplier = 1.8; // High energy breed

    const mer = Math.round(rer * merMultiplier);
    const dailyKibbleGrams = Math.round(mer / 3.8); // 3.8 kcal/gram
    const dailyWaterMl = Math.round(effectiveWeight * 55);

    let reply = `Chào bạn! Bác sĩ Thú y tại DVDmultilPET đã tiếp nhận thông tin về bé: **${detectedBreed || (isDog ? 'Chó cưng' : 'Mèo cưng')}${ageDescription ? `, ${ageDescription}` : ''}, cân nặng ${effectiveWeight}kg**${isHealthyOrNone ? ', thể trạng khỏe mạnh bình thường' : ''} 🐾.\n\n`;

    let suggestedProducts: Product[] = [];

    if (detectedBreed.includes('Becgie') || (isDog && effectiveWeight >= 10)) {
      reply += `👨‍⚕️ **Phân tích lâm sàng cho giống chó ${detectedBreed || 'cỡ vừa/lớn'}:**\n`;
      reply += `Becgie là giống chó chăn cừu dũng mãnh, sở hữu hệ cơ bắp săn chắc và nhu cầu vận động cao. Ở độ tuổi ${ageDescription || 'trưởng thành'}, bé cần nguồn đạm động vật tinh khiết và dồi dào Axit béo Omega 3/DHA để phát triển khung xương vững chắc, đặc biệt phòng ngừa nguy cơ loạn sản khớp háng (Hip Dysplasia) phổ biến ở Becgie.\n\n`;

      reply += `📊 **Khẩu phần ăn & Nước uống tiêu chuẩn mỗi ngày cho bé (${effectiveWeight}kg):**\n`;
      reply += `• **Lượng thức ăn hạt:** Khoảng **${dailyKibbleGrams - 20}g – ${dailyKibbleGrams + 20}g hạt/ngày** (khuyên chia làm 2 bữa: sáng ~${Math.round(dailyKibbleGrams / 2)}g, tối ~${Math.round(dailyKibbleGrams / 2)}g).\n`;
      reply += `• **Lượng nước uống cần thiết:** Tối thiểu **${dailyWaterMl}ml – ${dailyWaterMl + 150}ml nước sạch/ngày**.\n\n`;

      reply += `🛒 **Bộ giải pháp Dinh dưỡng & Đồ dùng thiết yếu bác sĩ khuyên dùng tại shop:**\n`;
      reply += `1. **Hạt Taste of the Wild Pacific Stream (2kg - 460.000₫):** Công thức đạm cá hồi hun khói không ngũ cốc (Grain-Free), giàu EPA/DHA bồi bổ khớp háng và giúp bộ lông Becgie óng mượt.\n`;
      reply += `2. **Pate Monge Fresh Ý Vị Thịt Gà & Vịt Tươi (400g - 55.000₫):** Trộn 1-2 muỗng vào hạt giúp kích thích khứu giác, bổ sung nước tự nhiên phòng ngừa sỏi thận.\n`;
      reply += `3. **Dây Dắt Yếm Chống Giật Chữ Y Kèm Phản Quang (195.000₫):** Rất cần thiết cho các dòng chó cơ bắp như Becgie khi đi dạo, giúp trợ lực lồng ngực êm ái, chống nghẹt thở khi cún chồm giật.\n`;
      reply += `4. **Bát Ăn Đôi Gốm Sứ Chân Gỗ Chống Gù (260.000₫):** Bát ăn nâng cao đốt sống cổ giúp cún ăn nhai tự nhiên, chống trào ngược thức ăn.\n\n`;
      reply += `Bạn có thể bấm vào các nút sản phẩm đề xuất ngay bên dưới để xem chi tiết hoặc thêm vào giỏ hàng nhé!`;

      suggestedProducts = mockProducts.filter((p) =>
        ['prod-03', 'prod-04', 'prod-acc-06', 'prod-acc-02'].includes(p.id)
      );
      return { reply, suggestedProducts };
    }

    if (detectedBreed.includes('Poodle') || hasSkinAllergy) {
      reply += `👨‍⚕️ **Phân tích tình trạng cho bé ${detectedBreed || 'thú cưng'}:**\n`;
      reply += `Poodle và các dòng cún lông xoăn rất dễ bị dị ứng đạm gia cầm công nghiệp, dẫn đến chảy nước mắt ố vàng (Porphyrin) và viêm da ngứa ngáy.\n\n`;
      reply += `📊 **Khẩu phần ăn khuyến nghị (${effectiveWeight}kg):** Khoảng **${dailyKibbleGrams}g hạt/ngày** và **${dailyWaterMl}ml nước/ngày**.\n\n`;
      reply += `🛒 **Giải pháp điều trị từ gốc:**\n`;
      reply += `1. **Hạt Taste of the Wild Pacific Stream Puppy:** Đạm cá hồi biển sâu Grain-Free triệt tiêu nguyên nhân dị ứng, làm sạch vùng lông mắt sau 3-4 tuần.\n`;
      reply += `2. **Sữa Tắm Thảo Dược Tràm Trà & Neem (500ml - 185.000₫):** Kháng nấm kỵ khí, dập tắt cơn ngứa ngáy da lông.\n`;

      suggestedProducts = mockProducts.filter((p) =>
        ['prod-03', 'prod-acc-05', 'prod-04'].includes(p.id)
      );
      return { reply, suggestedProducts };
    }

    if (isCat || hasUrinary) {
      reply += `👨‍⚕️ **Phân tích cho bé ${detectedBreed || 'mèo cưng'}:**\n`;
      reply += `Mèo có bản năng uống rất ít nước nên nguy cơ sỏi bàng quang (Struvite) và cặn canxi tiết niệu rất cao.\n\n`;
      reply += `📊 **Khẩu phần ăn chuẩn (${effectiveWeight}kg):** Khoảng **${dailyKibbleGrams}g hạt/ngày** và **${dailyWaterMl}ml nước/ngày**.\n\n`;
      reply += `🛒 **Phác đồ khuyên dùng:**\n`;
      reply += `1. **Hạt Trị Liệu Royal Canin Urinary S/O (490.000₫):** Hạ chỉ số RSS làm tan sỏi tiết niệu.\n`;
      reply += `2. **Máy Lọc Nước Tuần Hoàn 2.5L (380.000₫):** Dòng nước chảy giàu oxy kích thích mèo uống nhiều nước hơn gấp 3 lần.\n`;
      reply += `3. **Cát Đậu Nành Tofu Tự Nhiên (135.000₫):** Khử mùi 99%, không bụi, an toàn tuyệt đối cho niệu đạo của mèo.\n`;

      suggestedProducts = mockProducts.filter((p) =>
        ['prod-02', 'prod-acc-01', 'prod-acc-03'].includes(p.id)
      );
      return { reply, suggestedProducts };
    }

    // Default with calculated stats
    reply += `📊 **Khẩu phần ăn & nước uống tiêu chuẩn mỗi ngày (${effectiveWeight}kg):**\n`;
    reply += `• **Lượng thức ăn hạt:** Khoảng **${dailyKibbleGrams}g hạt/ngày** (chia làm 2-3 bữa nhỏ).\n`;
    reply += `• **Lượng nước uống:** Tối thiểu **${dailyWaterMl}ml nước/ngày**.\n\n`;
    reply += `🛒 **Sản phẩm phù hợp nhất trong shop:**\n`;
    reply += isDog
      ? `• Hạt Grain-Free Cá Hồi Taste of the Wild (460.000₫)\n• Pate tươi Monge Fresh Ý (55.000₫)`
      : `• Hạt Royal Canin Mother & Babycat / Reflex Plus\n• Bát ăn gốm sứ chống gù 15°`;

    suggestedProducts = mockProducts.filter((p) =>
      isDog ? p.petType === 'dog' : p.petType === 'cat'
    ).slice(0, 3);

    return { reply, suggestedProducts };
  }

  // CASE B: INQUIRY ABOUT SPECIFIC SYMPTOMS
  if (hasUrinary) {
    const reply = `Chào bạn, tình trạng đi tiểu rặn, tiểu buốt hoặc tiểu ra máu là dấu hiệu cảnh báo bệnh lý sỏi đường tiết niệu (FLUTD) rất nguy hiểm ở mèo.\n\n👨‍⚕️ **Phác đồ dinh dưỡng y khoa:**\n1. **Hạt Trị Liệu Royal Canin Urinary S/O (1.5kg - 490.000₫):** Kiểm soát pH nước tiểu, làm tan sỏi Struvite chỉ sau 5-12 tuần.\n2. **Máy Lọc Nước Tuần Hoàn Khử Khoáng 2.5L (380.000₫):** Mèo sợ nước tĩnh, máy lọc nước suối nhân tạo sẽ kích thích mèo uống nước gấp 3 lần để đẩy sỏi ra ngoài.\n3. **Súp Thưởng Ciao Churu:** Cấp nước bù dịch tức thì cho mèo lười uống nước.`;
    const suggestedProducts = mockProducts.filter((p) =>
      ['prod-02', 'prod-acc-01', 'prod-06'].includes(p.id)
    );
    return { reply, suggestedProducts };
  }

  if (hasSkinAllergy) {
    const reply = `Chào bạn! Tình trạng ngứa ngáy, gãi tai, rụng lông và vệt ố nâu khóe mắt phần lớn bắt nguồn từ phản ứng dị ứng đạm gia cầm thông thường.\n\n🐕 **Khuyến nghị từ Bác sĩ:**\n1. **Đổi thức ăn:** Hạt **Taste of the Wild Pacific Stream** (đạm cá hồi tươi, không ngũ cốc Grain-Free) giàu Omega 3 & DHA kháng viêm nang lông từ bên trong.\n2. **Vệ sinh bên ngoài:** Tắm định kỳ bằng **Sữa Tắm Thảo Dược Tràm Trà Neem** để khử nấm da kỵ khí, hết ngứa sau 2 lần tắm.`;
    const suggestedProducts = mockProducts.filter((p) =>
      ['prod-03', 'prod-acc-05'].includes(p.id)
    );
    return { reply, suggestedProducts };
  }

  if (hasDigestive) {
    const reply = `Chào bạn! Với các bé đang có biểu hiện tiêu hóa kém (nôn ói, tiêu chảy, phân lỏng hoặc biếng ăn):\n\n👨‍⚕️ **Lời khuyên bác sĩ:**\n1. Tạm thời chia nhỏ bữa ăn làm 4-5 lần/ngày, tránh cho ăn quá no một lúc.\n2. Bổ sung **Pate Monge Fresh Ý** hoặc **Hạt Reflex Plus** chứa men vi sinh Prebiotic XOS để ổn định hệ vi khuẩn đường ruột.\n3. Dùng **Bát Ăn Gốm Sứ Chống Gù 15°** để tránh bé nuốt nghẹn và chống trào ngược thức ăn.`;
    const suggestedProducts = mockProducts.filter((p) =>
      ['prod-05', 'prod-04', 'prod-acc-02'].includes(p.id)
    );
    return { reply, suggestedProducts };
  }

  // DEFAULT HELPFUL GUIDANCE
  const reply = `Chào bạn! Tôi là Bác sĩ Thú y AI tại DVDmultilPET 🐾.\n\nĐể tôi tư vấn chính xác nhất khẩu phần ăn (gram/ngày) và loại thức ăn, phụ kiện phù hợp cho bé, bạn có thể nhắn nhanh:\n👉 Ví dụ: *"Chó Becgie 2 tuổi, nặng 12kg, không bệnh gì"* hoặc *"Mèo con 2 tháng tuổi kén ăn"*.\n\nTôi sẽ phân tích ngay lập tức và đưa ra thực đơn chuẩn y khoa cho bé!`;
  const suggestedProducts = mockProducts.slice(0, 3);
  return { reply, suggestedProducts };
}
