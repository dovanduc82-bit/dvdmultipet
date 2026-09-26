import fs from 'fs';
import path from 'path';
import { Product, Article, Order, OrderStatus, SocialPost } from '../types';
import { mockProducts } from './products';
import { mockArticles } from './articles';
import { supabase, isSupabaseConfigured } from '../supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  products: Product[];
  articles: Article[];
  orders: Order[];
  socialPosts?: SocialPost[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'PN-882194',
    customerName: 'Nguyễn Thanh Hà',
    phone: '0912345678',
    address: '142 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    note: 'Giao giờ hành chính, gọi trước khi đến',
    paymentMethod: 'vietqr',
    items: [
      {
        id: 'prod-01',
        name: 'Hạt Royal Canin Mother & Babycat',
        price: 385000,
        quantity: 1,
        weight: '2kg',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'prod-acc-01',
        name: 'Máy Lọc Nước Tuần Hoàn Khử Khoáng 2.5L',
        price: 380000,
        quantity: 1,
        weight: '0.9kg',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 765000,
    shippingFee: 0,
    totalAmount: 765000,
    status: 'payment_received',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'PN-621039',
    customerName: 'Trần Minh Quân',
    phone: '0988776655',
    address: '78 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    note: 'Đóng gói kỹ giúp mình',
    paymentMethod: 'cod',
    items: [
      {
        id: 'prod-03',
        name: 'Hạt Taste of the Wild Pacific Stream Puppy',
        price: 460000,
        quantity: 1,
        weight: '2kg',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 460000,
    shippingFee: 30000,
    totalAmount: 490000,
    status: 'shipping',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp-01',
    platform: 'tiktok',
    title: 'Kịch bản TikTok: Sai lầm tai hại khi mèo uống ít nước',
    hookText: 'Đừng để mèo cưng bị sỏi thận chỉ vì chiếc bát nước này!',
    content: `[00:00 - 00:03] Cảnh báo cận cảnh bé mèo đi vệ sinh khó khăn.
Voice: "Bạn có biết 80% mèo đối mặt nguy cơ sỏi tiết niệu chỉ vì không thích uống nước đọng trong bát?"
[00:04 - 00:15] Cảnh đặt Máy Lọc Nước Tuần Hoàn 2.5L hoạt động, dòng nước róc rách. Mèo tò mò chạy lại liếm nước liên tục.
Voice: "Tập tính mèo chỉ thích uống nước chảy động và giàu oxy tươi! Máy lọc nước DVDmultilPET khử ion khoáng, lọc sạch cặn lông 24/7."
[00:16 - 00:25] Cảnh bé mèo khỏe mạnh, năng động.
Voice: "Bảo vệ thận cho 'hoàng thượng' ngay từ hôm nay. Link đặt máy chính hãng giảm giá bên dưới nhé!"`,
    hashtags: ['#meocung', '#chamsocmeo', '#maylocnuocmeo', '#dvdmultipet', '#thucungtot', '#learnontiktok'],
    targetUrl: 'https://thucungtot.net/products',
    status: 'draft',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'sp-02',
    platform: 'facebook',
    title: 'Bài đăng Facebook: Chế độ dinh dưỡng vàng cho cún con cai sữa',
    hookText: 'Giai đoạn vàng 1-4 tháng tuổi: Quyết định 90% tầm vóc và đề kháng của cún cưng!',
    content: `🐾 GIAI ĐOẠN VÀNG 1 - 4 THÁNG TUỔI: BÍ QUYẾT ĐỂ BÉ CÚN LỚN NHANH, KHÔNG BỊ TIÊU CHẢY!

Rất nhiều ba mẹ nuôi cún con gặp tình trạng: Vừa chuyển từ bú mẹ sang ăn hạt là bé bị rối loạn tiêu hóa, phân lỏng hoặc còi cọc?

Lý do là hệ tiêu hóa của cún lúc này còn non nớt, lượng enzym tiêu hóa tinh bột còn rất thấp.

👉 GIẢI PHÁP TỪ CHUYÊN GIA DINH DƯỠNG DVDmultilPET:
1️⃣ Chọn dòng hạt chuyên biệt hạt xốp dễ ngâm mềm.
2️⃣ Bổ sung men vi sinh FOS/MOS và Omega-3 phát triển não bộ.
3️⃣ Chia nhỏ 4-5 bữa/ngày thay vì dồn bữa lớn.

Hạt Royal Canin & Taste of the Wild chính hãng hiện đang có sẵn tại shop với ưu đãi freeship toàn quốc!
📞 Hotline tư vấn thú y: 0819.210.319
🌐 Đặt hàng trực tuyến: https://thucungtot.net`,
    hashtags: ['#dinhduongchocon', '#chamsocthucung', '#dvdmultipet', '#thucungtot', '#thucanchomeo'],
    targetUrl: 'https://thucungtot.net/products',
    status: 'published',
    publishedUrl: 'https://facebook.com/dvdmultipet',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let memoryStore: StoreData | null = null;

function ensureLoaded(): StoreData {
  if (memoryStore) return memoryStore;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      memoryStore = JSON.parse(content);
      if (memoryStore) {
        if (!memoryStore.products || memoryStore.products.length === 0) memoryStore.products = [...mockProducts];
        if (!memoryStore.articles || memoryStore.articles.length === 0) memoryStore.articles = [...mockArticles];
        if (!memoryStore.orders) memoryStore.orders = [...INITIAL_ORDERS];
        if (!memoryStore.socialPosts) memoryStore.socialPosts = [...INITIAL_SOCIAL_POSTS];
        return memoryStore;
      }
    }
  } catch (err) {
    console.warn('Could not read store.json, using in-memory fallback:', err);
  }

  memoryStore = {
    products: [...mockProducts],
    articles: [...mockArticles],
    orders: [...INITIAL_ORDERS],
    socialPosts: [...INITIAL_SOCIAL_POSTS]
  };

  saveToDisk(memoryStore);
  return memoryStore;
}

function saveToDisk(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save store to disk:', err);
  }
}

// --- SUPABASE BACKGROUND SYNC HELPERS ---
async function syncProductToSupabase(p: Product) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('products').upsert([
      {
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
      }
    ]);
  } catch (err) {
    // Non-blocking background sync
  }
}

