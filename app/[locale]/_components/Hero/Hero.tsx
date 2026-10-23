import { useTranslations } from "next-intl";
import militaryImg from "@/assets/hero1.jpeg";
import denimImg from "@/assets/hero2.jpeg";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import type { HomeHeroCategory } from "@/lib/storefront";

// Dự phòng khi Home chưa được publish trên CMS: 2 danh mục mặc định với ảnh tĩnh
const fallbackCategories = [
    {
        key: "military",
        image: militaryImg,
        href: "/shop?category=vintage-military",
    },
    {
        key: "denim",
        image: denimImg,
        href: "/shop?category=vintage-denim",
    },
] as const;

interface HeroSectionProps {
    // Lấy từ `categoryHeroSplit` của `GET /home`
    categories?: HomeHeroCategory[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
    const t = useTranslations("homepage.hero");
    const items =
        categories && categories.length > 0
            ? categories
            : fallbackCategories.map((item) => ({
                  ...item,
                  title: t(`categories.${item.key}`),
              }));

    return (
        <section className="w-full min-w-0 max-w-full h-full overflow-hidden">
            <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-1 md:grid-cols-2">
                {items.map((item, index) => (
                    <CategoryCard
                        key={item.key}
                        index={index}
                        title={item.title}
                        image={item.image}
                        href={item.href}
                        ctaText={t("cta")}
                    />
                ))}
            </div>
        </section>
    );
}
