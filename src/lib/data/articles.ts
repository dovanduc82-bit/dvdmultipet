import { Article } from '../types';

export const mockArticles: Article[] = [
  {
    id: 'art-01',
    slug: 'che-do-an-chuan-cho-meo-con-cai-sua-tu-1-den-4-thang',
    title: 'Cẩm Nang Dinh Dưỡng: Hướng Dẫn Cho Mèo Con Tập Ăn Dặm Từ 1 Đến 4 Tháng Tuổi',
    summary: 'Giai đoạn chuyển từ bú sữa mẹ sang ăn dặm là cột mốc quyết định hệ tiêu hóa và miễn dịch trọn đời của mèo con. Cùng bác sĩ dinh dưỡng khám phá thực đơn và đồ dùng chuẩn y khoa.',
    category: 'Chăm sóc mèo con',
    targetPet: 'cat',
    featuredImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Bác sĩ Thú y Minh Trang',
      title: 'Chuyên khoa Dinh dưỡng Thú y',
      avatar: 'https://images.unsplash.com/photo-1594824813591-6893ddf4f2c0?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '5 phút đọc',
    publishedAt: '2026-09-10T08:00:00Z',
    status: 'published',
    isAiGenerated: false,
    relatedProductIds: ['prod-01', 'prod-acc-02', 'prod-acc-03'],
    tags: ['Mèo con', 'Ăn dặm', 'Dinh dưỡng mèo', 'Bát ăn gốm sứ', 'Cát đậu nành Tofu'],
    content: `
### 1. "Khoảng trống miễn dịch" ở mèo con là gì?
Từ tuần tuổi thứ 4 đến tuần thứ 12, lượng kháng thể nhận được từ sữa mèo mẹ bắt đầu suy giảm nhanh chóng, trong khi hệ miễn dịch tự thân của mèo con chưa hoàn thiện. Đây được các bác sĩ thú y gọi là **"Khoảng trống miễn dịch" (Immunity Gap)**.

Trong giai đoạn này, mèo con rất dễ bị tiêu chảy, sụt cân hoặc nhiễm khuẩn hô hấp nếu đổi thức ăn đột ngột.

### 2. Chuẩn bị thức ăn và đồ dùng thiết yếu cho mèo con tập ăn
* **Hạt thức ăn xốp mềm, giàu DHA**: Hạt siêu nhỏ dưới 6mm dễ ngâm nở thành cháo mịn giàu DHA như Royal Canin Mother & Babycat.
* **Bát ăn gốm sứ chống trào ngược**: Răng và hàm mèo con còn yếu, bạn nên dùng bát gốm sứ có góc nghiêng công thái học 15 độ để bé không phải cúi gập cổ gây sặc trớ.
* **Cát vệ sinh hữu cơ an toàn**: Mèo con thường có thói quen tò mò liếm hoặc cắn thử hạt cát, do đó bắt buộc phải dùng cát đậu nành hữu cơ 100% tự nhiên không độc tố.

### 3. Lịch trình tập ăn dặm theo từng tuần
1. **Tuần 4 - 5**: Ngâm hạt với nước ấm theo tỷ lệ 1 phần hạt : 3 phần nước. Trộn đều thành hỗn hợp lỏng như bột ăn dặm của em bé.
2. **Tuần 6 - 7**: Giảm dần lượng nước, hạt để mềm ẩm nhưng bắt đầu có độ nhai nhẹ.
3. **Tuần 8 trở đi**: Mèo con có thể ăn hạt khô hoàn toàn hoặc xen kẽ pate tươi để bổ sung nước.
    `
  },
  {
    id: 'art-02',
    slug: 'dau-hieu-soi-tiet-nieu-o-meo-va-che-do-an-tri-lieu',
    title: 'Dấu Hiệu Sỏi Bàng Quang Ở Mèo & Bộ Giải Pháp Dinh Dưỡng + Máy Lọc Nước Khử Khoáng',
    summary: 'Mèo đi tiểu rặn, tiểu ra máu hoặc hay liếm bộ phận sinh dục là dấu hiệu cảnh báo bệnh lý sỏi đường tiết niệu (FLUTD). Khám phá giải pháp dinh dưỡng làm tan sỏi và cơ chế kích thích uống nước tự nhiên.',
    category: 'Bệnh lý & Trị liệu',
    targetPet: 'cat',
    featuredImage: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'BS. Tuấn Anh',
      title: 'Bác sĩ Điều trị Nội khoa',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '6 phút đọc',
    publishedAt: '2026-09-11T12:00:00Z',
    status: 'published',
    isAiGenerated: false,
    relatedProductIds: ['prod-02', 'prod-acc-01', 'prod-06'],
    tags: ['Sỏi thận', 'Tiết niệu mèo', 'Thức ăn trị liệu', 'Máy lọc nước mèo', 'Urinary S/O'],
    content: `
### 1. Vì sao mèo nhà bạn rất dễ bị sỏi thận và sỏi bàng quang?
Tổ tiên của loài mèo vốn sống ở sa mạc, do đó chúng có bản năng uống rất ít nước và nước tiểu thường rất cô đặc. Khi được nuôi trong nhà với chế độ ăn hạt khô thông thường thiếu nước, khoáng chất magie và photpho dễ kết tinh thành **sỏi Struvite** hoặc **Canxi Oxalate**.

### 2. Các dấu hiệu cảnh báo khẩn cấp
* Mèo ngồi khay cát rất lâu, kêu meo meo đau đớn khi đi tiểu.
* Nước tiểu có màu hồng hoặc lẫn vệt máu đỏ.
* Mèo đi tiểu nhiều lần trong ngày nhưng mỗi lần chỉ nhỏ vài giọt.
* Mèo đực bị tắc tiểu hoàn toàn (đây là tình huống cấp cứu thú y đe dọa tính mạng trong 24-48h).

### 3. Phác đồ điều trị kép: Thức ăn trị liệu + Máy lọc nước tuần hoàn
1. **Dinh dưỡng hạ chỉ số bão hòa RSS**: Sử dụng hạt chuyên biệt **Royal Canin Urinary S/O** để hòa tan tinh thể sỏi Struvite.
2. **Kích thích uống nước bằng Máy lọc nước tuần hoàn**: Mèo có bản năng sợ nước đọng trong bát tĩnh vì lo ngại nước bẩn. Dòng nước chảy tuần hoàn oxy hóa liên tục của máy lọc nước sẽ kích thích mèo uống nhiều gấp 3 lần, giúp pha loãng nước tiểu và đẩy sỏi ra ngoài tự nhiên!
    `
  },
  {
    id: 'art-03',
    slug: 'giai-phap-tri-chay-nuoc-mat-ngua-da-cho-cun-poodle',
    title: 'Bí Quyết Trị Dứt Điểm Chảy Nước Mắt Ố Vàng & Dị Ứng Da Ở Chó Poodle',
    summary: 'Vệt ố nâu quanh khóe mắt và tình trạng gãi tai, liếm chân liên tục ở Poodle phần lớn bắt nguồn từ dị ứng đạm gia cầm trong hạt thức ăn kết hợp viêm da bề mặt.',
    category: 'Chăm sóc chó',
    targetPet: 'dog',
    featuredImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Chuyên viên Grooming & Dinh dưỡng Mai Linh',
      title: 'Pet Stylist & Nutrition Consultant',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '4 phút đọc',
    publishedAt: '2026-09-12T08:00:00Z',
    status: 'published',
    isAiGenerated: true,
    relatedProductIds: ['prod-03', 'prod-acc-05', 'prod-acc-06'],
    tags: ['Chó Poodle', 'Chảy nước mắt', 'Dị ứng da', 'Sữa tắm thảo dược', 'Dây dắt yếm'],
    content: `
### 1. Nguyên nhân sâu xa khiến Poodle bị vệt nâu quanh mắt
Tuyến lệ của Poodle rất hẹp và dễ bị kích ứng. Khi thức ăn chứa nhiều phẩm màu nhân tạo, chất bảo quản BHA/BHT hoặc chứa **nguồn đạm dễ gây dị ứng (như thịt gà công nghiệp, ngô, đậu nành)**, cơ thể cún sẽ tiết ra porphyrin qua nước mắt. Khi tiếp xúc với ánh sáng mặt trời, porphyrin sẽ bị oxy hóa thành màu nâu đỏ làm ố bẩn lông mặt.

### 2. Sự kết hợp giữa Thức ăn Cá hồi Grain-Free và Vệ sinh Thảo dược
* **Bên trong**: Chuyển sang hạt **Taste of the Wild Pacific Stream Puppy** (đạm cá hồi tươi hun khói, không ngũ cốc). Giàu Omega 3 & DHA giúp kháng viêm nang lông từ gốc.
* **Bên ngoài**: Tắm định kỳ với **Sữa tắm thảo dược Tràm trà & Neem** để tiêu diệt vi khuẩn nấm ngứa kỵ khí trên bề mặt da.
* **Khi vận động ngoài trời**: Dùng **Dây dắt yếm chữ Y chống giật** để không chèn ép khí quản và không cọ xát gây rụng lông vùng cổ nách của cún.
    `
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find((a) => a.slug === slug);
}
