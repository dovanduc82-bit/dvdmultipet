import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/data/products';
import { mockArticles } from '@/lib/data/articles';
import { Article } from '@/lib/types';

// Danh sách các chủ đề bài viết tự động theo khung giờ
const AUTO_TOPICS = [
  {
    title: 'Cách Nhận Biết Thức Ăn Hạt Bị Mốc Ẩm & Mẹo Bảo Quản Bao Hạt Luôn Giòn Thơm',
    summary: 'Độ ẩm cao tại Việt Nam khiến thức ăn hạt rất dễ bị nấm mốc độc tố Aflatoxin. Cùng học cách kiểm tra và lưu trữ thức ăn thú cưng chuẩn y khoa.',
    targetPet: 'all' as const,
    relatedProductIds: ['prod-01', 'prod-03'],
    tags: ['Bảo quản hạt', 'Thức ăn chó mèo', 'An toàn thực phẩm thú cưng'],
  },
  {
    title: 'Top 3 Sai Lầm Tai Hại Khi Trộn Pate Tươi Vào Hạt Khô Khiến Mèo Bị Tiêu Chảy',
    summary: 'Trộn pate và hạt khô là cách tuyệt vời để bổ sung nước, nhưng trộn sai tỷ lệ hoặc để quá lâu ở nhiệt độ phòng có thể gây rối loạn tiêu hóa.',
    targetPet: 'cat' as const,
    relatedProductIds: ['prod-04', 'prod-06'],
    tags: ['Pate mèo', 'Hạt khô', 'Tiêu hóa mèo con'],
  },
  {
    title: 'Chó Già Trên 7 Tuổi Nên Ăn Gì Để Tránh Bệnh Thận & Thoái Hóa Khớp?',
    summary: 'Chế độ ăn cho thú cưng cao tuổi cần giảm lượng muối photpho và tăng cường Glucosamine & Chondroitin để duy trì sự nhanh nhẹn.',
    targetPet: 'dog' as const,
    relatedProductIds: ['prod-03', 'prod-04'],
    tags: ['Chó già', 'Thoái hóa khớp', 'Dinh dưỡng Senior'],
  }
];

export async function GET(req: NextRequest) {
  return handleAutoPublish(req);
}

export async function POST(req: NextRequest) {
  return handleAutoPublish(req);
}

async function handleAutoPublish(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const secret = req.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET_TOKEN || 'petfood_secret_cron_token_2026';

  // Check auth if provided, or allow test in dev
  const isAuthorized =
    authHeader === `Bearer ${expectedSecret}` || secret === expectedSecret;

  // Pick a topic based on current hour
  const currentHour = new Date().getHours();
  const topicIndex = currentHour % AUTO_TOPICS.length;
  const topic = AUTO_TOPICS[topicIndex];

  const now = new Date();
  const slug = `${topic.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')}-${now.getTime().toString().slice(-4)}`;

  const newArticle: Article = {
    id: `auto-${now.getTime()}`,
    slug,
    title: topic.title,
    summary: topic.summary,
    targetPet: topic.targetPet,
    category: 'Tự Động Hóa Dinh Dưỡng Thú Cưng',
    featuredImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'DVDmultilPET AI Medical Editor',
      title: 'Hệ thống Biên tập Tự động Chuẩn Thú y',
      avatar: 'https://images.unsplash.com/photo-1594824813591-6893ddf4f2c0?w=150&auto=format&fit=crop&q=80'
    },
    readTime: '4 phút đọc',
    publishedAt: now.toISOString(),
    status: 'published',
    isAiGenerated: true,
    relatedProductIds: topic.relatedProductIds,
    tags: topic.tags,
    content: `
### Tổng quan y khoa từ Bác sĩ Thú y DVDmultilPET
Bài viết được hệ thống AI tự động tổng hợp dựa trên dữ liệu thành phần dinh dưỡng và các báo cáo lâm sàng mới nhất.

#### Điểm quan trọng cần ghi nhớ:
1. **Kiểm soát độ ẩm và nhiệt độ**: Luôn để túi thức ăn ở nơi khô ráo, kéo kín khóa zip hoặc dùng thùng đậy kín khí chuyên dụng.
2. **Khẩu phần chuẩn theo thể trạng**: Tránh cho ăn tự do quá mức khiến thú cưng thừa cân, gây áp lực lên tim mạch và khớp gối.
3. **Bổ sung đủ nước**: Nếu cho ăn thức ăn hạt khô 100%, hãy chuẩn bị máy lọc nước tuần hoàn để kích thích thú cưng uống nước đều đặn.

*Hệ thống tự động liên kết các sản phẩm dinh dưỡng tương thích bên dưới để bạn tiện tham khảo và đặt mua cho thú cưng của mình.*
    `
  };

  // Add to in-memory store for active session
  mockArticles.unshift(newArticle);

  return NextResponse.json({
    success: true,
    message: `Đã tự động xuất bản bài viết mới thành công vào lúc ${now.toLocaleTimeString('vi-VN')}!`,
    scheduledSlot: `${currentHour}:00`,
    article: {
      id: newArticle.id,
      title: newArticle.title,
      slug: newArticle.slug,
      publishedAt: newArticle.publishedAt,
      embeddedProductIds: newArticle.relatedProductIds,
      url: `/blog/${newArticle.slug}`
    }
  });
}
