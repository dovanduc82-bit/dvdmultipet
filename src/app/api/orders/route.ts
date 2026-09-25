import { NextRequest, NextResponse } from 'next/server';
import { getStoredOrders, createStoredOrder, updateStoredOrderStatus, deleteStoredOrder } from '@/lib/data/store';
import { Order, OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = getStoredOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, customerName, phone, address, note, paymentMethod, items, subtotal, shippingFee, totalAmount } = body;

    if (!customerName || !phone || !address || !items || !items.length) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin đơn hàng' }, { status: 400 });
    }

    const newOrder: Order = {
      id: id || `PN-${Date.now().toString().slice(-6)}`,
      customerName,
      phone,
      address,
      note: note || '',
      paymentMethod: paymentMethod || 'vietqr',
      items,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      totalAmount: Number(totalAmount) || 0,
      status: paymentMethod === 'vietqr' ? 'pending_payment' : 'shipping',
      createdAt: new Date().toISOString()
    };

    const saved = createStoredOrder(newOrder);
    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Lỗi tạo đơn hàng' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu orderId hoặc status' }, { status: 400 });
    }

    const updated = updateStoredOrderStatus(orderId, status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: 'Lỗi cập nhật trạng thái đơn hàng' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const deleted = deleteStoredOrder(orderId);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: 'Lỗi xóa đơn hàng' }, { status: 500 });
  }
}
