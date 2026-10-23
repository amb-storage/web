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

export default async function Home() {
    const locale = (await getLocale()) as Locale;
    const [home, products] = await Promise.all([
        // null khi Home chưa publish trên CMS → các section tự ẩn / dùng nội dung mặc định
        storefrontRepository.getHomepage(locale),
        storefrontRepository.getAllProducts(locale),
    ]);

    return (
        <div className="flex w-full min-w-0 flex-1 flex-col items-stretch justify-center overflow-x-clip bg-white font-sans dark:bg-black">
            <HeroSection categories={home?.heroCategories} />
            <SpecialVintageSection products={home?.specialVintage ?? []} />
            <NewArrivalsSection products={home?.newArrivals ?? products.slice(0, 12)} />
            <MostPopularSection products={home?.mostPopular ?? []} />
            <RecentlyViewedSection products={products} />
            <BlogSection
                intro={home?.miliTalksIntro}
                featuredStory={home?.featuredStory}
            />
            {home && home.customerVoices.length > 0 && (
                <CustomerVoiceSection testimonials={home.customerVoices} />
            )}
        </div>
    );
}
