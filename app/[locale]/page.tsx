import { getLocale } from "next-intl/server";
import HeroSection from "./_components/Hero/Hero";
import SpecialVintageSection from "./_components/SpecialVintageSection/SpecialVintageSection";
import MostPopularSection from "./_components/MostPopularSection/MostPopularSection";
import NewArrivalsSection from "./_components/NewArrivalsSection/NewArrivalsSection";
import RecentlyViewedSection from "./_components/RecentlyViewedSection/RecentlyViewedSection";
import CustomerVoiceSection from "./_components/CustomerVoiceSection/CustomerVoiceSection";
import BlogSection from "./_components/BlogSection/BlogSection";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

// Số sản phẩm của rail Most Popular khi lấy tự động (`GET /products?sort=popular`)
const POPULAR_PRODUCT_LIMIT = 8;

export default async function Home() {
    const locale = (await getLocale()) as Locale;
    const [home, products, stories, popularProducts] = await Promise.all([
        // null khi Home chưa publish trên CMS → các section tự ẩn / dùng nội dung mặc định
        storefrontRepository.getHomepage(locale),
        storefrontRepository.getAllProducts(locale),
        // Toàn bộ bài Mili Talks đã xuất bản (mới nhất trước); lỗi thì bỏ qua, không làm sập trang chủ
        storefrontRepository.getStories(locale).catch(() => []),
        // Dự phòng cho Most Popular khi admin chưa chọn tay: sản phẩm được xem nhiều nhất 30 ngày qua
        storefrontRepository.getPopularProducts(locale, POPULAR_PRODUCT_LIMIT).catch(() => []),
    ]);
    // Admin đã chọn tay ở mục Most Popular thì giữ đúng danh sách đó, chưa chọn thì tự động theo lượt xem
    const mostPopular = home?.mostPopular.length ? home.mostPopular : popularProducts;
    // Ưu tiên "Bài nổi bật" Home đã chọn, không có thì bài mới nhất; lưới bên dưới là các bài còn lại
    const featuredStory = home?.featuredStory ?? stories[0] ?? null;
    const otherStories = stories.filter((story) => story.slug !== featuredStory?.slug);

    return (
        <div className="flex w-full min-w-0 flex-1 flex-col items-stretch justify-center overflow-x-clip bg-white font-sans dark:bg-black">
            <HeroSection categories={home?.heroCategories} />
            <SpecialVintageSection products={home?.specialVintage ?? []} />
            <NewArrivalsSection products={home?.newArrivals ?? products.slice(0, 12)} />
            <MostPopularSection products={mostPopular} />
            <RecentlyViewedSection products={products} />
            <BlogSection
                intro={home?.miliTalksIntro}
                featuredStory={featuredStory}
                stories={otherStories}
            />
            {home && home.customerVoices.length > 0 && (
                <CustomerVoiceSection voices={home.customerVoices} />
            )}
        </div>
    );
}
