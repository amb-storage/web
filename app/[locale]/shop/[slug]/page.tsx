import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
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
    const tCard = await getTranslations("homepage.productCard");

    const [allProducts, settings] = await Promise.all([
        storefrontRepository.getProducts({ sort: "newest" }),
        storefrontRepository.getStoreSettings(),
    ]);
    const relatedProducts = allProducts
        .filter((item) => item.slug !== slug)
        .slice(0, 6);
    const descriptionBlocks = [
        { type: "paragraph" as const, text: product.description[locale] },
        ...(product.condition
            ? [
                  { type: "divider" as const },
                  {
                      type: "heading" as const,
                      text: locale === "ja" ? "コンディション" : "Condition",
                  },
                  {
                      type: "paragraph" as const,
                      text: product.condition[locale],
                  },
              ]
            : []),
    ];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
            <RecentlyViewedTracker productId={product.id} />
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
                <Link
                    href="/shop"
                    className="transition-colors hover:text-black"
                >
                    {t("allProducts")}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-gray-900">{productTitle}</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
                <ProductGallery
                    images={product.images}
                    title={productTitle}
                    previousLabel={t("previous")}
                    nextLabel={t("next")}
                />

                <ProductInfo
                    product={product}
                    addToCartLabel={tCard("addToCart")}
                    inCartLabel={tCard("inCart")}
                    soldLabel={tCard("soldOut")}
                    taxInLabel={tCard("taxIn")}
                    descriptionTitle={t("description")}
                    descriptionBlocks={descriptionBlocks}
                    shippingReturnsTitle={t("shippingReturns")}
                    shippingReturnsBlocks={settings.shippingReturns[locale]}
                />
            </div>

            <RelatedProducts
                title={t("relatedProducts")}
                products={relatedProducts}
            />
        </div>
    );
}