async function syncProductsToSupabase(products: Product[]) {
  if (!isSupabaseConfigured || !supabase || products.length === 0) return;
  try {
    const rows = products.map((p) => ({
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
    await supabase.from('products').upsert(rows);
  } catch (err) {
    // Non-blocking background sync
  }
}

async function deleteProductFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (err) {}
}

async function deleteArticleFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('articles').delete().eq('id', id);
  } catch (err) {}
}

async function deleteOrderFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (err) {}
}

function parseValidDate(val?: string | null): string | null {
  if (!val) return null;
  if (/^\d{1,2}:\d{2}$/.test(val)) {
    const today = new Date();
    const [h, m] = val.split(':');
    today.setHours(Number(h), Number(m), 0, 0);
    return today.toISOString();
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function syncSocialPostToSupabase(sp: SocialPost) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('social_posts').upsert([
      {
        id: sp.id,
        platform: sp.platform,
        title: sp.title,
        content: sp.content,
        hook_text: sp.hookText || null,
        hashtags: sp.hashtags || [],
        media_urls: sp.mediaUrls || [],
        target_url: sp.targetUrl || null,
        published_url: sp.publishedUrl || null,
        status: sp.status || 'draft',
        scheduled_at: parseValidDate(sp.scheduledAt),
        created_at: parseValidDate(sp.createdAt) || new Date().toISOString()
      }
    ]);
  } catch (err) {}
}

async function deleteSocialPostFromSupabase(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('social_posts').delete().eq('id', id);
  } catch (err) {}
}

async function syncOrderToSupabase(o: Order) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('orders').upsert([
      {
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
      }
    ]);
  } catch (err) {
    // Non-blocking background sync
  }
}

