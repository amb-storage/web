import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProductGallery from "./_components/ProductGallery/ProductGallery";
import ProductInfo from "./_components/ProductInfo/ProductInfo";
import RelatedProducts from "./_components/RelatedProducts/RelatedProducts";
import { getProductDetail, shippingReturnsBlocks } from "./fake";
import {
  specialVintageProducts,
  mostPopularProducts,
  newArrivalProducts,
} from "../../_components/fake";

export default async function ProductDetailPage({
  params,
}: PageProps<"/[locale]/shop-now/[slug]">) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) notFound();

  const locale = (await getLocale()) as "ja" | "en";
  const t = await getTranslations("productDetail");
  const tCard = await getTranslations("homepage.productCard");

  const relatedProducts = [
    ...specialVintageProducts,
    ...mostPopularProducts,
    ...newArrivalProducts,
  ]
    .filter((item) => item.href !== `/shop-now/${slug}`)
    .slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/shop-now" className="transition-colors hover:text-black">
          {t("allProducts")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <ProductGallery
          images={product.images}
          title={product.title}
          previousLabel={t("previous")}
          nextLabel={t("next")}
        />

        <ProductInfo
          title={product.title}
          price={product.price}
          stock={product.stock}
          stockLabel={tCard(product.stock === "low" ? "lowStock" : "soldOut")}
          addToCartLabel={tCard("addToCart")}
          descriptionTitle={t("description")}
          descriptionBlocks={product.descriptionBlocks[locale]}
          shippingReturnsTitle={t("shippingReturns")}
          shippingReturnsBlocks={shippingReturnsBlocks[locale]}
        />
      </div>

      <RelatedProducts
        title={t("relatedProducts")}
        products={relatedProducts}
      />
    </div>
  );
}
