'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Lock,
  Unlock,
  Search,
  RefreshCw,
  Sparkles,
  Phone,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Eye,
  Camera,
  UploadCloud,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  X,
  FileUp,
  SlidersHorizontal,
  Share2,
  Video,
  Copy,
  Send,
  Megaphone,
  Check,
  Calendar,
  Play,
  Download,
  Film,
  Upload,
  Loader2,
  Sliders,
  Volume2,
  VolumeX,
  Mic,
  Zap
} from 'lucide-react';
import { Product, Article, Order, OrderStatus, SocialPost } from '@/lib/types';

function TikTokCardPlayer({
  post,
  onOpenModal,
  onDeleteVideo,
  onRenderVideo,
  isRenderingThis
}: {
  post: SocialPost;
  onOpenModal: () => void;
  onDeleteVideo: () => void;
  onRenderVideo?: (post: SocialPost) => void;
  isRenderingThis?: boolean;
}) {
  const [useAiVoice, setUseAiVoice] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const isRenderedVideo =
    Boolean(post.mediaUrls?.[0]?.startsWith('/uploads/videos/')) ||
    Boolean(post.mediaUrls?.[0]?.includes('co-chu'));

  // Nội dung lời thoại AI chuẩn
  const voiceText = `${post.hookText || post.title}. ${post.title}. Bấm vào đường link trong phần mô tả để đặt mua chính hãng tại DVDmultilPET nha!`;
  const ttsAudioUrl = `/api/admin/tts?text=${encodeURIComponent(voiceText)}`;

  useEffect(() => {
    const audio = new Audio(ttsAudioUrl);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [ttsAudioUrl]);

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (useAiVoice && audioRef.current && videoRef.current) {
      // Giảm âm thanh gốc của camera quay để giọng AI đọc to, rõ ràng chuẩn xác 100%
      videoRef.current.volume = 0;
      audioRef.current.currentTime = videoRef.current.currentTime;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleVideoSeeked = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      if (!videoRef.current.paused && useAiVoice) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const toggleVoiceMode = () => {
    const nextMode = !useAiVoice;
    setUseAiVoice(nextMode);
    if (videoRef.current) {
      if (nextMode) {
        videoRef.current.volume = 0;
        if (isPlaying && audioRef.current) {
          audioRef.current.currentTime = videoRef.current.currentTime;
          audioRef.current.play().catch(() => {});
        }
      } else {
        videoRef.current.volume = 1;
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  };

  return (
    <div className="space-y-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
      {/* Packaging Status Banner */}
      {isRenderedVideo ? (
        <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Video Đã Ghép Chữ & Giọng AI
          </span>
          <span className="text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-black">HOÀN TẤT</span>
        </div>
      ) : (
        <div className="bg-amber-950/70 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Clip thô (Chưa đóng gói chữ & AI)
          </span>
          <button
            type="button"
            onClick={() => onRenderVideo && onRenderVideo(post)}
            disabled={isRenderingThis}
            className="text-[9px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-2 py-0.5 rounded-md font-black cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Ghép Ngay
          </button>
        </div>
      )}

      {/* Voice Mode Selector Pill */}
      <div className="flex items-center justify-between bg-slate-900/90 px-2 py-1.5 rounded-xl border border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5">
          <Mic className={`w-3.5 h-3.5 ${useAiVoice ? 'text-pink-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="font-bold text-slate-300">Âm thanh:</span>
        </div>
        <button
          type="button"
          onClick={toggleVoiceMode}
          className={`py-1 px-2.5 rounded-lg font-black text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
            useAiVoice
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Bấm để chuyển đổi giữa Giọng Đọc AI Chuẩn Tiếng Việt và Âm Thanh Gốc"
        >
          {useAiVoice ? (
            <>
              <Volume2 className="w-3 h-3 text-white" />
              <span>🎙️ Giọng AI Bác Sĩ (Đang Bật)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-slate-400" />
              <span>🔈 Âm Gốc Video</span>
            </>
          )}
        </button>
      </div>

      {/* Vertical TikTok Video Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/14] max-h-72 w-full mx-auto shadow-md border border-slate-800">
        <video
          ref={videoRef}
          src={post.mediaUrls?.[0] || ''}
          controls
          preload="metadata"
          playsInline
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onSeeked={handleVideoSeeked}
          className="w-full h-full object-cover"
        />

        {/* TikTok Top Overlay: Hook (Sát trên) */}
        <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none space-y-1">
          <div className="flex items-center justify-between">
            <span className="bg-red-600/90 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-xs">
              ⚠️ Bác Sĩ Cảnh Báo
            </span>
            <span
              className={`text-[8px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1 ${
                useAiVoice ? 'bg-pink-600/90 text-white' : 'bg-slate-700/90 text-slate-300'
              }`}
            >
              <Mic className="w-2.5 h-2.5" />
              {useAiVoice ? 'Giọng AI Tiếng Việt' : 'Âm Gốc'}
            </span>
          </div>
          <div className="bg-black/60 backdrop-blur-xs p-1.5 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold text-amber-300 leading-tight line-clamp-2">
              &ldquo;{post.hookText || post.title}&rdquo;
            </p>
          </div>
        </div>

        {/* Middle is 100% CLEAR - không che thú cưng */}

        {/* TikTok Bottom Overlay: Product Info & CTA (Sát dưới) */}
        <div className="absolute bottom-11 left-2 right-2 z-10 pointer-events-none space-y-1">
          <div className="bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/15">
            <div className="text-[10px] font-black text-white line-clamp-1">
              {post.title}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[10px] font-black text-rose-400">
                {post.content.match(/\d+[\d.,]*\s*[₫đ]/)?.[0] || 'Giá ưu đãi hôm nay'}
              </span>
              <span className="text-[8px] text-emerald-400 font-bold">
                ✓ Chính hãng
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white text-[9px] font-black py-1 px-2 rounded-lg text-center shadow-xs">
            👉 BẤM LINK TRONG MÔ TẢ ĐẶT MUA
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5">
          {isRenderedVideo ? (
            <a
              href={post.mediaUrls?.[0] || '#'}
              download={`tiktok-${post.id}-co-chu-va-giong-ai.mp4`}
              className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              title="Tải tệp video MP4 hoàn chỉnh đã có sẵn chữ chạy và giọng đọc AI"
            >
              <Download className="w-3.5 h-3.5 text-white" /> Tải Video Hoàn Chỉnh
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onRenderVideo && onRenderVideo(post)}
              disabled={isRenderingThis}
              className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-black bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              title="Đóng gói vĩnh viễn chữ chạy và giọng AI Bác Sĩ vào tệp video MP4 để tải về máy"
            >
              {isRenderingThis ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Đang Ghép...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Xuất Video Có Chữ & Giọng AI
                </>
              )}
            </button>
          )}

          <a
            href={ttsAudioUrl}
            download={`voice-ai-${post.id}.mp3`}
            className="py-2 px-2.5 rounded-xl text-[11px] font-bold bg-pink-950/80 hover:bg-pink-900 text-pink-200 border border-pink-700/60 flex items-center justify-center gap-1 transition-colors shrink-0"
            title="Tải tệp âm thanh giọng đọc AI tiếng Việt chuẩn"
          >
            <Mic className="w-3.5 h-3.5 text-pink-400" /> Giọng AI
          </a>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={post.mediaUrls?.[0] || '#'}
            download={`clip-goc-${post.id}.mp4`}
            className="flex-1 py-1 px-2 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-colors border border-slate-800"
            title="Tải video clip thô không kèm hiệu ứng"
          >
            <Download className="w-3 h-3 text-slate-400" /> Tải Clip Thô
          </a>
          <button
            type="button"
            onClick={onOpenModal}
            className="py-1 px-2.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Film className="w-3 h-3 text-slate-400" /> Đổi Clip
          </button>
          <button
            type="button"
            onClick={onDeleteVideo}
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
            title="Gỡ bỏ video này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  // Authentication State
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'articles' | 'social'>('overview');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [socialFilter, setSocialFilter] = useState<'all' | 'tiktok' | 'facebook' | 'zalo'>('all');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [showGenerateSocialModal, setShowGenerateSocialModal] = useState(false);
  const [socialGenerating, setSocialGenerating] = useState(false);
  const [socialForm, setSocialForm] = useState<{
    platform: 'tiktok' | 'facebook' | 'zalo';
    productId: string;
    topic: string;
  }>({
    platform: 'tiktok',
    productId: '',
    topic: ''
  });
  const [generatedPost, setGeneratedPost] = useState<Partial<SocialPost> | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Product Form state
  const [pForm, setPForm] = useState({
    name: '',
    category: 'dry_kibble',
    petType: 'cat',
    price: '',
    originalPrice: '',
    weight: '1.5kg',
    image: '',
    shortDesc: '',
    inStock: true
  });

  // Article Form state
  const [aForm, setAForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Chăm Sóc & Dinh Dưỡng',
    targetPet: 'all',
    featuredImage: ''
  });

  // AI Catalog & Price Quote Scanner State
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanTab, setScanTab] = useState<'file' | 'text'>('file');
  const [scanFile, setScanFile] = useState<{ name: string; dataUrl: string; type: string; size?: number } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const scanFileInputRef = React.useRef<HTMLInputElement>(null);
  const [scanRawText, setScanRawText] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanStep, setScanStep] = useState<'input' | 'review'>('input');
  const [scannedItems, setScannedItems] = useState<
    Array<{
      tempId: string;
      name: string;
      price: number;
      originalPrice?: number;
      weight: string;
      category: string;
      petType: 'cat' | 'dog' | 'all';
      shortDesc: string;
      selected: boolean;
    }>
  >([]);
  const [isImporting, setIsImporting] = useState(false);

  // TikTok Video Studio & Scheduling States
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoPost, setActiveVideoPost] = useState<SocialPost | null>(null);
  const [videoModalTab, setVideoModalTab] = useState<'my_pet_clips' | 'live_preview' | 'upload' | 'capcut_guide'>('my_pet_clips');
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [isGeneratingCanvasVideo, setIsGeneratingCanvasVideo] = useState(false);
  const [canvasGenProgress, setCanvasGenProgress] = useState(0);
  const [petClips, setPetClips] = useState<Array<{ id: string; filename: string; name: string; url: string; type: string }>>([]);
  const [selectedPetClip, setSelectedPetClip] = useState<string>('/media/pet-clips/5.mp4');
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const videoFileInputRef = React.useRef<HTMLInputElement>(null);
  const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [textPosition, setTextPosition] = useState<'bottom' | 'top'>('bottom');
  const [isSavingClip, setIsSavingClip] = useState(false);
  const [showCardOverlay, setShowCardOverlay] = useState<Record<string, boolean>>({});
  const [selectedVoiceType, setSelectedVoiceType] = useState<'google_vi' | 'edge_natural'>('google_vi');
  const [ttsAudio, setTtsAudio] = useState<HTMLAudioElement | null>(null);
  const [tiktokPublishModalPost, setTiktokPublishModalPost] = useState<SocialPost | null>(null);
  const [renderingPost, setRenderingPost] = useState<SocialPost | null>(null);
  const [renderProgress, setRenderProgress] = useState<{ percent: number; status: string }>({ percent: 0, status: '' });

  // Check saved login
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('dvd_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data on login or refresh
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrders, resArticles, resSocial] = await Promise.all([
        fetch('/api/admin/products').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/admin/articles').then((r) => r.json()),
        fetch('/api/admin/social-posts').then((r) => r.json()).catch(() => ({ success: false }))
      ]);

      if (resProd.success) setProducts(resProd.products);
      if (resOrders.success) setOrders(resOrders.orders);
      if (resArticles.success) setArticles(resArticles.articles);
      if (resSocial.success && resSocial.posts) setSocialPosts(resSocial.posts);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // Handle PIN Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'dvd2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dvd_admin_auth', 'true');
      setLoginError('');
      showNotification('Đăng nhập trang quản trị DVDmultilPET thành công!');
    } else {
      setLoginError('Mã PIN không chính xác! Vui lòng thử lại.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dvd_admin_auth');
    setPin('');
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.name || !pForm.price) {
      alert('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProduct.id,
            name: pForm.name,
            category: pForm.category,
            petType: pForm.petType,
            price: Number(pForm.price),
            originalPrice: pForm.originalPrice ? Number(pForm.originalPrice) : undefined,
            weight: pForm.weight,
            image: pForm.image || editingProduct.image,
            shortDesc: pForm.shortDesc,
            inStock: pForm.inStock
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Đã cập nhật sản phẩm: ${pForm.name}`);
          setEditingProduct(null);
          setShowAddProductModal(false);
          fetchData();
        }
      } else {
        // Create product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pForm)
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Đã thêm mới sản phẩm: ${pForm.name}`);
          setShowAddProductModal(false);
          fetchData();
        }
      }
    } catch (err) {
      showNotification('Lỗi lưu sản phẩm', 'error');
    }
  };

  const handleQuickPriceUpdate = async (product: Product, newPrice: number) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, price: newPrice })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã cập nhật giá "${product.name}" thành ${newPrice.toLocaleString('vi-VN')}₫`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi cập nhật giá', 'error');
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, inStock: !product.inStock })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã chuyển trạng thái: ${!product.inStock ? 'Còn hàng' : 'Hết hàng'}`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi đổi trạng thái tồn kho', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}" khỏi kho không?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã xóa sản phẩm: ${name}`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi xóa sản phẩm', 'error');
    }
  };

  // --- ORDER ACTIONS ---
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã cập nhật đơn hàng ${orderId} sang trạng thái mới!`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi cập nhật trạng thái đơn', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đơn hàng ${orderId} không?`)) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã xóa đơn hàng: ${orderId}`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi xóa đơn hàng', 'error');
    }
  };

  // --- ARTICLE ACTIONS ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aForm.title || !aForm.summary || !aForm.content) {
      alert('Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung');
      return;
    }

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aForm)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã đăng bài viết mới: ${aForm.title}`);
        setShowAddArticleModal(false);
        setAForm({ title: '', summary: '', content: '', category: 'Chăm Sóc & Dinh Dưỡng', targetPet: 'all', featuredImage: '' });
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi đăng bài viết', 'error');
    }
  };

  const handleTriggerAiArticle = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/cron/auto-publish', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification(`AI Bác Sĩ đã tự động viết bài mới: "${data.article.title}"`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi tạo bài viết AI', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}" không?`)) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification(`Đã xóa bài viết thành công!`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi xóa bài viết', 'error');
    }
  };

  // --- AI CATALOG & PRICE QUOTE SCANNER ACTIONS ---
  const handleFileProcess = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      alert('Kích thước file quá lớn (tối đa 25MB). Vui lòng chọn file nhẹ hơn.');
      return;
    }

    const detectedType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      setScanFile({
        name: file.name,
        dataUrl: reader.result as string,
        type: detectedType,
        size: file.size
      });
      showNotification(`✓ Đã nạp file "${file.name}" thành công! Bấm "Bắt Đầu Quét Bằng AI" để trích xuất.`);
    };
    reader.onerror = () => {
      showNotification('Không thể đọc file này, vui lòng thử lại', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleScanFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleTriggerScan = async () => {
    if (scanTab === 'file' && !scanFile) {
      alert('Vui lòng chọn hoặc tải lên hình ảnh / file PDF bảng giá cần quét');
      return;
    }
    if (scanTab === 'text' && !scanRawText.trim()) {
      alert('Vui lòng nhập hoặc dán nội dung văn bản báo giá');
      return;
    }

    setScanLoading(true);
    try {
      const payload: any = {};
      if (scanTab === 'file' && scanFile) {
        payload.fileData = scanFile.dataUrl;
        payload.fileType = scanFile.type;
      } else {
        payload.rawText = scanRawText;
      }

      const res = await fetch('/api/admin/scan-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        setScannedItems(data.items);
        setScanStep('review');
        showNotification(`AI đã trích xuất thành công ${data.items.length} sản phẩm! Vui lòng kiểm tra và duyệt.`);
      } else {
        showNotification(data.error || 'Không trích xuất được sản phẩm nào từ tài liệu này', 'error');
      }
    } catch (err) {
      console.error('Lỗi quét tài liệu:', err);
      showNotification('Có lỗi khi gửi tài liệu tới AI', 'error');
    } finally {
      setScanLoading(false);
    }
  };

  const handleLoadSampleCatalog = () => {
    setScanRawText(`BẢNG BÁO GIÁ ĐẠI LÝ THÁNG 9/2026 - PHÂN PHỐI PETCARE VIỆT NAM
1. Hạt Mèo Royal Canin Mother & Babycat 2kg - Giá bán: 385.000đ (Giá niêm yết: 420.000đ)
2. Pate Monge Vịt Tươi Nguyên Chất Cho Chó Mèo 400g - Giá bán: 52.000đ
3. Hạt Trị Liệu Cho Mèo Bị Sỏi Thận Royal Canin Urinary S/O 1.5kg - Giá bán: 450.000đ
4. Sữa Tắm Khử Mùi & Dưỡng Lông SOS 530ml - Giá bán: 125.000đ
5. Máy Lọc Nước Tuần Hoàn Khử Khoáng 2.5L - Giá bán: 380.000đ
6. Cát Đậu Nành Vệ Sinh Mèo Cature Hút Mùi Vón Tốt 6L - Giá bán: 135.000đ
7. Bánh Thưởng Xương Gặm Sạch Răng Cho Chó SmartBones 100g - Giá bán: 65.000đ
8. Cần Câu Chuông Gắn Lông Vũ Đồ Chơi Cho Mèo - Giá bán: 45.000đ`);
    setScanTab('text');
  };

  const handleToggleSelectAll = (selectAll: boolean) => {
    setScannedItems((prev) => prev.map((item) => ({ ...item, selected: selectAll })));
  };

  const handleToggleItem = (tempId: string) => {
    setScannedItems((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleUpdateScannedItem = (tempId: string, field: string, val: any) => {
    setScannedItems((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, [field]: val } : item))
    );
  };

  const handleDeleteScannedRow = (tempId: string) => {
    setScannedItems((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleAddManualRow = () => {
    const newItem = {
      tempId: `manual-${Date.now()}`,
      name: 'Sản phẩm mới bổ sung',
      price: 100000,
      originalPrice: undefined,
      weight: '1kg',
      category: 'dry_kibble',
      petType: 'all' as const,
      shortDesc: 'Sản phẩm dinh dưỡng và phụ kiện chất lượng cao.',
      selected: true
    };
    setScannedItems((prev) => [...prev, newItem]);
  };

  const handleApproveAndImport = async () => {
    const approved = scannedItems.filter((i) => i.selected);
    if (approved.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 sản phẩm để phê duyệt nhập kho');
      return;
    }

    setIsImporting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: approved })
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`🎉 Đã phê duyệt và nhập thành công ${approved.length} sản phẩm vào kho hàng!`);
        setShowScanModal(false);
        setScanStep('input');
        setScanFile(null);
        setScanRawText('');
        setScannedItems([]);
        fetchData();
      } else {
        showNotification(data.error || 'Lỗi lưu sản phẩm vào kho', 'error');
      }
    } catch (err) {
      console.error('Error importing products:', err);
      showNotification('Có lỗi khi lưu sản phẩm', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // --- SOCIAL POSTS & AI VIDEO SCRIPT ACTIONS ---
  const handleGenerateSocialPost = async () => {
    setSocialGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialForm)
      });
      const data = await res.json();
      if (data.success && data.post) {
        setGeneratedPost(data.post);
        showNotification(`AI Bác Sĩ đã sáng tạo thành công kịch bản / bài đăng ${socialForm.platform.toUpperCase()}!`);
      } else {
        showNotification(data.error || 'Lỗi sinh nội dung', 'error');
      }
    } catch (err) {
      showNotification('Lỗi kết nối tới AI sáng tạo nội dung', 'error');
    } finally {
      setSocialGenerating(false);
    }
  };

  const handleSaveSocialPost = async () => {
    if (!generatedPost || !generatedPost.title || !generatedPost.content) {
      alert('Vui lòng tạo hoặc điền đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      const res = await fetch('/api/admin/social-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedPost)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Đã lưu bài đăng vào kho Supabase thành công!');
        setShowGenerateSocialModal(false);
        setGeneratedPost(null);
        fetchData();
      } else {
        showNotification(data.error || 'Lỗi lưu bài đăng', 'error');
      }
    } catch (err) {
      showNotification('Lỗi lưu bài đăng', 'error');
    }
  };

  const handleCopySocialContent = (post: SocialPost) => {
    const fullText = `${post.hookText ? `📢 ${post.hookText}\n\n` : ''}${post.content}\n\n🛒 Link đặt mua chính hãng tại DVDmultilPET:\n${post.targetUrl || 'https://thucungtot.net/products'}\n\n${post.hashtags?.join(' ') || ''}`;
    navigator.clipboard.writeText(fullText.trim());
    setCopiedPostId(post.id);
    showNotification('📋 Đã sao chép nội dung bài đăng vào clipboard! Bạn có thể dán ngay vào TikTok/Facebook.');
    setTimeout(() => setCopiedPostId(null), 3000);
  };

  const handleUpdateSocialStatus = async (id: string, newStatus: 'draft' | 'published', publishedUrl?: string) => {
    try {
      const res = await fetch('/api/admin/social-posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, publishedUrl })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(newStatus === 'published' ? 'Đã đánh dấu: Đã Đăng lên mạng xã hội!' : 'Đã chuyển về bản nháp');
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleDeleteSocialPost = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài đăng "${title}" không?`)) return;
    try {
      const res = await fetch(`/api/admin/social-posts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Đã xóa bài đăng khỏi kho lưu trữ!');
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi xóa bài đăng', 'error');
    }
  };

  // --- TIKTOK VIDEO STUDIO & SCHEDULING HANDLERS ---
  const handleScheduleSlot = async (postId: string, slot: string) => {
    try {
      const res = await fetch('/api/admin/social-posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, status: 'scheduled', scheduledAt: slot })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`⏰ Đã lên lịch video TikTok vào khung giờ vàng ${slot}! Trạng thái: Hẹn Giờ.`);
        fetchData();
      }
    } catch (err) {
      showNotification('Lỗi cập nhật lịch đăng', 'error');
    }
  };

  const handleUploadVideo = async (file: File, postId: string) => {
    if (!file) return;
    setVideoUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('postId', postId);

      const res = await fetch('/api/admin/social-posts/upload-video', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🎬 Đã lưu trữ video thành công vào hệ thống DVDmultilPET!');
        fetchData();
        setShowVideoModal(false);
      } else {
        showNotification(data.error || 'Lỗi lưu trữ video', 'error');
      }
    } catch (err: any) {
      showNotification('Có lỗi khi tải video lên hệ thống', 'error');
    } finally {
      setVideoUploadLoading(false);
    }
  };

  const triggerDownloadAndOpenTikTok = (post: SocialPost, mode: 'now' | 'schedule' = 'now') => {
    const fullText = `${post.title}\n\n${post.hookText ? `"${post.hookText}"\n\n` : ''}🛒 Đặt mua chính hãng tại DVDmultilPET:\n${post.targetUrl || 'https://thucungtot.net/products'}\n\n${post.hashtags?.map((h) => `#${h.replace(/^#/, '')}`).join(' ') || ''}`;
    navigator.clipboard.writeText(fullText.trim());

    if (post.mediaUrls && post.mediaUrls.length > 0) {
      const a = document.createElement('a');
      a.href = post.mediaUrls[0];
      a.download = `tiktok-${post.id}-co-chu-va-giong-ai.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    window.open('https://www.tiktok.com/creator-center/upload', '_blank');
    setTiktokPublishModalPost(post);

    if (mode === 'now') {
      showNotification(
        `⚡ Đã tải video hoàn chỉnh & chép kịch bản! Kéo video vào TikTok và bấm "ĐĂNG" để lên sóng ngay!`
      );
    } else {
      showNotification(
        `⏰ Đã chép nội dung & tải video hoàn chỉnh! Hãy kéo thả video vào TikTok và bật "Lên lịch video" vào lúc ${post.scheduledAt || '18:00'}.`
      );
    }
  };

  const executeRenderVideo = async (
    post: SocialPost,
    andPublish: boolean = false,
    publishMode: 'now' | 'schedule' = 'now'
  ) => {
    setRenderingPost(post);
    setRenderProgress({ percent: 5, status: 'Đang tải âm thanh giọng đọc AI...' });

    try {
      const videoSrc = post.mediaUrls?.[0] || '/media/pet-clips/5.mp4';
      const voiceText = `${post.hookText || post.title}. ${post.title}. Bấm vào đường link trong phần mô tả để đặt mua chính hãng tại DVDmultilPET nha!`;
      const ttsUrl = `/api/admin/tts?text=${encodeURIComponent(voiceText)}`;

      // 1. Tải và giải mã âm thanh giọng đọc AI
      const audioRes = await fetch(ttsUrl);
      if (!audioRes.ok) throw new Error('Không thể tải giọng đọc AI');
      const audioArrayBuffer = await audioRes.arrayBuffer();

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer.slice(0));

      setRenderProgress({ percent: 15, status: 'Đang chuẩn bị cảnh quay video...' });

      // 2. Tải video cảnh quay gốc
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoSrc;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error('Không thể tải video cảnh quay'));
      });

      // Kích thước chuẩn khung hình dọc TikTok 9:16 (720 x 1280)
      const W = 720;
      const H = 1280;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D');

      // 3. Kết nối luồng âm thanh AI vào bộ xuất
      const audioDest = audioCtx.createMediaStreamDestination();
      const audioSource = audioCtx.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioDest);

      // 4. Kết hợp luồng hình ảnh canvas và luồng âm thanh
      const canvasStream = canvas.captureStream(30);
      const audioTrack = audioDest.stream.getAudioTracks()[0];
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }

      // 5. Thiết lập bộ mã hóa video MediaRecorder
      let mimeType = 'video/webm';
      let fileExt = 'webm';
      if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
        mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        fileExt = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        fileExt = 'mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')) {
        mimeType = 'video/webm; codecs=vp9,opus';
        fileExt = 'webm';
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 3500000
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const duration = Math.min(Math.max(video.duration || 6, audioBuffer.duration || 6), 18);

      setRenderProgress({ percent: 25, status: 'Đang ghép chữ chạy & lồng tiếng AI...' });

      const roundRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
      };

      const wrapText = (c: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 2) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = c.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            c.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
            lineCount++;
            if (lineCount >= maxLines - 1 && n < words.length - 1) {
              line += '...';
              break;
            }
          } else {
            line = testLine;
          }
        }
        c.fillText(line, x, currentY);
      };

      let isRecording = true;
      let animId: number;

      const renderLoop = () => {
        if (!isRecording) return;

        // 1. Cắt ghép cảnh quay video căn giữa vừa khung dọc 9:16
        const vRatio = (video.videoWidth || 1) / (video.videoHeight || 1);
        const cRatio = W / H;
        let dw = W, dh = H, dx = 0, dy = 0;
        if (vRatio > cRatio) {
          dh = H;
          dw = H * vRatio;
          dx = (W - dw) / 2;
        } else {
          dw = W;
          dh = W / vRatio;
          dy = (H - dh) / 2;
        }
        ctx.drawImage(video, dx, dy, dw, dh);

        // 2. Ghép chữ trên cùng: Bác Sĩ Cảnh Báo & Hook 3s
        ctx.save();
        roundRect(ctx, 35, 45, 270, 48, 24);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️ BÁC SĨ CẢNH BÁO', 170, 70);

        roundRect(ctx, W - 275, 45, 240, 48, 24);
        ctx.fillStyle = 'rgba(219, 39, 119, 0.95)';
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
        ctx.fillText('🎙️ Giọng AI Bác Sĩ', W - 155, 70);

        const hook = post.hookText || post.title;
        roundRect(ctx, 35, 105, W - 70, 115, 24);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        wrapText(ctx, `"${hook}"`, 55, 125, W - 110, 36, 2);

        // 3. Phần giữa 100% trong suốt để lộ thú cưng

        // 4. Ghép chữ dưới cùng: Thẻ sản phẩm & Nút Giỏ Hàng
        roundRect(ctx, 35, H - 290, W - 70, 130, 24);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 23px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const displayTitle = post.title.length > 44 ? post.title.slice(0, 42) + '...' : post.title;
        ctx.fillText(displayTitle, 55, H - 272);

        const priceMatch = post.content.match(/\d+[\d.,]*\s*[₫đ]/)?.[0] || 'Giá ưu đãi hôm nay';
        ctx.fillStyle = '#fb7185';
        ctx.font = 'bold 26px "Segoe UI", Arial, sans-serif';
        ctx.fillText(priceMatch, 55, H - 225);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('✓ Chính hãng DVDmultilPET', W - 55, H - 222);

        roundRect(ctx, 35, H - 145, W - 70, 75, 20);
        const grad = ctx.createLinearGradient(35, 0, W - 35, 0);
        grad.addColorStop(0, '#e11d48');
        grad.addColorStop(0.5, '#db2777');
        grad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 27px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👉 BẤM LINK TRONG MÔ TẢ ĐỂ ĐẶT MUA', W / 2, H - 107);

        ctx.restore();

        const elapsed = video.currentTime || 0;
        const pct = Math.min(95, Math.round(25 + (elapsed / duration) * 70));
        setRenderProgress({
          percent: pct,
          status: `Đang kết xuất video TikTok: ${Math.round(elapsed)}s / ${Math.round(duration)}s...`
        });

        animId = requestAnimationFrame(renderLoop);
      };

      const renderedPromise = new Promise<{ blob: Blob; filename: string }>((resolve) => {
        recorder.onstop = () => {
          isRecording = false;
          cancelAnimationFrame(animId);
          video.pause();
          audioCtx.close().catch(() => {});

          const outputBlob = new Blob(chunks, { type: mimeType });
          const filename = `tiktok-${post.id}-co-chu-va-giong-ai.${fileExt}`;
          resolve({ blob: outputBlob, filename });
        };
      });

      recorder.start(200);
      audioSource.start(0);
      video.currentTime = 0;
      await video.play();

      renderLoop();

      video.onended = () => {
        if (video.currentTime < duration - 0.5) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else if (recorder.state === 'recording') {
          recorder.stop();
        }
      };

      const stopTimer = setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, duration * 1000 + 300);

      const { blob, filename } = await renderedPromise;
      clearTimeout(stopTimer);

      setRenderProgress({ percent: 98, status: 'Đang lưu trữ video vào hệ thống...' });

      // Lưu trữ file video lên hệ thống backend
      const formData = new FormData();
      formData.append('video', blob, filename);
      formData.append('postId', post.id);

      const uploadRes = await fetch('/api/admin/social-posts/upload-video', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      // Kích hoạt tải file MP4 thật về máy tính
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setRenderProgress({ percent: 100, status: 'Đã hoàn tất xuất sắc!' });
      showNotification('🎉 Đã đóng gói thành công video có chữ chạy và giọng AI Bác Sĩ!');
      fetchData();

      if (andPublish) {
        const updatedPost = uploadData.post || {
          ...post,
          mediaUrls: [uploadData.videoUrl || downloadUrl, ...(post.mediaUrls || [])]
        };
        triggerDownloadAndOpenTikTok(updatedPost, publishMode);
      }
    } catch (err: any) {
      console.error('Error rendering TikTok video:', err);
      showNotification(`Lỗi xuất video: ${err.message || 'Vui lòng thử lại'}`, 'error');
    } finally {
      setRenderingPost(null);
    }
  };

  const handlePublishTikTokWithVideo = async (post: SocialPost, mode: 'now' | 'schedule' = 'now') => {
    const isRendered =
      Boolean(post.mediaUrls?.[0]?.startsWith('/uploads/videos/')) ||
      Boolean(post.mediaUrls?.[0]?.includes('co-chu'));

    if (!isRendered && post.mediaUrls && post.mediaUrls.length > 0) {
      showNotification('🎬 Đang tự động ghép chữ chạy & giọng AI vào video trước khi đẩy lên TikTok...');
      await executeRenderVideo(post, true, mode);
      return;
    }

    triggerDownloadAndOpenTikTok(post, mode);
  };

  // Fetch local media clips from E:\Thú cưng
  useEffect(() => {
    fetch('/api/admin/media-library')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.clips) && d.clips.length > 0) {
          setPetClips(d.clips);
          setSelectedPetClip(d.clips[0].url);
        }
      })
      .catch(() => {});
  }, []);

  const handleAttachClipToPost = async (clipUrl: string, postId: string) => {
    setIsSavingClip(true);
    try {
      // Cập nhật ngay lập tức giao diện (Optimistic update)
      setSocialPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, mediaUrls: [clipUrl] } : p))
      );

      const res = await fetch('/api/admin/social-posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, mediaUrls: [clipUrl] })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🎬 Đã gắn video cảnh quay thực tế và lưu trữ thành công vào bài đăng TikTok!');
        setShowVideoModal(false);
        await fetchData();
      } else {
        showNotification(data.error || 'Lỗi lưu trữ video', 'error');
      }
    } catch (err: any) {
      showNotification('Lỗi lưu trữ video: ' + (err.message || ''), 'error');
    } finally {
      setIsSavingClip(false);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const viVoice =
        voices.find((v) => (v.name.includes('Natural') || v.name.includes('HoaiMy') || v.name.includes('NamMinh')) && (v.lang.includes('vi') || v.lang.includes('VI'))) ||
        voices.find((v) => v.lang === 'vi-VN' || v.lang.startsWith('vi')) ||
        voices.find((v) => v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt'));

      if (viVoice) {
        utterance.voice = viVoice;
      }
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingVoice(true);
      utterance.onend = () => setIsSpeakingVoice(false);
      utterance.onerror = () => setIsSpeakingVoice(false);
      window.speechSynthesis.speak(utterance);
    } else {
      showNotification('Không thể phát âm thanh trên thiết bị này', 'error');
      setIsSpeakingVoice(false);
    }
  };

  const handlePlayVoiceover = (text: string) => {
    // Nếu đang phát thì bấm là dừng ngay
    if (isSpeakingVoice) {
      if (ttsAudio) {
        ttsAudio.pause();
        ttsAudio.currentTime = 0;
        setTtsAudio(null);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingVoice(false);
      return;
    }

    // Ưu tiên 1: Giọng đọc AI Tiếng Việt chuẩn phát âm (Google TTS Server Route)
    if (selectedVoiceType === 'google_vi') {
      setIsSpeakingVoice(true);
      const audioUrl = `/api/admin/tts?text=${encodeURIComponent(text)}`;
      const audio = new Audio(audioUrl);
      setTtsAudio(audio);
      audio.onended = () => {
        setIsSpeakingVoice(false);
        setTtsAudio(null);
      };
      audio.onerror = () => {
        fallbackWebSpeech(text);
      };
      audio.play().catch(() => {
        fallbackWebSpeech(text);
      });
      return;
    }

    // Ưu tiên 2: Giọng Microsoft Natural / Web Speech
    fallbackWebSpeech(text);
  };

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.status === 'payment_received' || o.status === 'completed' || o.status === 'shipping')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_payment').length;

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchSearch && matchCategory;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-300">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest">
              Khu Vực Quản Trị Viên
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">DVDmultilPET Admin</h1>
            <p className="text-xs text-slate-500 mt-1">
              Nhập mã PIN bảo mật của bạn để quản lý sản phẩm, giá bán và đơn hàng
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã PIN Quản Trị *</label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Mã PIN mặc định: dvd2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500 font-mono tracking-widest text-center text-lg"
              />
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-rose-600 text-center bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Mở Bảng Điều Khiển
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
            <p>Mã PIN bảo mật khởi tạo: <strong className="text-slate-700 font-mono">dvd2026</strong></p>
            <Link href="/" className="inline-block mt-3 text-orange-600 hover:underline font-semibold">
              ← Quay lại cửa hàng thucungtot.net
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2 animate-slide-in text-white ${
            message.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-sm">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">DVDmultilPET</span>
                <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                  Admin Panel
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Hệ thống Quản Trị & Kho Dữ Liệu Bán Hàng</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Xem Web</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            </Link>

            <button
              onClick={fetchData}
              disabled={loading}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors"
              title="Tải lại dữ liệu mới nhất"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 px-3 py-1.5 rounded-xl transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-slate-800/80 border-t border-slate-700/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 sm:space-x-4 py-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Tổng Quan</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>2. Sản Phẩm & Báo Giá ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>3. Đơn Đặt Hàng ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Cẩm Nang & AI ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'social'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Share2 className="w-4 h-4 text-pink-300" />
              <span>5. Kịch Bản & MXH ({socialPosts.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500">Doanh Thu Tích Lũy</p>
                <h3 className="text-2xl font-black text-slate-900">
                  {totalRevenue.toLocaleString('vi-VN')}₫
                </h3>
                <p className="text-[11px] text-emerald-600 font-semibold">Tự động tính từ các đơn đặt hàng</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500">Tổng Đơn Hàng</p>
                <h3 className="text-2xl font-black text-slate-900">{orders.length} đơn</h3>
                <p className="text-[11px] text-orange-600 font-semibold">
                  {pendingOrdersCount} đơn chờ nhận tiền VietQR
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500">Sản Phẩm Trong Kho</p>
                <h3 className="text-2xl font-black text-slate-900">{products.length} món</h3>
                <p className="text-[11px] text-blue-600 font-semibold">Đầy đủ thức ăn & phụ kiện</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500">Bài Viết Cẩm Nang</p>
                <h3 className="text-2xl font-black text-slate-900">{articles.length} bài</h3>
                <p className="text-[11px] text-purple-600 font-semibold">Chuẩn y khoa & AI tự động</p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders List */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" /> Đơn Hàng Mới Nhất
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    Xem tất cả ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">Chưa có đơn hàng nào.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-slate-900">{o.id}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                o.paymentMethod === 'vietqr'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {o.paymentMethod === 'vietqr' ? 'VietQR' : 'COD'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                o.status === 'payment_received'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'shipping'
                                  ? 'bg-blue-100 text-blue-800'
                                  : o.status === 'completed'
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {o.status === 'pending_payment'
                                ? 'Chờ thanh toán'
                                : o.status === 'payment_received'
                                ? 'Đã nhận tiền'
                                : o.status === 'shipping'
                                ? 'Đang giao'
                                : 'Hoàn thành'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {o.customerName} • 📞 {o.phone} • {o.items.length} món
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-orange-600">
                            {o.totalAmount.toLocaleString('vi-VN')}₫
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {new Date(o.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-slate-900 text-base">Thao Tác Nhanh Chủ Shop</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setGeneratedPost(null);
                      setShowGenerateSocialModal(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-pink-200 flex items-center justify-center gap-2 transition-all group cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-pink-200 transition-transform group-hover:scale-110" />
                    <span>🎬 AI Soạn Kịch Bản Video & Bài Đăng MXH</span>
                  </button>

                  <button
                    onClick={() => {
                      setScanStep('input');
                      setShowScanModal(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all group"
                  >
                    <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>📸 Quét Báo Giá / Catalog (AI Vision)</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setPForm({
                        name: '',
                        category: 'dry_kibble',
                        petType: 'cat',
                        price: '',
                        originalPrice: '',
                        weight: '1.5kg',
                        image: '',
                        shortDesc: '',
                        inStock: true
                      });
                      setShowAddProductModal(true);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                  </button>

                  <button
                    onClick={() => setShowAddArticleModal(true)}
                    className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit3 className="w-4 h-4" /> Viết Bài Cẩm Nang Mới
                  </button>

                  <button
                    onClick={handleTriggerAiArticle}
                    disabled={aiGenerating}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : ''}`} />
                    <span>{aiGenerating ? 'AI Đang viết bài...' : 'Bác Sĩ AI Tự Động Viết Bài Ngay'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Trạng thái dữ liệu:
                  </p>
                  <p>• Dữ liệu đang lưu tại: <code className="text-orange-600">data/store.json</code></p>
                  <p>• Tên miền online: <strong className="text-slate-900">thucungtot.net</strong></p>
                  <p>• Mọi thay đổi ở đây đều có hiệu lực ngay!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ SẢN PHẨM & BÁO GIÁ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Quản Lý Sản Phẩm & Báo Giá</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Điều chỉnh giá bán, tồn kho hoặc thêm các mặt hàng mới vào gian hàng
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setScanStep('input');
                    setShowScanModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all"
                >
                  <Camera className="w-4 h-4" /> 📸 Quét Báo Giá / Catalog (AI)
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setPForm({
                      name: '',
                      category: 'dry_kibble',
                      petType: 'cat',
                      price: '',
                      originalPrice: '',
                      weight: '1.5kg',
                      image: '',
                      shortDesc: '',
                      inStock: true
                    });
                    setShowAddProductModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-200 transition-all"
                >
                  <Plus className="w-4 h-4" /> Thêm Thủ Công
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SKU..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="dry_kibble">🌾 Hạt khô</option>
                <option value="wet_pate">🥫 Pate tươi</option>
                <option value="dietary">🏥 Hạt trị liệu</option>
                <option value="treats">🦴 Bánh thưởng</option>
                <option value="feeding_tools">🥣 Bát ăn & Máy lọc nước</option>
                <option value="hygiene_litter">🚽 Khay cát & Vệ sinh</option>
                <option value="toys_scratchers">🧶 Đồ chơi & Cào móng</option>
                <option value="grooming_health">🧴 Sữa tắm & Da móng</option>
                <option value="accessories_collars">🦮 Vòng cổ & Dây dắt</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-700 uppercase">
                    <tr>
                      <th className="p-4">Sản Phẩm</th>
                      <th className="p-4">Mã SKU / Quy cách</th>
                      <th className="p-4">Giá Bán Thực Tế</th>
                      <th className="p-4">Giá Gốc</th>
                      <th className="p-4">Tồn Kho</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                            <span className="text-[10px] text-orange-600 font-semibold uppercase">
                              {p.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-slate-700">{p.sku}</span>
                          <p className="text-[10px] text-slate-400">{p.weight}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-orange-600 text-sm">
                              {p.price.toLocaleString('vi-VN')}₫
                            </span>
                            <button
                              onClick={() => {
                                const newPriceStr = prompt(`Nhập giá bán mới cho "${p.name}" (VNĐ):`, p.price.toString());
                                if (newPriceStr && !isNaN(Number(newPriceStr))) {
                                  handleQuickPriceUpdate(p, Number(newPriceStr));
                                }
                              }}
                              className="p-1 rounded-lg hover:bg-orange-100 text-slate-400 hover:text-orange-600"
                              title="Sửa nhanh giá bán"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 line-through">
                          {p.originalPrice ? `${p.originalPrice.toLocaleString('vi-VN')}₫` : '-'}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              p.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {p.inStock ? '✓ Còn Hàng' : '✕ Hết Hàng'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setPForm({
                                name: p.name,
                                category: p.category,
                                petType: p.petType,
                                price: p.price.toString(),
                                originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
                                weight: p.weight,
                                image: p.image,
                                shortDesc: p.shortDesc,
                                inStock: p.inStock
                              });
                              setShowAddProductModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            title="Sửa thông tin sản phẩm"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Danh Sách Đơn Đặt Hàng</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Theo dõi các đơn hàng khách vừa đặt qua mã VietQR hoặc nhận thanh toán COD
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="all">Tất cả trạng thái ({orders.length})</option>
                  <option value="pending_payment">⏳ Chờ thanh toán VietQR</option>
                  <option value="payment_received">💰 Đã nhận tiền</option>
                  <option value="shipping">🚚 Đang giao hàng</option>
                  <option value="completed">🎉 Đã hoàn thành</option>
                  <option value="cancelled">❌ Đã hủy</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                Không tìm thấy đơn hàng nào với bộ lọc này.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-orange-200 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-base text-slate-900">{ord.id}</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            ord.paymentMethod === 'vietqr'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {ord.paymentMethod === 'vietqr' ? '💳 VietQR Chuyển Khoản' : '💵 Tiền Mặt COD'}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                            ord.status === 'payment_received'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'shipping'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'completed'
                              ? 'bg-slate-100 text-slate-800'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status === 'pending_payment'
                            ? 'Chờ thanh toán VietQR'
                            : ord.status === 'payment_received'
                            ? 'Đã nhận chuyển khoản'
                            : ord.status === 'shipping'
                            ? 'Đang giao hàng'
                            : ord.status === 'completed'
                            ? 'Hoàn thành'
                            : 'Đã hủy'}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-700">
                      {/* Customer info */}
                      <div className="md:col-span-4 space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="font-bold text-slate-900 text-sm">👤 {ord.customerName}</p>
                        <p className="text-orange-600 font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <a href={`tel:${ord.phone}`} className="hover:underline">
                            {ord.phone}
                          </a>
                        </p>
                        <p className="text-slate-500 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{ord.address}</span>
                        </p>
                        {ord.note && <p className="text-slate-400 italic">Ghi chú: "{ord.note}"</p>}
                      </div>

                      {/* Items list */}
                      <div className="md:col-span-5 space-y-2">
                        <p className="font-bold text-slate-900">Danh sách sản phẩm ({ord.items.length} món):</p>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-700 line-clamp-1">
                                {it.name} <strong className="text-slate-900">x{it.quantity}</strong>
                              </span>
                              <span className="font-bold text-slate-800 shrink-0 ml-2">
                                {(it.price * it.quantity).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price & Action Buttons */}
                      <div className="md:col-span-3 flex flex-col justify-between items-end text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
                        <div>
                          <p className="text-slate-400 text-[11px]">Tổng thanh toán</p>
                          <p className="text-xl font-black text-orange-600">
                            {ord.totalAmount.toLocaleString('vi-VN')}₫
                          </p>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap gap-1.5 justify-end mt-3">
                          {ord.status === 'pending_payment' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'payment_received')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm"
                            >
                              ✓ Đã nhận tiền
                            </button>
                          )}

                          {ord.status === 'payment_received' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'shipping')}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm"
                            >
                              🚚 Giao hàng
                            </button>
                          )}

                          {ord.status === 'shipping' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-black text-white font-bold text-[11px] shadow-sm"
                            >
                              🎉 Đã giao xong
                            </button>
                          )}

                          {ord.status !== 'cancelled' && ord.status !== 'completed' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="px-2 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-[11px] font-semibold"
                            >
                              Hủy đơn
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CẨM NANG & BÁC SĨ AI */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cẩm Nang Thú Y & AI Tự Động</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kho bài viết kiến thức chăm sóc thú cưng kết hợp hệ thống AI tự động đăng bài
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerAiArticle}
                  disabled={aiGenerating}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md"
                >
                  <Sparkles className={`w-4 h-4 ${aiGenerating ? 'animate-spin' : ''}`} />
                  <span>{aiGenerating ? 'AI đang viết...' : '⚡ Bác Sĩ AI Viết Bài Mới'}</span>
                </button>

                <button
                  onClick={() => setShowAddArticleModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-200"
                >
                  <Plus className="w-4 h-4" /> Soạn Bài Mới
                </button>
              </div>
            </div>

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        {art.category}
                      </span>
                      {art.isAiGenerated && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-orange-600" /> Do AI Tự Đăng
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(art.publishedAt).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${art.slug}`}
                        target="_blank"
                        className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem bài
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: KỊCH BẢN VIDEO & BÀI ĐĂNG MXH (TIKTOK, FACEBOOK, ZALO) */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    Kho Kịch Bản Video & Bài Đăng Mạng Xã Hội
                  </h2>
                  <span className="text-[11px] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Supabase Cloud
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kịch bản TikTok/Reels có hook 3s viral, bài viết Facebook chuyên sâu và broadcast Zalo do Bác Sĩ AI tạo tự động.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedPost(null);
                    setShowGenerateSocialModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-200 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  <span>AI Sáng Tạo Kịch Bản / Bài Đăng Mới</span>
                </button>
              </div>
            </div>

            {/* Platform & Status Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSocialFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    socialFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tất cả ({socialPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialFilter('tiktok')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    socialFilter === 'tiktok'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>TikTok ({socialPosts.filter((p) => p.platform === 'tiktok').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSocialFilter('facebook')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    socialFilter === 'facebook'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-200" />
                  <span>Facebook ({socialPosts.filter((p) => p.platform === 'facebook').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSocialFilter('zalo')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    socialFilter === 'zalo'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-sky-200" />
                  <span>Zalo ({socialPosts.filter((p) => p.platform === 'zalo').length})</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 px-2 flex items-center gap-3">
                <span>
                  🟢 Đã đăng:{' '}
                  <strong className="text-emerald-600">
                    {socialPosts.filter((p) => p.status === 'published').length}
                  </strong>
                </span>
                <span>
                  🟡 Bản nháp:{' '}
                  <strong className="text-amber-600">
                    {socialPosts.filter((p) => p.status === 'draft').length}
                  </strong>
                </span>
              </div>
            </div>

            {/* Social Posts Grid */}
            {socialPosts.filter((p) => socialFilter === 'all' || p.platform === socialFilter).length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
                  <Share2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  Chưa có kịch bản hoặc bài đăng nào trong mục này
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Nhấn nút bên dưới để Bác Sĩ AI sáng tạo ngay kịch bản TikTok chuẩn viral, bài đăng Facebook hay thông điệp Zalo kèm link sản phẩm.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedPost(null);
                    setShowGenerateSocialModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-200 transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Soạn Kịch Bản Mới Bằng AI
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialPosts
                  .filter((p) => socialFilter === 'all' || p.platform === socialFilter)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Platform & Status Badge */}
                        <div className="flex items-center justify-between gap-2">
                          {post.platform === 'tiktok' && (
                            <span className="bg-black text-white px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-2xs">
                              <Video className="w-3.5 h-3.5 text-rose-400" /> TikTok Video
                            </span>
                          )}
                          {post.platform === 'facebook' && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-2xs">
                              <Share2 className="w-3.5 h-3.5 text-blue-600" /> Facebook Post
                            </span>
                          )}
                          {post.platform === 'zalo' && (
                            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-2xs">
                              <Send className="w-3.5 h-3.5 text-sky-600" /> Zalo Tin Nhắn
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            {post.status === 'published' ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> Đã Đăng
                              </span>
                            ) : post.status === 'scheduled' ? (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-600" /> Hẹn {post.scheduledAt || '18:00'}
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" /> Bản Nháp
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">
                          {post.title}
                        </h4>

                        {/* TikTok Schedule Time Slots (6h, 12h, 18h) */}
                        {post.platform === 'tiktok' && (
                          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-600" /> Khung giờ vàng TikTok:
                              </span>
                              {post.scheduledAt && (
                                <span className="font-bold text-indigo-600">Đã hẹn: {post.scheduledAt}</span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {(['06:00', '12:00', '18:00'] as const).map((slot) => {
                                const labels: Record<string, string> = {
                                  '06:00': '🌅 6h Sáng',
                                  '12:00': '☀️ 12h Trưa',
                                  '18:00': '🌙 18h Tối'
                                };
                                const isSelected = post.scheduledAt === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => handleScheduleSlot(post.id, slot)}
                                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                    }`}
                                  >
                                    {labels[slot]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Video Player or Create Video Button (for TikTok) */}
                        {post.platform === 'tiktok' && (
                          <div>
                            {post.mediaUrls && post.mediaUrls.length > 0 ? (
                              /\.(jpg|jpeg|png|webp)$/i.test(post.mediaUrls[0]) ? (
                                <div className="space-y-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-amber-500/50 p-3 text-center">
                                    <img
                                      src={post.mediaUrls[0]}
                                      alt={post.title}
                                      className="w-full max-h-40 object-cover rounded-lg opacity-40 mx-auto"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
                                      <span className="text-amber-300 font-bold text-xs mb-1">⚠️ Định dạng ảnh tĩnh (.jpg)</span>
                                      <p className="text-[11px] text-slate-200 mb-2">Vui lòng chọn video (.mp4) từ kho E:\Thú cưng để phát và đăng TikTok</p>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveVideoPost(post);
                                          setShowVideoModal(true);
                                        }}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                                      >
                                        🎬 Chọn Video MP4 Thật
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <TikTokCardPlayer
                                  post={post}
                                  onOpenModal={() => {
                                    setActiveVideoPost(post);
                                    setShowVideoModal(true);
                                  }}
                                  onDeleteVideo={async () => {
                                    if (!confirm('Bạn có chắc muốn xóa video này khỏi bài đăng?')) return;
                                    await fetch('/api/admin/social-posts', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ id: post.id, mediaUrls: [] })
                                    });
                                    showNotification('Đã gỡ video khỏi bài đăng!');
                                    fetchData();
                                  }}
                                  onRenderVideo={(targetPost) => executeRenderVideo(targetPost)}
                                  isRenderingThis={renderingPost?.id === post.id}
                                />
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveVideoPost(post);
                                  setShowVideoModal(true);
                                }}
                                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                              >
                                <Film className="w-4 h-4 text-white animate-pulse" />
                                <span>🎬 Tạo Video AI & Lưu Trữ Video Này</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* 3s Hook Highlight Box (if available) */}
                        {post.hookText && (
                          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-l-4 border-amber-500 p-2.5 rounded-r-xl">
                            <span className="text-[10px] font-black uppercase text-amber-900 flex items-center gap-1">
                              <Megaphone className="w-3 h-3 text-amber-600" /> Hook 3s đầu viral:
                            </span>
                            <p className="text-xs font-bold text-slate-800 italic mt-0.5">
                              &ldquo;{post.hookText}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Content text */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
                            {post.content}
                          </pre>
                        </div>

                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {post.hashtags.map((h, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono font-medium"
                              >
                                #{h.replace(/^#/, '')}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Target Product URL */}
                        {post.targetUrl && (
                          <div className="text-[11px] text-slate-500 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 pt-1 bg-amber-50/80 dark:bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                            <div className="flex items-center gap-1.5 truncate max-w-full">
                              <span className="font-bold text-amber-800 shrink-0">🛒 Link sp:</span>
                              <span className="text-orange-600 font-mono text-[11px] truncate" title={post.targetUrl}>
                                {post.targetUrl}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                              <a
                                href={post.targetUrl.replace(/^https?:\/\/[^\/]+/, '') || post.targetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500 text-white font-semibold text-[10px] hover:bg-orange-600 transition-colors shadow-sm"
                                title="Bấm để mở trực tiếp trang sản phẩm"
                              >
                                👁️ Xem web
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(post.targetUrl || '');
                                  showNotification('📋 Đã sao chép link sản phẩm!');
                                }}
                                className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold text-[10px] hover:bg-slate-50 transition-colors"
                                title="Sao chép đường link"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 1-Click Publish to TikTok buttons */}
                        {post.platform === 'tiktok' && (
                          <div className="space-y-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handlePublishTikTokWithVideo(post, 'now')}
                              className="w-full py-2.5 px-3 rounded-2xl font-black text-xs bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                              title="Tải video, chép kịch bản và mở TikTok Creator Center để đăng ngay lập tức"
                            >
                              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
                              <span>⚡ Đẩy Đăng Lên TikTok Ngay Lập Tức</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePublishTikTokWithVideo(post, 'schedule')}
                              className="w-full py-1.5 px-2.5 rounded-xl font-bold text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              title={`Lên lịch đăng tự động vào lúc ${post.scheduledAt || '18:00'}`}
                            >
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>⏰ Hoặc Lên Lịch Đăng ({post.scheduledAt || '18:00'})</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySocialContent(post)}
                          className="flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs"
                        >
                          {copiedPostId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Đã chép!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Sao Chép</span>
                            </>
                          )}
                        </button>

                        {post.platform === 'zalo' && (
                          <a
                            href="https://chat.zalo.me"
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-3 rounded-xl font-bold text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors flex items-center gap-1 shadow-2xs"
                            title="Mở Zalo Web (chat.zalo.me) để dán và gửi tin"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Mở Zalo</span>
                          </a>
                        )}

                        {post.platform === 'facebook' && (
                          <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-3 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-1 shadow-2xs"
                            title="Mở Facebook để dán và đăng bài"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Mở FB</span>
                          </a>
                        )}

                        {post.status === 'draft' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateSocialStatus(post.id, 'published')}
                            className="py-2 px-3 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                            title="Đánh dấu đã đăng lên kênh này"
                          >
                            Đã Đăng
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateSocialStatus(post.id, 'draft')}
                            className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Chuyển về bản nháp"
                          >
                            Về Nháp
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteSocialPost(post.id, post.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa kịch bản này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: THÊM / SỬA SẢN PHẨM */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Kho'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  placeholder="Ví dụ: Hạt Royal Canin Khắc Phục Sỏi Thận 2kg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={pForm.category}
                    onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="dry_kibble">Hạt khô</option>
                    <option value="wet_pate">Pate tươi</option>
                    <option value="dietary">Hạt trị liệu</option>
                    <option value="treats">Bánh thưởng</option>
                    <option value="feeding_tools">Bát ăn & Máy lọc nước</option>
                    <option value="hygiene_litter">Khay cát & Vệ sinh</option>
                    <option value="toys_scratchers">Đồ chơi & Cào móng</option>
                    <option value="grooming_health">Sữa tắm & Da móng</option>
                    <option value="accessories_collars">Vòng cổ & Dây dắt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loài áp dụng</label>
                  <select
                    value={pForm.petType}
                    onChange={(e) => setPForm({ ...pForm, petType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="cat">Dành cho Mèo</option>
                    <option value="dog">Dành cho Chó</option>
                    <option value="all">Cả Chó và Mèo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={pForm.price}
                    onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                    placeholder="385000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-bold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá gốc (gạch đi)</label>
                  <input
                    type="number"
                    value={pForm.originalPrice}
                    onChange={(e) => setPForm({ ...pForm, originalPrice: e.target.value })}
                    placeholder="420000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quy cách / Khối lượng</label>
                  <input
                    type="text"
                    value={pForm.weight}
                    onChange={(e) => setPForm({ ...pForm, weight: e.target.value })}
                    placeholder="2kg / 2.5L"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn hình ảnh (URL)</label>
                <input
                  type="url"
                  value={pForm.image}
                  onChange={(e) => setPForm({ ...pForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... hoặc để trống lấy ảnh mặc định"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn gọn</label>
                <textarea
                  rows={2}
                  value={pForm.shortDesc}
                  onChange={(e) => setPForm({ ...pForm, shortDesc: e.target.value })}
                  placeholder="Công dụng nổi bật chuẩn thú y..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={pForm.inStock}
                  onChange={(e) => setPForm({ ...pForm, inStock: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="inStock" className="font-bold text-slate-700 cursor-pointer">
                  Còn hàng trong kho (Sẵn sàng bán)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-200"
                >
                  {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Vào Gian Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOẠN BÀI VIẾT MỚI */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Soạn Bài Viết Cẩm Nang Mới
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={aForm.title}
                  onChange={(e) => setAForm({ ...aForm, title: e.target.value })}
                  placeholder="Ví dụ: Top 5 Cách Chăm Sóc Mèo Con Mới Cai Sữa Khỏe Mạnh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    value={aForm.category}
                    onChange={(e) => setAForm({ ...aForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Chăm Sóc & Dinh Dưỡng">Chăm Sóc & Dinh Dưỡng</option>
                    <option value="Phòng & Trị Bệnh">Phòng & Trị Bệnh</option>
                    <option value="Đồ Dùng & Phụ Kiện">Đồ Dùng & Phụ Kiện</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đối tượng áp dụng</label>
                  <select
                    value={aForm.targetPet}
                    onChange={(e) => setAForm({ ...aForm, targetPet: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="all">Chung cho thú cưng</option>
                    <option value="cat">Dành cho Mèo</option>
                    <option value="dog">Dành cho Chó</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn gọn *</label>
                <textarea
                  required
                  rows={2}
                  value={aForm.summary}
                  onChange={(e) => setAForm({ ...aForm, summary: e.target.value })}
                  placeholder="Tóm tắt nội dung để hiện trên thẻ bài viết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung chi tiết *</label>
                <textarea
                  required
                  rows={6}
                  value={aForm.content}
                  onChange={(e) => setAForm({ ...aForm, content: e.target.value })}
                  placeholder="Viết nội dung bài viết ở đây, hướng dẫn bạn đọc chi tiết..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-200"
                >
                  Đăng Bài Viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUÉT BÁO GIÁ & CATALOG BẰNG AI */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] flex flex-col my-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Số Hóa Báo Giá & Catalog Bằng AI</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase">
                      Gemini Vision AI (Đã Kích Hoạt)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trích xuất tự động sản phẩm, quy cách và giá bán từ ảnh chụp bảng giá hoặc file PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScanModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: INPUT / UPLOAD */}
            {scanStep === 'input' && (
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* Mode Selector Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setScanTab('file');
                      if (scanTab === 'file' && !scanFile) {
                        scanFileInputRef.current?.click();
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scanTab === 'file'
                        ? 'bg-white text-purple-700 shadow-sm border border-purple-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 text-purple-600" />
                    <span>Tải Ảnh / File PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScanTab('text')}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scanTab === 'text'
                        ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                    <span>Dán Văn Bản Báo Giá</span>
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={scanFileInputRef}
                  type="file"
                  accept="image/*,application/pdf,.pdf"
                  onChange={handleScanFileUpload}
                  className="hidden"
                />

                {/* TAB 1: FILE UPLOAD (PDF / IMAGE) */}
                {scanTab === 'file' && (
                  <div className="space-y-4">
                    {!scanFile ? (
                      <div
                        onClick={() => scanFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={handleDropFile}
                        className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all text-center group ${
                          isDraggingFile
                            ? 'border-purple-600 bg-purple-100/80 scale-[1.01]'
                            : 'border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50/80 shadow-xs hover:shadow-md'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-200 mb-4 group-hover:scale-105 transition-transform">
                          <FileUp className="w-8 h-8" />
                        </div>

                        <h4 className="font-black text-base text-slate-900 mb-1">
                          Bấm vào đây hoặc kéo thả file để tải lên
                        </h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                          Hỗ trợ tài liệu catalog dạng <strong className="text-purple-700">PDF nhiều trang</strong> hoặc ảnh chụp bảng giá <strong className="text-purple-700">(JPG, PNG, WEBP)</strong> tối đa 25MB
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scanFileInputRef.current?.click();
                          }}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                        >
                          <UploadCloud className="w-4 h-4 text-purple-200" />
                          <span>📁 Bấm Vào Đây Để Chọn File PDF / Ảnh Từ Máy Tính</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-3xl border border-purple-200 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            {scanFile.type.includes('pdf') || scanFile.name.toLowerCase().endsWith('.pdf') ? (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center font-black text-[10px] uppercase shadow-md shadow-rose-200 shrink-0">
                                <FileText className="w-6 h-6 mb-0.5" />
                                <span>PDF</span>
                              </div>
                            ) : (
                              <img
                                src={scanFile.dataUrl}
                                alt="Preview"
                                className="w-14 h-14 object-cover rounded-2xl border border-purple-200 shadow-xs shrink-0"
                              />
                            )}
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <p className="font-black text-sm text-slate-900 truncate">{scanFile.name}</p>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                                  ✓ Đã Sẵn Sàng
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Loại: <strong className="text-purple-700 font-semibold">{scanFile.type.includes('pdf') || scanFile.name.toLowerCase().endsWith('.pdf') ? 'Tài liệu PDF Catalog' : 'Ảnh chụp bảng giá'}</strong>
                                {scanFile.size && ` • ${(scanFile.size / 1024 / 1024).toFixed(2)} MB`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => scanFileInputRef.current?.click()}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-white hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Đổi file khác</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setScanFile(null);
                                if (scanFileInputRef.current) scanFileInputRef.current.value = '';
                              }}
                              className="p-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Xóa file đã chọn"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-white/90 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                            File đã nạp thành công! Hãy bấm nút màu tím bên dưới để AI bắt đầu quét và trích xuất.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: PASTE TEXT */}
                {scanTab === 'text' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Nội dung báo giá từ Zalo / Email / Bảng tính Excel:
                      </label>
                      <button
                        type="button"
                        onClick={handleLoadSampleCatalog}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                      >
                        ⚡ Dán mẫu báo giá mẫu để thử nhanh
                      </button>
                    </div>
                    <textarea
                      rows={6}
                      value={scanRawText}
                      onChange={(e) => setScanRawText(e.target.value)}
                      placeholder="Dán nội dung báo giá tại đây. Ví dụ:&#10;1. Hạt Mèo Royal Canin Indoor 2kg - 385.000đ&#10;2. Pate Monge Vịt Tươi 400g - 52.000đ&#10;3. Máy Lọc Nước Tuần Hoàn Khử Khoáng 2.5L - 380.000đ..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>
                )}

                {/* Tips & Quick Sample Helper */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      💡 Mẹo sử dụng AI Vision:
                    </p>
                    <p className="text-[11px] text-amber-700">
                      Bạn có thể chụp ảnh hóa đơn bản cứng, trang catalog nhà phân phối hoặc bảng báo giá viết tay dạng PDF. AI sẽ tự động nhận diện tên sản phẩm, trọng lượng, giá bán và phân loại danh mục.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSampleCatalog}
                    className="shrink-0 text-xs font-bold bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Dán Báo Giá Mẫu
                  </button>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScanModal(false)}
                    className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    disabled={scanLoading}
                    onClick={() => {
                      if (scanTab === 'file' && !scanFile) {
                        scanFileInputRef.current?.click();
                        return;
                      }
                      handleTriggerScan();
                    }}
                    className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      scanLoading
                        ? 'bg-purple-400 text-white cursor-wait'
                        : (scanTab === 'file' && scanFile) || (scanTab === 'text' && scanRawText.trim())
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-200'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${scanLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {scanLoading
                        ? 'AI Đang Đọc & Trích Xuất Dữ Liệu...'
                        : scanFile
                        ? scanFile.type.includes('pdf') || scanFile.name.toLowerCase().endsWith('.pdf')
                          ? '✨ Bắt Đầu Quét File PDF Bằng AI'
                          : '✨ Bắt Đầu Quét Bằng AI'
                        : scanTab === 'file'
                        ? '📁 Chọn File PDF / Ảnh Trước'
                        : 'Bắt Đầu Quét Bằng AI'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INTERACTIVE REVIEW & APPROVAL TABLE */}
            {scanStep === 'review' && (
              <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                {/* Review Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectAll(!scannedItems.every((i) => i.selected))}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs"
                    >
                      {scannedItems.length > 0 && scannedItems.every((i) => i.selected) ? (
                        <CheckSquare className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Square className="w-4 h-4 text-purple-400" />
                      )}
                      <span>
                        {scannedItems.every((i) => i.selected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </span>
                    </button>
                    <span className="text-xs text-slate-600">
                      Tìm thấy <strong className="text-purple-700">{scannedItems.length}</strong> sản phẩm • Đã chọn{' '}
                      <strong className="text-emerald-700">{scannedItems.filter((i) => i.selected).length}</strong> món để nhập
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddManualRow}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm dòng mới
                  </button>
                </div>

                {/* Scanned Items Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl flex-1 max-h-[50vh]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-[11px] font-black text-slate-700 uppercase">
                      <tr>
                        <th className="p-3 w-10 text-center">Duyệt</th>
                        <th className="p-3 min-w-[200px]">Tên Sản Phẩm</th>
                        <th className="p-3 w-32">Giá Bán (VNĐ)</th>
                        <th className="p-3 w-24">Quy Cách</th>
                        <th className="p-3 w-36">Danh Mục</th>
                        <th className="p-3 w-28">Dành Cho</th>
                        <th className="p-3 w-12 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {scannedItems.map((item) => (
                        <tr
                          key={item.tempId}
                          className={`transition-colors ${
                            item.selected ? 'bg-white hover:bg-purple-50/30' : 'bg-slate-50/70 text-slate-400'
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => handleToggleItem(item.tempId)}
                              className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleUpdateScannedItem(item.tempId, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateScannedItem(item.tempId, 'price', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-orange-600 focus:outline-none focus:border-purple-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.weight}
                              onChange={(e) => handleUpdateScannedItem(item.tempId, 'weight', e.target.value)}
                              placeholder="1kg / 2L"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-purple-500"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={item.category}
                              onChange={(e) => handleUpdateScannedItem(item.tempId, 'category', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-purple-500 bg-white"
                            >
                              <option value="dry_kibble">Hạt khô</option>
                              <option value="wet_pate">Pate tươi</option>
                              <option value="dietary">Hạt trị liệu</option>
                              <option value="treats">Bánh thưởng</option>
                              <option value="feeding_tools">Bát ăn & Máy lọc</option>
                              <option value="hygiene_litter">Khay cát & Vệ sinh</option>
                              <option value="toys_scratchers">Đồ chơi & Cào móng</option>
                              <option value="grooming_health">Sữa tắm & Da lông</option>
                              <option value="accessories_collars">Vòng cổ & Phụ kiện</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <select
                              value={item.petType}
                              onChange={(e) => handleUpdateScannedItem(item.tempId, 'petType', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-purple-500 bg-white"
                            >
                              <option value="all">Chó & Mèo</option>
                              <option value="cat">Mèo</option>
                              <option value="dog">Chó</option>
                            </select>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteScannedRow(item.tempId)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Review Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setScanStep('input')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Quét tài liệu khác
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowScanModal(false)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="button"
                      disabled={isImporting || scannedItems.filter((i) => i.selected).length === 0}
                      onClick={handleApproveAndImport}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle className={`w-4 h-4 ${isImporting ? 'animate-spin' : ''}`} />
                      <span>
                        {isImporting
                          ? 'Đang nhập kho...'
                          : `✓ Phê Duyệt & Nhập (${scannedItems.filter((i) => i.selected).length}) Sản Phẩm Vào Kho`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SÁNG TẠO KỊCH BẢN VIDEO & BÀI ĐĂNG BẰNG AI */}
      {showGenerateSocialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] flex flex-col my-auto border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Bác Sĩ AI Soạn Kịch Bản Video & Bài Viết MXH</span>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      Gemini 2.5 Flash
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sản xuất kịch bản TikTok 3s Hook viral, bài viết Facebook chuyên sâu và broadcast Zalo bán hàng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenerateSocialModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Step 1: Input Setup */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                {/* Platform Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    1. Chọn Nền Tảng Phát Hành:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSocialForm({ ...socialForm, platform: 'tiktok' })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        socialForm.platform === 'tiktok'
                          ? 'border-black bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <Video className={`w-4 h-4 ${socialForm.platform === 'tiktok' ? 'text-rose-400' : 'text-slate-500'}`} />
                        <span>TikTok / Reels</span>
                      </div>
                      <span className={`text-[10px] ${socialForm.platform === 'tiktok' ? 'text-slate-300' : 'text-slate-400'}`}>
                        Video ngắn • Hook 3s • Kịch bản phân cảnh
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSocialForm({ ...socialForm, platform: 'facebook' })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        socialForm.platform === 'facebook'
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <Share2 className={`w-4 h-4 ${socialForm.platform === 'facebook' ? 'text-white' : 'text-blue-500'}`} />
                        <span>Facebook Post</span>
                      </div>
                      <span className={`text-[10px] ${socialForm.platform === 'facebook' ? 'text-blue-100' : 'text-slate-400'}`}>
                        Bài viết phân tích • Bác Sĩ chia sẻ • CTA mua
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSocialForm({ ...socialForm, platform: 'zalo' })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        socialForm.platform === 'zalo'
                          ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <Send className={`w-4 h-4 ${socialForm.platform === 'zalo' ? 'text-white' : 'text-sky-500'}`} />
                        <span>Zalo Broadcast</span>
                      </div>
                      <span className={`text-[10px] ${socialForm.platform === 'zalo' ? 'text-sky-100' : 'text-slate-400'}`}>
                        Tin nhắn CSKH • Khuyến mãi • Tư vấn 1-1
                      </span>
                    </button>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Gắn Sản Phẩm Mục Tiêu:
                    </label>
                    <select
                      value={socialForm.productId}
                      onChange={(e) => setSocialForm({ ...socialForm, productId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-pink-500 bg-white"
                    >
                      <option value="">-- Không chọn (Bài viết chuyên môn chung) --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price.toLocaleString('vi-VN')}₫)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3. Ý Tưởng / Trọng Tâm Nội Dung (Tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={socialForm.topic}
                      onChange={(e) => setSocialForm({ ...socialForm, topic: e.target.value })}
                      placeholder="Ví dụ: Cảnh báo sỏi thận ở mèo đực, Mẹo giảm rụng lông..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-pink-500 bg-white"
                    />
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={socialGenerating}
                    onClick={handleGenerateSocialPost}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-pink-200 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className={`w-4 h-4 ${socialGenerating ? 'animate-spin' : ''}`} />
                    <span>{socialGenerating ? 'Bác Sĩ AI Đang Soạn Kịch Bản...' : '✨ Bắt Đầu Soạn Bằng AI'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Generated Post Preview & Editor */}
              {generatedPost && (
                <div className="border border-pink-200 bg-pink-50/20 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-pink-700 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-pink-600" />
                      Bản Xem Trước & Tùy Chỉnh (Có Thể Chỉnh Sửa Trực Tiếp):
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Nền tảng: {generatedPost.platform?.toUpperCase()}
                    </span>
                  </div>

                  {/* Title input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu Đề Kịch Bản / Bài Đăng:</label>
                    <input
                      type="text"
                      value={generatedPost.title || ''}
                      onChange={(e) => setGeneratedPost({ ...generatedPost, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Hook input (for TikTok/FB) */}
                  {(generatedPost.platform === 'tiktok' || generatedPost.hookText) && (
                    <div>
                      <label className="block text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                        <Megaphone className="w-3.5 h-3.5 text-amber-600" /> Hook 3 Giây Mở Đầu (Gây tò mò / giật mình):
                      </label>
                      <input
                        type="text"
                        value={generatedPost.hookText || ''}
                        onChange={(e) => setGeneratedPost({ ...generatedPost, hookText: e.target.value })}
                        placeholder="Câu nói hoặc hành động đầu video..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/50 text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {/* Content textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nội Dung Chi Tiết (Lời thoại / Kịch bản phân cảnh / Bài viết):
                    </label>
                    <textarea
                      rows={8}
                      value={generatedPost.content || ''}
                      onChange={(e) => setGeneratedPost({ ...generatedPost, content: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white font-sans leading-relaxed focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Hashtags and targetUrl */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hashtags (cách nhau dấu cách):</label>
                      <input
                        type="text"
                        value={generatedPost.hashtags?.join(' ') || ''}
                        onChange={(e) =>
                          setGeneratedPost({
                            ...generatedPost,
                            hashtags: e.target.value
                              .split(/\s+/)
                              .filter(Boolean)
                              .map((h) => (h.startsWith('#') ? h : `#${h}`))
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Link Đặt Hàng / Tư Vấn:</label>
                      <input
                        type="text"
                        value={generatedPost.targetUrl || ''}
                        onChange={(e) => setGeneratedPost({ ...generatedPost, targetUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-orange-600 bg-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowGenerateSocialModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {generatedPost && (
                  <button
                    type="button"
                    onClick={() => handleCopySocialContent(generatedPost as SocialPost)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Sao Chép Ngay</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={!generatedPost || !generatedPost.title}
                  onClick={handleSaveSocialPost}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-pink-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Lưu Vào Kho Supabase</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TIKTOK VIDEO STUDIO & UPLOAD & CAPCUT GUIDE */}
      {showVideoModal && activeVideoPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                  <Film className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Studio Video TikTok & Lưu Trữ
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Kịch bản: {activeVideoPost.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setVideoModalTab('my_pet_clips')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  videoModalTab === 'my_pet_clips'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-rose-500" />
                <span>1. Kho Cảnh Quay (E:\Thú cưng)</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoModalTab('live_preview')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  videoModalTab === 'live_preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>2. Xem Thử & Giọng Đọc AI</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoModalTab('upload')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  videoModalTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>3. Tải Video Khác</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoModalTab('capcut_guide')}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  videoModalTab === 'capcut_guide'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Copy className="w-3.5 h-3.5 text-amber-600" />
                <span>4. CapCut (Tùy chọn)</span>
              </button>
            </div>

            {/* TAB 1: KHO CẢNH QUAY THẬT TỪ MÁY TÍNH (E:\Thú cưng) */}
            {videoModalTab === 'my_pet_clips' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1.5">
                      🐾 Đã tìm thấy {petClips.length} cảnh quay thú cưng thực tế trong thư mục E:\Thú cưng!
                    </span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Chọn bất kỳ cảnh quay nào bên dưới để hệ thống tự động ghép kịch bản và gắn vào bài đăng TikTok.
                    </p>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    MP4 Chuẩn Nét
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {petClips.map((clip) => {
                    const isSelected = selectedPetClip === clip.url;
                    return (
                      <div
                        key={clip.id}
                        className={`rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-50/60 border-indigo-500 shadow-sm ring-2 ring-indigo-200'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                            {clip.type === 'video' ? (
                              <video
                                src={clip.url}
                                controls
                                preload="metadata"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={clip.url}
                                alt={clip.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs line-clamp-1">
                              {clip.name}
                            </h5>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {clip.filename}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPetClip(clip.url);
                              setVideoModalTab('live_preview');
                            }}
                            className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-pink-600" /> Xem Thử
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttachClipToPost(clip.url, activeVideoPost.id)}
                            className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Gắn Video Này
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: XEM THỬ GHÉP CHỮ & GIỌNG ĐỌC AI (LIVE PREVIEW) */}
            {videoModalTab === 'live_preview' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700 flex items-center justify-between">
                  <span>
                    Đang xem trước với cảnh quay: <strong>{petClips.find((c) => c.url === selectedPetClip)?.name || selectedPetClip}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setVideoModalTab('my_pet_clips')}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Đổi cảnh khác &rarr;
                  </button>
                </div>

                {/* Text Position Chooser */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-2.5 px-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sắp xếp vị trí chữ hiển thị:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTextPosition('bottom')}
                      className={`py-1 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        textPosition === 'bottom'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👇 Sát Dưới Đáy (Khuyên dùng - Không che thú cưng)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextPosition('top')}
                      className={`py-1 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        textPosition === 'top'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👆 Sát Trên Đỉnh
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  {/* Phone frame 9:16 */}
                  <div className="relative w-56 h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black flex flex-col justify-between p-3.5 text-white select-none">
                    {/* Background Video */}
                    <video
                      src={selectedPetClip}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gradient only at top & bottom edge, middle 60% is 100% transparent */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent via-50% to-black/85 pointer-events-none" />

                    {textPosition === 'bottom' ? (
                      <>
                        {/* 1. SÁT TRÊN CÙNG: Hook 3s nhỏ gọn */}
                        <div className="relative z-10 space-y-1">
                          <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block shadow-md">
                            ⚠️ CẢNH BÁO BÁC SĨ THÚ Y
                          </div>
                          <div className="bg-black/50 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                            <p className="text-xs font-black text-amber-300 leading-snug drop-shadow-md">
                              &ldquo;{activeVideoPost.hookText || activeVideoPost.title}&rdquo;
                            </p>
                          </div>
                        </div>

                        {/* 2. GIỮA MÀN HÌNH: HOÀN TOÀN TRỐNG ĐỂ LỘ RÕ 100% CẢNH QUAY THÚ CƯNG KHÔNG BỊ CHE KHUẤT */}
                        <div className="flex-1 pointer-events-none" />

                        {/* 3. SÁT DƯỚI ĐÁY: Toàn bộ tiêu đề "Bí Quyết..." + Giá + Giỏ Hàng gom xuống đây */}
                        <div className="relative z-10 space-y-1.5">
                          <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 space-y-1 shadow-lg">
                            <div className="text-[11px] text-white font-black line-clamp-2">
                              {activeVideoPost.title}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-rose-400">
                                {activeVideoPost.content.match(/\d+[\d.,]*\s*[₫đ]/)?.[0] || 'Giá ưu đãi hôm nay'}
                              </span>
                              <span className="text-[9px] text-emerald-400 font-bold">
                                ✓ 100% Chính hãng
                              </span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-black text-[10px] py-1.5 px-2 rounded-xl shadow-lg text-center animate-bounce">
                            🛒 BẤM GIỎ HÀNG GÓC TRÁI
                          </div>
                          <div className="text-[8px] text-slate-300 text-center font-bold">
                            DVDmultilPET • thucungtot.net
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* SÁT TRÊN: Cả Hook và Tiêu đề sản phẩm dồn lên trên cùng */}
                        <div className="relative z-10 space-y-1.5">
                          <div className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block shadow-md">
                            ⚠️ CẢNH BÁO BÁC SĨ THÚ Y
                          </div>
                          <div className="bg-black/50 backdrop-blur-xs p-2 rounded-xl border border-white/10 space-y-1">
                            <p className="text-xs font-black text-amber-300 leading-snug drop-shadow-md">
                              &ldquo;{activeVideoPost.hookText || activeVideoPost.title}&rdquo;
                            </p>
                            <div className="text-[10px] text-white font-bold border-t border-white/10 pt-1 line-clamp-1">
                              {activeVideoPost.title}
                            </div>
                          </div>
                        </div>

                        {/* GIỮA MÀN HÌNH: HOÀN TOÀN TRỐNG */}
                        <div className="flex-1 pointer-events-none" />

                        {/* SÁT DƯỚI: Nút giỏ hàng */}
                        <div className="relative z-10 space-y-1 text-center">
                          <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-black text-[10px] py-1.5 px-2 rounded-xl shadow-lg animate-bounce">
                            🛒 BẤM GIỎ HÀNG GÓC TRÁI
                          </div>
                          <div className="text-[8px] text-slate-300 font-bold">
                            DVDmultilPET • thucungtot.net
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions & Voiceover */}
                  <div className="space-y-4 max-w-xs text-xs">
                    <div className="space-y-1.5">
                      <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-pink-600" />
                        <span>Giọng Đọc AI Chuẩn Tiếng Việt:</span>
                      </h5>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        Hệ thống sử dụng giọng tiếng Việt chuẩn tự nhiên (phát âm rõ từng dấu, chuẩn ngữ điệu TikTok).
                      </p>
                    </div>

                    {/* Bộ chọn giọng đọc AI chuẩn */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">
                        Chọn phong cách giọng:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVoiceType('google_vi')}
                          className={`py-1.5 px-2 rounded-xl font-bold text-[11px] border transition-all cursor-pointer text-center ${
                            selectedVoiceType === 'google_vi'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          🎙️ Nữ Chuẩn (TikTok)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedVoiceType('edge_natural')}
                          className={`py-1.5 px-2 rounded-xl font-bold text-[11px] border transition-all cursor-pointer text-center ${
                            selectedVoiceType === 'edge_natural'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          🎙️ Truyền Cảm (Natural)
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handlePlayVoiceover(
                          `${activeVideoPost.hookText || activeVideoPost.title}. ${activeVideoPost.title}. Bấm vào giỏ hàng bên dưới để đặt mua chính hãng tại DVDmultilPET nha!`
                        )
                      }
                      className={`w-full py-3 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isSpeakingVoice
                          ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                          : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-transparent'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>{isSpeakingVoice ? '⏹️ Đang Đọc (Bấm Dừng)' : '🔊 Phát Thử Giọng Đọc AI Tiếng Việt'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSavingClip}
                      onClick={() => handleAttachClipToPost(selectedPetClip, activeVideoPost.id)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSavingClip ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang Lưu Video Vào Bài Đăng...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>✓ Xác Nhận Lưu Video Này Vào Bài Đăng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: UPLOAD VIDEO MỚI */}
            {videoModalTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer hover:bg-indigo-50/30 transition-all space-y-3"
                >
                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && activeVideoPost) {
                        handleUploadVideo(file, activeVideoPost.id);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Chọn file Video khác từ máy tính hoặc điện thoại
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ định dạng MP4, WebM, MOV (tối đa 100MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Bấm Để Chọn Video
                  </button>
                </div>

                {videoUploadLoading && (
                  <div className="text-center p-4 bg-indigo-50 rounded-2xl text-xs font-bold text-indigo-700 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang tải và mã hóa lưu trữ video vào hệ thống...
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CAPCUT GUIDE */}
            {videoModalTab === 'capcut_guide' && (
              <div className="space-y-4 text-xs text-slate-700">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                  <h4 className="font-black text-rose-900 text-sm flex items-center gap-2">
                    <Film className="w-4 h-4 text-rose-600" />
                    Cách chuyển kịch bản sang Video bằng CapCut Web (Dành cho ai muốn khám phá):
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Bạn chỉ cần sao chép kịch bản bên dưới, mở <strong>CapCut Web</strong> và dán vào tính năng <em>&ldquo;Kịch bản sang video&rdquo;</em> để xuất video lồng tiếng tự động.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const textForCapCut = `TIÊU ĐỀ: ${activeVideoPost.title}\n\nHOOK 3 GIÂY ĐẦU:\n${activeVideoPost.hookText || ''}\n\nKỊCH BẢN CHI TIẾT & LỜI THOẠI:\n${activeVideoPost.content}\n\nHASHTAG: ${activeVideoPost.hashtags?.join(' ')}`;
                      navigator.clipboard.writeText(textForCapCut);
                      showNotification('📋 Đã sao chép kịch bản tối ưu cho CapCut!');
                    }}
                    className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Copy className="w-4 h-4" /> Sao Chép Kịch Bản Đưa Sang CapCut
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Khung giờ đăng dự kiến: <strong>{activeVideoPost.scheduledAt || 'Chưa hẹn (Mặc định 18:00)'}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TikTok Instant Publish Helper Modal */}
      {tiktokPublishModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setTiktokPublishModalPost(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/25 shrink-0">
                <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Đẩy Đăng Video Lên TikTok Ngay
                </h3>
                <p className="text-xs text-rose-300 font-medium">Hoàn tất xuất bản trong 10 giây qua 3 bước đơn giản</p>
              </div>
            </div>

            <div className="space-y-3 mb-5 text-xs">
              {/* Bước 1 */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-200 mb-1">Video MP4 đã tự động tải về máy</div>
                  <p className="text-slate-400 text-[11px] mb-2">Tệp <code className="text-pink-300 font-semibold">tiktok-{tiktokPublishModalPost.id}.mp4</code> đã lưu vào thư mục Downloads của bạn.</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={tiktokPublishModalPost.mediaUrls?.[0] || '#'}
                      download={`tiktok-${tiktokPublishModalPost.id}.mp4`}
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold transition-colors"
                    >
                      <Download className="w-3 h-3 text-emerald-400" /> Tải lại video
                    </a>
                    <a
                      href={`/api/admin/tts?text=${encodeURIComponent(`${tiktokPublishModalPost.hookText || tiktokPublishModalPost.title}. ${tiktokPublishModalPost.title}. Bấm vào giỏ hàng bên dưới để đặt mua chính hãng tại DVDmultilPET nha!`)}`}
                      download={`voice-ai-${tiktokPublishModalPost.id}.mp3`}
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-pink-950/80 hover:bg-pink-900 text-pink-200 border border-pink-700/50 text-[11px] font-bold transition-colors"
                    >
                      <Mic className="w-3 h-3 text-pink-400" /> Tải Giọng AI (.mp3)
                    </a>
                  </div>
                </div>
              </div>

              {/* Bước 2 */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-200 mb-1">Kịch bản & Hashtag đã chép vào Clipboard</div>
                  <p className="text-slate-400 text-[11px] mb-2">Đầy đủ tiêu đề, câu Hook 3s thu hút và hashtag viral kèm link cửa hàng.</p>
                  <button
                    type="button"
                    onClick={() => {
                      const fullText = `${tiktokPublishModalPost.title}\n\n${tiktokPublishModalPost.hookText ? `"${tiktokPublishModalPost.hookText}"\n\n` : ''}🛒 Đặt mua chính hãng tại DVDmultilPET:\n${tiktokPublishModalPost.targetUrl || 'https://thucungtot.net/products'}\n\n${tiktokPublishModalPost.hashtags?.map((h) => `#${h.replace(/^#/, '')}`).join(' ') || ''}`;
                      navigator.clipboard.writeText(fullText.trim());
                      showNotification('📋 Đã sao chép lại nội dung bài đăng!');
                    }}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/70 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3 text-indigo-400" /> Bấm để sao chép lại
                  </button>
                </div>
              </div>

              {/* Bước 3 */}
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-emerald-500/30 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-bold text-emerald-300 mb-1">Thao tác trên tab TikTok vừa mở:</div>
                  <ol className="text-slate-300 text-[11px] space-y-1 list-decimal list-inside font-medium">
                    <li>Kéo thả tệp video <code className="text-white bg-slate-900 px-1 py-0.5 rounded">.mp4</code> vào ô tải lên.</li>
                    <li>Bấm phím <kbd className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono font-bold">Ctrl + V</kbd> vào ô &ldquo;Chú thích&rdquo; (Caption).</li>
                    <li>Nhấn nút đỏ <strong className="text-rose-400 font-bold">&ldquo;Đăng&rdquo; (Post)</strong> để xuất bản video ngay lập tức!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <a
                href="https://www.tiktok.com/creator-center/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Mở Trang Đăng TikTok
              </a>
              <button
                type="button"
                onClick={async () => {
                  await fetch('/api/admin/social-posts', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: tiktokPublishModalPost.id, status: 'published' })
                  });
                  showNotification('🎉 Tuyệt vời! Đã đánh dấu bài đăng thành trạng thái "Đã Đăng"!');
                  setTiktokPublishModalPost(null);
                  fetchData();
                }}
                className="py-2.5 px-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Đã Đăng Xong!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Rendering in-progress Modal */}
      {renderingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-rose-500/30 mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>

            <h3 className="text-lg font-black text-white mb-1">
              Đang Đóng Gói Video TikTok Hoàn Chỉnh
            </h3>
            <p className="text-xs text-rose-300 font-medium mb-4">
              Đang ghép chữ chạy thương hiệu và lồng giọng đọc AI Bác Sĩ chuẩn vào tệp MP4
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-emerald-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${renderProgress.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4 font-mono">
              <span className="truncate pr-2">{renderProgress.status}</span>
              <span className="font-bold text-amber-300 shrink-0">{renderProgress.percent}%</span>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-left text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>Ghép nhãn <strong>⚠️ Bác Sĩ Cảnh Báo</strong> & Hook 3s giật tít</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                <span>Hòa âm <strong>Giọng đọc AI Tiếng Việt</strong> (Google TTS Bác Sĩ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>Ghép thẻ giá sản phẩm & nút <strong>🛒 Giỏ Hàng TikTok</strong></span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-4">
              ⚡ Quá trình mất khoảng 8 - 12 giây. Vui lòng giữ nguyên tab này cho đến khi tải video xong!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
