const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grbruiekdgtuzbwovgnm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CFpR9z9mNwR1dveJflYpEg_YKm7jeGx';

const client = createClient(supabaseUrl, supabaseKey);

async function syncAll() {
  const storePath = path.join(__dirname, '..', 'data', 'store.json');
  if (!fs.existsSync(storePath)) {
    console.error('Store file not found');
    return;
  }

  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

  // 1. Sync Articles
  if (store.articles && store.articles.length > 0) {
    const articles = store.articles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      content: a.content,
      category: a.category,
      target_pet: a.targetPet || 'all',
      featured_image: a.featuredImage || '',
      read_time: a.readTime || '3 phút',
      views: a.views || 0,
      likes: a.likes || 0
    }));
    const { error: artErr } = await client.from('articles').upsert(articles);
    if (artErr) console.error('Error syncing articles:', artErr);
    else console.log(`✓ Đã đồng bộ ${articles.length} bài viết cẩm nang lên Supabase!`);
  }

  // 2. Sync Orders
  if (store.orders && store.orders.length > 0) {
    const orders = store.orders.map(o => ({
      id: o.id,
      customer_name: o.customerName,
      phone: o.phone,
      address: o.address,
      note: o.note || '',
      payment_method: o.paymentMethod || 'vietqr',
      items: o.items || [],
      subtotal: o.subtotal,
      shipping_fee: o.shippingFee || 0,
      total_amount: o.totalAmount,
      status: o.status || 'pending_payment'
    }));
    const { error: ordErr } = await client.from('orders').upsert(orders);
    if (ordErr) console.error('Error syncing orders:', ordErr);
    else console.log(`✓ Đã đồng bộ ${orders.length} đơn hàng lên Supabase!`);
  }

  // 3. Sync Products
  if (store.products && store.products.length > 0) {
    const products = store.products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      pet_type: p.petType || 'all',
      category: p.category || 'dry_kibble',
      life_stage: p.lifeStage || 'all',
      price: Number(p.price) || 0,
      original_price: p.originalPrice ? Number(p.originalPrice) : null,
      weight: p.weight || '1kg',
      rating: p.rating || 5.0,
      review_count: p.reviewCount || 1,
      in_stock: p.inStock !== false,
      image: p.image || '',
      short_desc: p.shortDesc || '',
      benefits: p.benefits || []
    }));

    const { error: prodErr } = await client.from('products').upsert(products);
    if (prodErr) console.error('Lỗi đồng bộ sản phẩm:', prodErr.message);
    else console.log(`✓ Đã đồng bộ ${products.length} sản phẩm lên Supabase!`);
  }

  // 4. Sync Social Posts
  const defaultSocialPosts = [
    {
      id: 'sp-01',
      platform: 'tiktok',
      title: 'Kịch bản TikTok: Sai lầm tai hại khi mèo uống ít nước',
      hookText: 'Đừng để mèo cưng bị sỏi thận chỉ vì chiếc bát nước này!',
      content: `[00:00 - 00:03] Cảnh báo cận cảnh bé mèo đi vệ sinh khó khăn.\nVoice: "Bạn có biết 80% mèo đối mặt nguy cơ sỏi tiết niệu chỉ vì không thích uống nước đọng trong bát?"\n[00:04 - 00:15] Cảnh đặt Máy Lọc Nước Tuần Hoàn 2.5L hoạt động, dòng nước róc rách. Mèo tò mò chạy lại liếm nước liên tục.\nVoice: "Tập tính mèo chỉ thích uống nước chảy động và giàu oxy tươi! Máy lọc nước DVDmultilPET khử ion khoáng, lọc sạch cặn lông 24/7."\n[00:16 - 00:25] Cảnh bé mèo khỏe mạnh, năng động.\nVoice: "Bảo vệ thận cho 'hoàng thượng' ngay từ hôm nay. Link đặt máy chính hãng giảm giá bên dưới nhé!"`,
      hashtags: ['#meocung', '#chamsocmeo', '#maylocnuocmeo', '#dvdmultipet', '#thucungtot', '#learnontiktok'],
      targetUrl: 'https://thucungtot.net/products',
      status: 'draft',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sp-02',
      platform: 'facebook',
      title: 'Bài đăng Facebook: Chế độ dinh dưỡng vàng cho cún con cai sữa',
      hookText: 'Giai đoạn vàng 1-4 tháng tuổi: Quyết định 90% tầm vóc và đề kháng của cún cưng!',
      content: `🐾 GIAI ĐOẠN VÀNG 1 - 4 THÁNG TUỔI: BÍ QUYẾT ĐỂ BÉ CÚN LỚN NHANH, KHÔNG BỊ TIÊU CHẢY!\n\nRất nhiều ba mẹ nuôi cún con gặp tình trạng: Vừa chuyển từ bú mẹ sang ăn hạt là bé bị rối loạn tiêu hóa, phân lỏng hoặc còi cọc?\n\nLý do là hệ tiêu hóa của cún lúc này còn non nớt, lượng enzym tiêu hóa tinh bột còn rất thấp.\n\n👉 GIẢI PHÁP TỪ CHUYÊN GIA DINH DƯỠNG DVDmultilPET:\n1️⃣ Chọn dòng hạt chuyên biệt hạt xốp dễ ngâm mềm.\n2️⃣ Bổ sung men vi sinh FOS/MOS và Omega-3 phát triển não bộ.\n3️⃣ Chia nhỏ 4-5 bữa/ngày thay vì dồn bữa lớn.\n\nHạt Royal Canin & Taste of the Wild chính hãng hiện đang có sẵn tại shop với ưu đãi freeship toàn quốc!\n📞 Hotline tư vấn thú y: 0819.210.319\n🌐 Đặt hàng trực tuyến: https://thucungtot.net`,
      hashtags: ['#dinhduongchocon', '#chamsocthucung', '#dvdmultipet', '#thucungtot', '#thucanchomeo'],
      targetUrl: 'https://thucungtot.net/products',
      status: 'published',
      publishedUrl: 'https://facebook.com/dvdmultipet',
      createdAt: new Date().toISOString()
    }
  ];

  if (!store.socialPosts || store.socialPosts.length === 0) {
    store.socialPosts = defaultSocialPosts;
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  }

  const socialPosts = (store.socialPosts || defaultSocialPosts).map(s => ({
    id: s.id,
    platform: s.platform,
    title: s.title,
    content: s.content,
    hook_text: s.hookText || null,
    hashtags: s.hashtags || [],
    media_urls: s.mediaUrls || [],
    target_url: s.targetUrl || null,
    published_url: s.publishedUrl || null,
    status: s.status || 'draft',
    scheduled_at: s.scheduledAt || null,
    created_at: s.createdAt || new Date().toISOString()
  }));

  const { error: spErr } = await client.from('social_posts').upsert(socialPosts);
  if (spErr) console.error('Lỗi đồng bộ social_posts:', spErr.message);
  else console.log(`✓ Đã đồng bộ ${socialPosts.length} bài đăng truyền thông (TikTok/FB) lên Supabase!`);
}

syncAll();
