import { useTranslations } from "next-intl";
import militaryImg from "@/assets/hero1.jpeg"; // Thay bằng đường dẫn ảnh thực tế của bạn
import denimImg from "@/assets/hero2.jpeg"; // Thay bằng đường dẫn ảnh thực tế của bạn
import CategoryCard from "@/components/CategoryCard/CategoryCard";

const categories = [
    {
        key: "military",
        image: militaryImg,
        href: "/shop?category=military",
    },
    {
        key: "denim",
        image: denimImg,
        href: "/shop?category=denim",
    },
] as const;

export default function HeroSection() {
    const t = useTranslations("homepage.hero");

    return (
        <section className="w-full min-w-0 max-w-full h-full overflow-hidden">
            <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-1 md:grid-cols-2">
                {categories.map((item, index) => (
                    <CategoryCard
                        key={item.key}
                        index={index}
                        title={t(`categories.${item.key}`)}
                        image={item.image}
                        href={item.href}
                        ctaText={t("cta")}
                    />
                ))}
            </div>
        </section>
    );
}
