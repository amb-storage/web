import HeroSection from "./_components/Hero/Hero";
import SpecialVintageSection from "./_components/SpecialVintageSection/SpecialVintageSection";
import MostPopularSection from "./_components/MostPopularSection/MostPopularSection";
import NewArrivalsSection from "./_components/NewArrivalsSection/NewArrivalsSection";
import RecentlyViewedSection from "./_components/RecentlyViewedSection/RecentlyViewedSection";
import CustomerVoiceSection from "./_components/CustomerVoiceSection/CustomerVoiceSection";
import BlogSection from "./_components/BlogSection/BlogSection";
import { storefrontRepository } from "@/lib/storefront";

export default async function Home() {
    const [collections, products] = await Promise.all([
        storefrontRepository.getHomepage(),
        storefrontRepository.getProducts({ sort: "newest" }),
    ]);
    const productById = new Map(
        products.map((product) => [product.id, product]),
    );
    const resolveCollection = (ids: string[]) =>
        ids.flatMap((id) => {
            const product = productById.get(id);
            return product ? [product] : [];
        });
    const customerVoices = collections.customerVoices.flatMap((voice) => {
        const product = productById.get(voice.productId);
        return product
            ? [
                  {
                      id: voice.id,
                      name: voice.name,
                      quote: voice.quote,
                      image: product.images[0],
                      href: `/shop/${product.slug}`,
                  },
              ]
            : [];
    });

    return (
        <div className="flex w-full min-w-0 flex-1 flex-col items-stretch justify-center overflow-x-clip bg-white font-sans dark:bg-black">
            <HeroSection />
            <SpecialVintageSection
                products={resolveCollection(collections.specialVintage)}
            />
            <NewArrivalsSection
                products={resolveCollection(collections.newArrivals)}
            />
            <MostPopularSection
                products={resolveCollection(collections.mostPopular)}
            />
            <RecentlyViewedSection products={products} />
            <BlogSection />
            <CustomerVoiceSection testimonials={customerVoices} />
        </div>
    );
}
