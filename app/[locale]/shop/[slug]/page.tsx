import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import ProductGallery from "./_components/ProductGallery/ProductGallery";
import ProductInfo from "./_components/ProductInfo/ProductInfo";
import RelatedProducts from "./_components/RelatedProducts/RelatedProducts";
import { RecentlyViewedTracker } from "../../_components/RecentlyViewedSection/RecentlyViewedTracker";
import TrackEvent from "@/components/Analytics/TrackEvent/TrackEvent";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

// generateMetadata và page dùng chung 1 lần gọi API trong cùng request
const getProduct = cache((locale: Locale, slug: string) =>
    storefrontRepository.getProductBySlug(locale, slug),
);

export async function generateMetadata({
    params,
}: PageProps<"/[locale]/shop/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const locale = (await getLocale()) as Locale;
    const product = await getProduct(locale, slug);
    if (!product) return {};
    return {
        title: product.seo.title,
        description: product.seo.description ?? undefined,
    };
}

export default async function ProductDetailPage({
    params,
}: PageProps<"/[locale]/shop/[slug]">) {
    const { slug } = await params;
    const locale = (await getLocale()) as Locale;
    const product = await getProduct(locale, slug);

    if (!product) notFound();
    // Slug cũ: backend đã redirect sang slug canonical, đưa URL web về đúng slug đó
    if (product.slug !== slug) {
        redirect({ href: `/shop/${product.slug}`, locale });
    }

    const productTitle = product.name;
    const t = await getTranslations("productDetail");

    const allProducts = await storefrontRepository.getAllProducts(locale);
    // Ưu tiên sản phẩm cùng danh mục, thiếu thì bù bằng sản phẩm mới nhất
    const categorySlugs = new Set(product.categories.map((category) => category.slug));
    const others = allProducts.filter((item) => item.id !== product.id);
    const relatedProducts = [
        ...others.filter((item) =>
            item.categories.some((category) => categorySlugs.has(category.slug)),
        ),
        ...others.filter(
            (item) => !item.categories.some((category) => categorySlugs.has(category.slug)),
        ),
    ].slice(0, 6);

    return (
        <div className="w-full">
            <RecentlyViewedTracker productId={product.id} />
            <TrackEvent name="view_product" title={product.slug} />
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
