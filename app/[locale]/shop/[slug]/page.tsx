import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductGallery from "./_components/ProductGallery/ProductGallery";
import ProductInfo from "./_components/ProductInfo/ProductInfo";
import RelatedProducts from "./_components/RelatedProducts/RelatedProducts";
import { RecentlyViewedTracker } from "../../_components/RecentlyViewedSection/RecentlyViewedTracker";
import { storefrontRepository } from "@/lib/storefront";

export default async function ProductDetailPage({
    params,
}: PageProps<"/[locale]/shop/[slug]">) {
    const { slug } = await params;
    const product = await storefrontRepository.getProductBySlug(slug);

    if (!product) notFound();

    const locale = (await getLocale()) as "ja" | "en";
    const productTitle = product.name[locale];
    const t = await getTranslations("productDetail");

    const allProducts = await storefrontRepository.getProducts({
        sort: "newest",
    });
    const relatedProducts = allProducts
        .filter((item) => item.slug !== slug)
        .slice(0, 6);

    return (
        <div className="w-full">
            <RecentlyViewedTracker productId={product.id} />
            {/* Breadcrumb */}
            <nav className="flex gap-2 whitespace-nowrap px-6 py-4 text-xs leading-4 tracking-[0.24px] text-black/80 md:mx-2 md:my-4">
                <Link href="/" className="underline">
                    {t("top")}
                </Link>
                <span>/</span>
                <Link href="/shop" className="underline">
                    {t("allProducts")}
                </Link>
                <span>/</span>
                <span className="overflow-hidden text-ellipsis text-black">
                    {productTitle}
                </span>
            </nav>

            <div className="mt-6 flex flex-col md:flex-row md:items-start">
                <section className="w-full md:w-1/2">
                    <ProductGallery
                        images={product.images}
                        title={productTitle}
                        previousLabel={t("previous")}
                        nextLabel={t("next")}
                    />
                </section>

                <ProductInfo product={product} />
            </div>

            <div className="px-4 md:px-8">
                <RelatedProducts
                    title={t("relatedProducts")}
                    products={relatedProducts}
                />
            </div>
        </div>
    );
}
