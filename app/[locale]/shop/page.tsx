import { getLocale, getTranslations } from "next-intl/server";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import { parseShopSearchParams, type Locale } from "@/lib/storefront";
import ShopCatalog from "./_components/ShopCatalog/ShopCatalog";

export default async function ShopPage({
    searchParams,
}: PageProps<"/[locale]/shop">) {
    const t = await getTranslations("shop");
    const locale = (await getLocale()) as Locale;
    // Bộ lọc nằm trên URL (`/shop?category=…&size=…&page=…`), server gọi API theo đúng bộ lọc đó
    const query = parseShopSearchParams(await searchParams);
    const [result, facets] = await Promise.all([
        storefrontRepository.searchProducts(locale, query),
        storefrontRepository.getProductFacets(locale),
    ]);

    return (
        <div className="w-full bg-white">
            <header className="flex min-h-[200px] flex-col items-center justify-center bg-[#eef5f0] px-4 py-12 text-center">
                <h1
                    className="text-center font-stencil text-5xl font-bold uppercase leading-none tracking-[0.03em] text-(--brand-green) sm:text-6xl md:text-7xl"
                >
                    {t("title")}
                </h1>

                <p className="mt-5 text-sm font-semibold tracking-wide text-black">
                    <strong>
                        ※表示価格はすべて税込です。 ※All prices include tax.
                    </strong>
                </p>
            </header>
            <ShopCatalog
                products={result.items}
                total={result.total}
                page={result.page}
                totalPages={result.totalPages}
                query={query}
                facets={facets}
            />
        </div>
    );
}