async function syncArticleToSupabase(a: Article) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('articles').upsert([
      {
        id: a.id,
        title: a.title,
        slug: a.slug,
        summary: a.summary,
        content: a.content,
        category: a.category,
        target_pet: a.targetPet || 'all',
        featured_image: a.featuredImage || '',
        read_time: a.readTime || '3 phút',
        published_at: a.publishedAt || new Date().toISOString()
      }
    ]);
  } catch (err) {
    // Non-blocking background sync
  }
}

// --- PRODUCTS ---
export function getStoredProducts(): Product[] {
  return ensureLoaded().products;
}

export function saveStoredProduct(product: Product): Product {
  const store = ensureLoaded();
  const index = store.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
  } else {
    store.products.unshift(product);
  }
  saveToDisk(store);
  syncProductToSupabase(product);
  return product;
}

export function saveStoredProducts(newProducts: Product[]): Product[] {
  const store = ensureLoaded();
  for (const product of newProducts) {
    const index = store.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      store.products[index] = product;
    } else {
      store.products.unshift(product);
    }
  }
  saveToDisk(store);
  syncProductsToSupabase(newProducts);
  return newProducts;
}

export function updateStoredProduct(id: string, updates: Partial<Product>): Product | null {
  const store = ensureLoaded();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store.products[index] = { ...store.products[index], ...updates };
  saveToDisk(store);
  return store.products[index];
}

export function deleteStoredProduct(id: string): boolean {
  const store = ensureLoaded();
  const initialLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLen) {
    saveToDisk(store);
    deleteProductFromSupabase(id);
    return true;
  }
  return false;
}

// --- ARTICLES ---
export function getStoredArticles(): Article[] {
  return ensureLoaded().articles;
}

export function saveStoredArticle(article: Article): Article {
  const store = ensureLoaded();
  const index = store.articles.findIndex((a) => a.id === article.id);
  if (index >= 0) {
    store.articles[index] = article;
  } else {
    store.articles.unshift(article);
  }
  saveToDisk(store);
  syncArticleToSupabase(article);
  return article;
}

export function deleteStoredArticle(id: string): boolean {
  const store = ensureLoaded();
  const initialLen = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  if (store.articles.length !== initialLen) {
    saveToDisk(store);
    deleteArticleFromSupabase(id);
    return true;
  }
  return false;
}

// --- ORDERS ---
export function getStoredOrders(): Order[] {
  return ensureLoaded().orders;
}

export function createStoredOrder(order: Order): Order {
  const store = ensureLoaded();
  store.orders.unshift(order);
  saveToDisk(store);
  syncOrderToSupabase(order);
  return order;
}

export function updateStoredOrderStatus(id: string, status: OrderStatus): Order | null {
  const store = ensureLoaded();
  const index = store.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  store.orders[index] = { ...store.orders[index], status };
  saveToDisk(store);
  syncOrderToSupabase(store.orders[index]);
  return store.orders[index];
}

export function deleteStoredOrder(id: string): boolean {
  const store = ensureLoaded();
  const initialLen = store.orders.length;
  store.orders = store.orders.filter((o) => o.id !== id);
  if (store.orders.length !== initialLen) {
    saveToDisk(store);
    deleteOrderFromSupabase(id);
    return true;
  }
  return false;
}

// --- SOCIAL POSTS (TIKTOK, FACEBOOK, ZALO) ---
export function getStoredSocialPosts(): SocialPost[] {
  return ensureLoaded().socialPosts || [];
}

export function saveStoredSocialPost(post: SocialPost): SocialPost {
  const store = ensureLoaded();
  if (!store.socialPosts) store.socialPosts = [];
  const index = store.socialPosts.findIndex((p) => p.id === post.id);
  if (index >= 0) {
    store.socialPosts[index] = post;
  } else {
    store.socialPosts.unshift(post);
  }
  saveToDisk(store);
  syncSocialPostToSupabase(post);
  return post;
}

export function deleteStoredSocialPost(id: string): boolean {
  const store = ensureLoaded();
  if (!store.socialPosts) return false;
  const initialLen = store.socialPosts.length;
  store.socialPosts = store.socialPosts.filter((p) => p.id !== id);
  if (store.socialPosts.length !== initialLen) {
    saveToDisk(store);
    deleteSocialPostFromSupabase(id);
    return true;
  }
  return false;
}

