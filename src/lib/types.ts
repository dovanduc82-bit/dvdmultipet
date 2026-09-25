export type PetType = 'dog' | 'cat' | 'all';

export type ProductCategory =
  | 'dry_kibble'           // Hạt khô
  | 'wet_pate'             // Pate ướt
  | 'treats'               // Bánh thưởng
  | 'dietary'              // Thức ăn trị liệu
  | 'feeding_tools'        // Bát ăn, Máy lọc nước
  | 'hygiene_litter'       // Khay cát & Vệ sinh
  | 'toys_scratchers'      // Đồ chơi & Cào móng
  | 'grooming_health'      // Sữa tắm & Vệ sinh lông móng
  | 'accessories_collars'; // Vòng cổ, Dây dắt, Ổ đệm

// Giữ lại FoodCategory alias để tương thích ngược
export type FoodCategory = ProductCategory;

export type LifeStage = 'puppy_kitten' | 'adult' | 'senior' | 'all';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  petType: PetType;
  category: ProductCategory;
  lifeStage: LifeStage;
  price: number;
  originalPrice?: number;
  weight: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  image: string;
  shortDesc: string;
  ingredients?: string[];
  nutritionAnalysis?: {
    protein?: string;
    fat?: string;
    fiber?: string;
    moisture?: string;
    calorieDensity?: string;
  };
  specifications?: {
    material?: string;
    dimensions?: string;
    capacity?: string;
    origin?: string;
  };
  benefits: string[];
  usageGuide?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  targetPet: PetType;
  featuredImage: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  readTime: string;
  publishedAt: string;
  scheduledAt?: string;
  status: 'published' | 'scheduled' | 'draft';
  isAiGenerated?: boolean;
  relatedProductIds: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PetProfile {
  species: 'dog' | 'cat';
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  activityLevel: 'low' | 'normal' | 'high';
  isNeutered: boolean;
  condition?: string;
}

export interface CalorieCalculation {
  rer: number; // Resting Energy Requirement (kcal/day)
  mer: number; // Maintenance Energy Requirement (kcal/day)
  dailyFoodGrams: number;
  dailyWaterMl: number;
  bagDaysEstimate: number; // For a 1.5kg bag
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_received'
  | 'shipping'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: 'vietqr' | 'cod';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'tiktok' | 'zalo' | 'instagram';
  title: string;
  content: string;
  hookText?: string;
  hashtags: string[];
  mediaUrls?: string[];
  targetUrl?: string;
  publishedUrl?: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  createdAt?: string;
}
