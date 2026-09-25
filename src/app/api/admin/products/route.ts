import { NextRequest, NextResponse } from 'next/server';
import { getStoredProducts, saveStoredProduct, saveStoredProducts, updateStoredProduct, deleteStoredProduct } from '@/lib/data/store';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Support Bulk Products Import (from AI Catalog / Price Quote Scanner)
    if (body.products && Array.isArray(body.products)) {
      if (body.products.length === 0) {
        return NextResponse.json({ success: false, error: 'Danh sách sản phẩm trống' }, { status: 400 });
      }

      const defaultImagesByCategory: Record<string, string> = {
        dry_kibble: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
        wet_pate: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
        dietary: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80',
        treats: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
        feeding_tools: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
        hygiene_litter: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
        toys_scratchers: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80',
        grooming_health: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
        accessories_collars: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80'
      };

      const now = Date.now();
      const newProducts: Product[] = body.products.map((item: any, idx: number) => {
        const id = `prod-${(now + idx).toString().slice(-6)}`;
        const slug = (item.name || 'san-pham')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const cat = item.category || 'dry_kibble';
        return {
          id,
          sku: item.sku || `SKU-${(now + idx).toString().slice(-4)}`,
          name: item.name,
          slug: `${slug}-${id}`,
          petType: item.petType || 'all',
          category: cat,
          lifeStage: item.lifeStage || 'all',
          price: Number(item.price) || 0,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          weight: item.weight || '1kg',
          rating: 5.0,
          reviewCount: 1,
          inStock: item.inStock !== undefined ? item.inStock : true,
          image: item.image || defaultImagesByCategory[cat] || defaultImagesByCategory.dry_kibble,
          shortDesc: item.shortDesc || 'Sản phẩm nhập khẩu chính hãng bảo vệ sức khỏe toàn diện cho thú cưng.',
          benefits: ['Đảm bảo chính hãng 100%', 'An toàn cho thú cưng', 'Được kiểm định chất lượng']
        };
      });

      saveStoredProducts(newProducts);
      return NextResponse.json({ success: true, count: newProducts.length, products: newProducts }, { status: 201 });
    }

    // 2. Single Product Creation
    const { name, category, petType, lifeStage, price, originalPrice, weight, shortDesc, image, inStock } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: 'Tên và giá sản phẩm là bắt buộc' }, { status: 400 });
    }

    const id = `prod-${Date.now().toString().slice(-6)}`;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct: Product = {
      id,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name,
      slug: `${slug}-${id}`,
      petType: petType || 'all',
      category: category || 'dry_kibble',
      lifeStage: lifeStage || 'all',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      weight: weight || '1kg',
      rating: 5.0,
      reviewCount: 1,
      inStock: inStock !== undefined ? inStock : true,
      image: image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
      shortDesc: shortDesc || 'Sản phẩm dinh dưỡng và phụ kiện chất lượng cao cho thú cưng.',
      benefits: ['Đảm bảo chính hãng 100%', 'An toàn cho sức khỏe thú cưng']
    };

    const saved = saveStoredProduct(newProduct);
    return NextResponse.json({ success: true, product: saved }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, error: 'Lỗi thêm sản phẩm' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã sản phẩm id' }, { status: 400 });
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);

    const updated = updateStoredProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật sản phẩm' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã sản phẩm' }, { status: 400 });
    }

    const deleted = deleteStoredProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Lỗi xóa sản phẩm' }, { status: 500 });
  }
}
