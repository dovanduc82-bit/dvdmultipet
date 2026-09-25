import { Product } from '../types';

export const mockProducts: Product[] = [
  // --- NHÓM 1: THỨC ĂN DINH DƯỠNG ---
  {
    id: 'prod-01',
    sku: 'RC-MBC-2KG',
    name: 'Hạt Royal Canin Mother & Babycat (Mèo Mẹ & Mèo Con 1-4 Tháng)',
    slug: 'royal-canin-mother-babycat-2kg',
    petType: 'cat',
    category: 'dry_kibble',
    lifeStage: 'puppy_kitten',
    price: 385000,
    originalPrice: 420000,
    weight: '2kg',
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Dinh dưỡng chuyển tiếp hoàn hảo cho mèo con cai sữa và hỗ trợ đề kháng tự nhiên cho mèo mẹ mang thai.',
    ingredients: [
      'Protein gia cầm sấy khô',
      'Mỡ động vật',
      'Gạo lứt',
      'Men vi sinh củng cố tiêu hóa FOS & MOS',
      'Dầu cá giàu Omega 3 & DHA',
      'Chất chống oxy hóa tự nhiên'
    ],
    nutritionAnalysis: {
      protein: '34.0%',
      fat: '25.0%',
      fiber: '1.9%',
      moisture: '5.5%',
      calorieDensity: '4422 kcal/kg'
    },
    benefits: [
      'Hạt siêu nhỏ, xốp dễ ngâm nước ấm thành cháo cho mèo con tập ăn dặm',
      'DHA hỗ trợ phát triển não bộ và thị lực trong giai đoạn vàng',
      'Tổ hợp chất chống oxy hóa đã được cấp bằng sáng chế giúp tăng miễn dịch'
    ],
    usageGuide: 'Cho ăn tự do hoặc chia 4-5 bữa nhỏ/ngày. Có thể ngâm mềm với sữa dinh dưỡng Bio-Milk hoặc nước ấm.'
  },
  {
    id: 'prod-02',
    sku: 'RC-URI-1.5KG',
    name: 'Hạt Trị Liệu Tiết Niệu Mèo Royal Canin Urinary S/O',
    slug: 'royal-canin-urinary-so-1.5kg',
    petType: 'cat',
    category: 'dietary',
    lifeStage: 'adult',
    price: 490000,
    originalPrice: 530000,
    weight: '1.5kg',
    rating: 4.9,
    reviewCount: 98,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Công thức thú y chuyên biệt làm tan sỏi Struvite và ngăn ngừa tái phát sỏi Canxi Oxalate bàng quang.',
    ingredients: [
      'Gạo',
      'Gluten lúa mì',
      'Thịt gia cầm khử nước',
      'Bột ngô',
      'Khoáng chất kiểm soát RSS',
      'Dầu đậu nành và tinh dầu cúc vạn thọ'
    ],
    nutritionAnalysis: {
      protein: '34.5%',
      fat: '15.0%',
      fiber: '2.8%',
      moisture: '5.5%',
      calorieDensity: '3872 kcal/kg'
    },
    benefits: [
      'Chỉ số RSS thấp giúp giảm nồng độ ion tạo sỏi trong nước tiểu',
      'Làm tan nhanh sỏi Struvite tinh thể chỉ sau 5-12 tuần điều trị',
      'Pha loãng nước tiểu tự nhiên, kích thích mèo đi tiểu đều đặn'
    ],
    usageGuide: 'Sử dụng theo chỉ định của bác sĩ thú y. Không dùng cho mèo mang thai, đang cho con bú hoặc suy thận mãn tính.'
  },
  {
    id: 'prod-03',
    sku: 'TOW-PUP-2KG',
    name: 'Hạt Cho Cún Con Taste of the Wild Pacific Stream Puppy (Đạm Cá Hồi)',
    slug: 'taste-of-the-wild-pacific-stream-puppy-2kg',
    petType: 'dog',
    category: 'dry_kibble',
    lifeStage: 'puppy_kitten',
    price: 460000,
    originalPrice: 495000,
    weight: '2kg',
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Công thức Grain-Free (không ngũ cốc) từ cá hồi biển sâu, lý tưởng cho cún dễ bị dị ứng da và ngứa lông.',
    ingredients: [
      'Cá hồi tươi hun khói',
      'Bột cá biển',
      'Khoai lang & khoai tây',
      'Dầu hạt cải',
      'Quả mọng việt quất & mâm xôi',
      'Lợi khuẩn đường ruột K9 Strain Probiotics'
    ],
    nutritionAnalysis: {
      protein: '27.0%',
      fat: '15.0%',
      fiber: '5.0%',
      moisture: '10.0%',
      calorieDensity: '3600 kcal/kg'
    },
    benefits: [
      'Không chứa ngô, lúa mì hay phụ gia nhân tạo — an toàn tuyệt đối cho hệ tiêu hóa non nớt',
      'DHA tự nhiên từ dầu cá hồi giúp cún thông minh, tiếp thu nhanh các bài huấn luyện',
      'Omega 3 & 6 làm mượt lông, giảm hẳn vệt ố đỏ khóe mắt ở Poodle, Pomeranian'
    ],
    usageGuide: 'Chia làm 3 bữa/ngày theo bảng khuyến nghị cân nặng. Luôn chuẩn bị sẵn nước sạch.'
  },
  {
    id: 'prod-04',
    sku: 'MONGE-PATE-DOG',
    name: 'Pate Monge Fresh Cho Chó Vị Thịt Gà & Vịt Tươi (Hộp 400g)',
    slug: 'pate-monge-fresh-cho-thit-ga-vit-400g',
    petType: 'dog',
    category: 'wet_pate',
    lifeStage: 'all',
    price: 55000,
    originalPrice: 65000,
    weight: '400g',
    rating: 5.0,
    reviewCount: 110,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Pate tươi mềm nhập khẩu nguyên hộp từ Ý với từng miếng thịt thật ninh chậm, kích thích cún biếng ăn.',
    ingredients: [
      'Thịt tươi 80% (Gà 10%, Vịt 10%)',
      'Khoáng chất thiết yếu',
      'Vitamin A, D3, E',
      'Nước cốt thịt tự nhiên ninh chậm'
    ],
    nutritionAnalysis: {
      protein: '9.0%',
      fat: '7.0%',
      fiber: '0.5%',
      moisture: '82.0%'
    },
    benefits: [
      'Không chứa gluten, không phẩm màu, không chất bảo quản hóa học',
      'Cung cấp lượng nước tự nhiên dồi dào, phòng ngừa sỏi thận hiệu quả',
      'Có thể trộn cùng hạt khô để tăng độ thèm ăn cho cún kén ăn'
    ],
    usageGuide: 'Cho ăn trực tiếp ở nhiệt độ phòng. Sau khi mở nắp, bảo quản trong ngăn mát tủ lạnh tối đa 48 giờ.'
  },
  {
    id: 'prod-05',
    sku: 'REFLEX-KIT-2KG',
    name: 'Hạt Reflex Plus Cho Mèo Con Vị Gà (Reflex Plus Kitten 2kg)',
    slug: 'reflex-plus-cho-meo-con-vi-ga-2kg',
    petType: 'cat',
    category: 'dry_kibble',
    lifeStage: 'puppy_kitten',
    price: 240000,
    originalPrice: 270000,
    weight: '2kg',
    rating: 4.7,
    reviewCount: 65,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Dòng hạt cao cấp nhập khẩu Thổ Nhĩ Kỳ chứa men Xylo-oligosaccharides (XOS) bảo vệ đường ruột tối ưu.',
    ingredients: [
      'Thịt gà thủy phân',
      'Gạo, mỡ gà',
      'Hạt lanh giàu Omega',
      'Chiết xuất cây Yucca Schidigera (giảm mùi hôi phân)',
      'Prebiotic XOS'
    ],
    nutritionAnalysis: {
      protein: '36.0%',
      fat: '18.0%',
      fiber: '2.0%',
      moisture: '7.0%',
      calorieDensity: '4120 kcal/kg'
    },
    benefits: [
      'XOS hỗ trợ hệ vi sinh đường ruột khỏe mạnh, giảm tiêu chảy khi đổi thức ăn',
      'Chiết xuất Yucca giúp khay cát vệ sinh giảm đến 60% mùi hôi',
      'Hàm lượng đạm cao 36% giúp bé tăng cân chuẩn khung xương'
    ],
    usageGuide: 'Dành cho mèo con từ 2 đến 12 tháng tuổi.'
  },
  {
    id: 'prod-06',
    sku: 'CIAO-TREAT-50P',
    name: 'Bánh Thưởng Súp Thưởng Ciao Churu Cho Mèo (Túi 50 Tuýp Tiết Kiệm)',
    slug: 'sup-thuong-ciao-churu-cho-meo-50-tuyp',
    petType: 'cat',
    category: 'treats',
    lifeStage: 'all',
    price: 320000,
    originalPrice: 360000,
    weight: '700g (50 tuýp)',
    rating: 5.0,
    reviewCount: 230,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Món ăn vặt thơm ngon số 1 Nhật Bản, bí quyết gắn kết tình cảm với boss và cấp nước bù dịch.',
    ingredients: [
      'Cá ngừ Maguro tươi',
      'Thịt gà rút xương',
      'Chiết xuất trà xanh chống oxy hóa và giảm mùi hôi miệng',
      'Collagen & Vitamin E'
    ],
    nutritionAnalysis: {
      protein: '7.0%',
      fat: '0.2%',
      fiber: '0.1%',
      moisture: '91.0%'
    },
    benefits: [
      'Mùi vị cực kỳ kích thích, bất kỳ bé mèo khó tính nào cũng yêu thích',
      'Độ ẩm cao 91% giúp bổ sung nước cho các bé mèo lười uống nước',
      'Rất tiện lợi khi cần tán thuốc trộn vào để cho mèo uống'
    ],
    usageGuide: 'Cho ăn 2-4 tuýp mỗi ngày như bữa phụ hoặc phần thưởng huấn luyện.'
  },

  // --- NHÓM 2: PHỤ KIỆN & ĐỒ DÙNG THIẾT YẾU CHO THÚ CƯNG ---
  {
    id: 'prod-acc-01',
    sku: 'FOUNT-ION-2.5L',
    name: 'Máy Lọc Nước Tuần Hoàn Khử Khoáng Thông Minh 2.5L Cho Chó Mèo',
    slug: 'may-loc-nuoc-tuan-hoan-khu-khoang-2-5l',
    petType: 'all',
    category: 'feeding_tools',
    lifeStage: 'all',
    price: 380000,
    originalPrice: 450000,
    weight: '0.9kg',
    rating: 4.9,
    reviewCount: 88,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Dòng nước chảy liên tục mô phỏng suối tự nhiên, lõi lọc 4 lớp than hoạt tính & hạt trao đổi ion chống sỏi thận tuyệt đối.',
    specifications: {
      material: 'Nhựa ABS nguyên sinh chuẩn an toàn thực phẩm FDA & Inox 304',
      capacity: 'Dung tích 2.5 Lít (Đủ cho mèo uống 7-10 ngày)',
      origin: 'Công nghệ tuần hoàn siêu êm dưới 20dB'
    },
    benefits: [
      'Kích thích thú cưng uống nước gấp 3 lần bình nước tĩnh thông thường',
      'Loại bỏ cặn canxi, kim loại nặng và lông rụng trôi nổi trong nước',
      'Động cơ không chổi than tiết kiệm điện, chạy êm ru không gây ồn ban đêm'
    ],
    usageGuide: 'Thay lõi lọc định kỳ sau 30-45 ngày. Vệ sinh khay chứa nước mỗi tuần 1 lần.'
  },
  {
    id: 'prod-acc-02',
    sku: 'BOWL-CERAMIC-WOOD',
    name: 'Bát Ăn Đôi Gốm Sứ Chân Gỗ Sồi Công Thái Học Chống Gù & Trào Ngược',
    slug: 'bat-an-doi-gom-su-chan-go-soi-chong-gu',
    petType: 'all',
    category: 'feeding_tools',
    lifeStage: 'all',
    price: 260000,
    originalPrice: 320000,
    weight: '1.2kg',
    rating: 4.8,
    reviewCount: 54,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Góc nghiêng 15 độ nâng cao đốt sống cổ, gốm sứ tráng men cao cấp không gây đen cằm mụn bọc ở mèo.',
    specifications: {
      material: 'Gốm sứ tráng men nung 1280°C + Khung gỗ sồi chống ẩm',
      dimensions: '31cm x 15cm x 12cm',
      capacity: '2 bát x 400ml'
    },
    benefits: [
      'Góc nghiêng 15° bảo vệ cột sống cổ và giảm hẳn chứng trào ngược nôn hạt sau khi ăn',
      'Chất liệu gốm kháng khuẩn dễ rửa sạch, phòng ngừa 100% tình trạng nổi mụn cằm đen ở mèo',
      'Khung gỗ đầm chắc chống trơn trượt, thú cưng ăn không bị xô đẩy đổ thức ăn ra sàn'
    ],
    usageGuide: 'Có thể tháo rời từng bát để quay trong lò vi sóng hoặc rửa bằng máy rửa bát.'
  },
  {
    id: 'prod-acc-03',
    sku: 'LITTER-TOFU-6L',
    name: 'Cát Vệ Sinh Đậu Nành Tofu Hữu Cơ Khử Mùi 99% (Xả Bồn Cầu Tiện Lợi)',
    slug: 'cat-ve-sinh-dau-nanh-tofu-khu-mui-6l',
    petType: 'cat',
    category: 'hygiene_litter',
    lifeStage: 'all',
    price: 135000,
    originalPrice: 160000,
    weight: '2.5kg (6 Lít)',
    rating: 5.0,
    reviewCount: 195,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Sản xuất 100% từ bã đậu nành thực phẩm, không bụi 99.9%, an toàn cho đường hô hấp của mèo và người nuôi.',
    specifications: {
      material: 'Đậu nành hữu cơ & Tinh bột ngô tự nhiên',
      capacity: 'Bao hút chân không 6 Lít',
      origin: 'Hương trà xanh / Hương sữa thơm dịu'
    },
    benefits: [
      'Vón cục siêu nhanh trong 3 giây, khóa chặt mùi amoniac nước tiểu',
      'Có thể đổ trực tiếp vào bồn cầu xả nước mà không lo tắc cống',
      'Hạt ép tròn không bám kẽ chân mèo, không văng vãi bẩn sàn nhà'
    ],
    usageGuide: 'Đổ cát vào khay với độ dày khoảng 5-7cm. Xúc bỏ chất thải hàng ngày.'
  },
  {
    id: 'prod-acc-04',
    sku: 'CAT-TREE-SISAL',
    name: 'Nhà Cây Cat Tree 3 Tầng Kèm Trụ Cào Móng Dây Thừng Sisal Tự Nhiên',
    slug: 'nha-cay-cat-tree-3-tang-tru-cao-mong',
    petType: 'cat',
    category: 'toys_scratchers',
    lifeStage: 'all',
    price: 520000,
    originalPrice: 650000,
    weight: '4.5kg',
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Khu vui chơi liên hoàn giúp mèo giải tỏa căng thẳng, mài móng tự nhiên và bảo vệ bộ ghế sofa đắt tiền của bạn.',
    specifications: {
      material: 'Gỗ ván ép bọc nỉ lông cừu mềm mại + Dây thừng sợi gai Sisal tự nhiên',
      dimensions: 'Cao 85cm x Đế 45cm x 45cm',
      origin: 'Kết cấu vững chắc chịu tải cho mèo tới 8kg'
    },
    benefits: [
      'Thỏa mãn bản năng cào móng và leo trèo tầm cao của loài mèo',
      'Trang bị bóng bông treo lắc lư kích thích phản xạ săn mồi và vận động tránh béo phì',
      'Chất liệu dây đay sisal bền bỉ không bung sợi độc hại'
    ],
    usageGuide: 'Đặt ở góc phòng khách hoặc cạnh cửa sổ nơi mèo thích nằm sưởi nắng.'
  },
  {
    id: 'prod-acc-05',
    sku: 'SHAMPOO-HERB-500ML',
    name: 'Sữa Tắm Thảo Dược Trị Nấm & Viêm Da Khử Mùi Hôi Cho Chó Mèo 500ml',
    slug: 'sua-tam-thao-duoc-tri-nam-viem-da-cho-meo',
    petType: 'all',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 185000,
    originalPrice: 220000,
    weight: '500ml',
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Chiết xuất tràm trà, neem và dầu dừa dưỡng ẩm, diệt khuẩn kỵ khí và khử sạch mùi hôi hôi tuyến bã nhờn suốt 7 ngày.',
    specifications: {
      material: 'Chiết xuất tinh dầu Tràm Trà Úc, Tinh dầu Neem & Vitamin E',
      capacity: 'Chai vòi nhấn tiện dụng 500ml',
      origin: 'Độ pH 6.5 trung tính tương thích da chó mèo'
    },
    benefits: [
      'Kháng nấm da Microsporum và giảm ngứa gãi tức thì sau 2 lần tắm',
      'Làm mềm mượt lông, phục hồi nang lông bị xơ rối rụng trọc do gãi ngứa',
      'Hương thảo mộc thiên nhiên lưu hương nhẹ nhàng, không gây cay mắt bé'
    ],
    usageGuide: 'Làm ướt lông, thoa đều dầu tắm massage trong 5-7 phút để dược chất thẩm thấu rồi xả sạch với nước.'
  },
  {
    id: 'prod-acc-06',
    sku: 'HARNESS-REFLECT-LED',
    name: 'Dây Dắt Yếm Chống Giật Siêu Êm Kèm Dải Phản Quang An Toàn Ban Đêm Cho Cún',
    slug: 'day-dat-yem-chong-giat-phan-quang-cho-cun',
    petType: 'dog',
    category: 'accessories_collars',
    lifeStage: 'all',
    price: 195000,
    originalPrice: 240000,
    weight: '300g',
    rating: 4.9,
    reviewCount: 63,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Thiết kế chữ Y phân bổ lực đều ngực không thắt nghẹt khí quản khi cún chồm giật, dải phản quang phát sáng khi có đèn pha.',
    specifications: {
      material: 'Vải lưới Oxford thoáng khí 3 lớp + Khóa bấm kim loại hợp kim kẽm',
      dimensions: 'Tùy chỉnh size vòng ngực từ 35cm đến 65cm (phù hợp cún 3kg - 18kg)'
    },
    benefits: [
      'Phân bổ lực kéo vào xương ức ngực, triệt tiêu nguy cơ tổn thương sụn thanh quản ở cún con',
      'Lớp đệm xốp êm ái chống cọ xát rụng lông vùng nách',
      'Dải phản quang 3M siêu sáng bảo vệ thú cưng an toàn tuyệt đối khi đi dạo buổi tối'
    ],
    usageGuide: 'Điều chỉnh 4 khóa dây để cách ngực cún vừa vặn 2 ngón tay.'
  },
  // --- NHÓM 4: DƯỢC THÚ Y & ĐẶC TRỊ CHÍNH HÃNG FIVEVET ---
  {
    id: 'prod-477745',
    sku: 'FIVE-AXO-68MG',
    name: 'Viên nhai diệt ve rận Five Axolaner 68mg (Cho chó từ 10-25kg)',
    slug: 'vien-nhai-diet-ve-ran-five-axolaner-68mg-cho-cho-tu-10-25kg-prod-477745',
    petType: 'dog',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 100000,
    originalPrice: 120000,
    weight: '1 viên nhai',
    rating: 5.0,
    reviewCount: 48,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Viên nhai vị thịt thơm ngon điều trị và phòng ngừa nhiễm ve, bọ chét, ghẻ Demodex, ghẻ Sarcoptes trong 24h, bảo vệ liên tục 30 ngày cho chó từ 10-25kg.',
    benefits: [
      'Tiêu diệt 100% ve rận và bọ chét ký sinh chỉ sau một lần nhai',
      'Đặc trị ghẻ Demodex, Sarcoptes và viêm tai do ve rận ký sinh',
      'Viên nén hương thịt bò thơm ngon, chó tự ăn hào hứng như bánh thưởng',
      'Bảo vệ liên tục suốt 30 ngày, an toàn cho chó từ 8 tuần tuổi'
    ],
    usageGuide: 'Cho chó nhai trực tiếp hoặc trộn vào thức ăn. Liều lượng 1 viên duy nhất cho chó từ 10 - 25kg.'
  },
  {
    id: 'prod-477744',
    sku: 'FIVE-AXO-28.3MG',
    name: 'Viên nhai diệt ve rận Five Axolaner 28,3mg (Cho chó từ 4-10kg)',
    slug: 'vien-nhai-diet-ve-ran-five-axolaner-28-3mg-cho-cho-tu-4-10kg-prod-477744',
    petType: 'dog',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 100000,
    originalPrice: 120000,
    weight: '1 viên nhai',
    rating: 5.0,
    reviewCount: 36,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Viên nhai vị thịt diệt ve rận, bọ chét, ghẻ Demodex, ghẻ Sarcoptes chuyên biệt cho chó nhỏ từ 4-10kg.',
    benefits: [
      'Tiêu diệt ve rận nhanh chóng trong 8-12 tiếng',
      'Đặc trị ghẻ Demodex và Sarcoptes gây rụng lông, ngứa rát',
      'Dễ ăn, hấp thu nhanh, hiệu quả kéo dài 30 ngày'
    ],
    usageGuide: 'Cho chó nhai trực tiếp hoặc trộn vào thức ăn. Liều lượng 1 viên cho chó từ 4 - 10kg.'
  },
  {
    id: 'prod-477743',
    sku: 'FIVE-AXO-11.3MG',
    name: 'Viên nhai diệt ve rận Five Axolaner 11,3mg (Cho chó từ 2-4kg)',
    slug: 'vien-nhai-diet-ve-ran-five-axolaner-11-3mg-cho-cho-tu-2-4kg-prod-477743',
    petType: 'dog',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 100000,
    originalPrice: 120000,
    weight: '1 viên nhai',
    rating: 5.0,
    reviewCount: 52,
    inStock: true,
    featured: true,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Viên nhai vị thịt cho dòng chó mi ni, cún nhỏ từ 2-4kg giúp tiêu diệt tận gốc ve rận và bọ chét.',
    benefits: [
      'Kích thước nhỏ gọn, vị thịt thơm ngon cún nhỏ ăn dễ dàng',
      'Loại bỏ sạch ve rận, bọ chét, chống tái nhiễm suốt 1 tháng',
      'An toàn tuyệt đối cho cún nhỏ từ 8 tuần tuổi'
    ],
    usageGuide: 'Cho cún ăn trực tiếp hoặc tán nhỏ trộn cháo/pate. Liều 1 viên cho cún từ 2 - 4kg.'
  },
  {
    id: 'prod-519397',
    sku: 'FIVE-BUTOMEC-20ML',
    name: 'Thuốc Trị Ve, Bọ Chét, Bọ Mạt Five Butomec',
    slug: 'thuoc-tri-ve-bo-chet-bo-mat-five-butomec-prod-519397',
    petType: 'all',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 200000,
    originalPrice: 240000,
    weight: 'Chai 20ml',
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Dung dịch nhỏ gáy và phun xịt phòng ngừa, tiêu diệt ve, chấy rận, bọ chét, mạt cho chó, mèo, gà đá và chim cảnh.',
    benefits: [
      'Phổ tác động rộng, diệt nhanh ve rận và bọ chét bám trên da lông',
      'Hiệu quả cao, an toàn cho cả chó mèo và gia cầm cảnh',
      'Dễ sử dụng, tác dụng kéo dài chống tái nhiễm'
    ],
    usageGuide: 'Nhỏ dọc sống lưng hoặc pha loãng phun xịt chuồng trại, khu vực nằm của thú cưng theo hướng dẫn.'
  },
  {
    id: 'prod-395928',
    sku: 'FIVE-ALBEN-30VIEN',
    name: 'Thuốc tẩy giun cho chó mèo Five Alben',
    slug: 'thuoc-tay-giun-cho-cho-meo-five-alben-prod-395928',
    petType: 'all',
    category: 'grooming_health',
    lifeStage: 'all',
    price: 100000,
    originalPrice: 130000,
    weight: 'Hộp 3 vỉ x 10 viên',
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    featured: false,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    shortDesc: 'Tẩy sạch các loại sán lá, sán dây, giun đũa, giun phổi, giun móc ở chó mèo. Có hương dâu thơm ngậy dễ uống.',
    benefits: [
      'Tẩy sạch phổ rộng các loại giun đũa, giun móc, sán dây ký sinh',
      'Hương dâu thơm tự nhiên, bé không bị nhả thuốc hay sùi bọt mép',
      'Quy cách hộp 3 vỉ 30 viên tiết kiệm, dùng được cho cả đàn thú cưng'
    ],
    usageGuide: 'Cho uống trực tiếp hoặc nghiền trộn vào thức ăn. Liều lượng theo bảng cân nặng in trên bao bì.'
  }
];

export function getProductById(id: string): Product | undefined {
  if (!id) return undefined;
  return mockProducts.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  return (
    mockProducts.find((p) => p.slug === slug || p.slug.toLowerCase() === decoded) ||
    mockProducts.find((p) => p.id === slug || p.id.toLowerCase() === decoded) ||
    mockProducts.find((p) => p.id && decoded.includes(p.id.toLowerCase())) ||
    mockProducts.find((p) => p.slug && decoded.includes(p.slug.toLowerCase())) ||
    mockProducts.find((p) => p.slug && p.slug.toLowerCase().includes(decoded))
  );
}

export function getProductsByIds(ids: string[]): Product[] {
  return mockProducts.filter((p) => ids.includes(p.id));
}
