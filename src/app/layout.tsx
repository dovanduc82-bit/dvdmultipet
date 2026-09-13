import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PetNutritionistChat from '@/components/chat/PetNutritionistChat';

export const metadata: Metadata = {
  title: 'DVDmultilPET - Hệ Sinh Thái Dinh Dưỡng & Phụ Kiện Thú Cưng Chuẩn Y Khoa',
  description: 'Hệ thống bán lẻ thức ăn, phụ kiện, đồ dùng thú cưng cao cấp kết hợp cẩm nang dinh dưỡng chuẩn thú y và Trợ lý Bác sĩ AI tư vấn 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <PetNutritionistChat />
        </CartProvider>
      </body>
    </html>
  );
}
