import { useTranslations } from "next-intl";
import militaryImg from "@/assets/hero1.jpeg"; // Thay bằng đường dẫn ảnh thực tế của bạn
import denimImg from "@/assets/hero2.jpeg";       // Thay bằng đường dẫn ảnh thực tế của bạn
import CategoryCard from "@/components/CategoryCard/CategoryCard";

const categories = [
  {
    key: "military",
    image: militaryImg,
    href: "/shop-now/vintage",
  },
  {
    key: "denim",
    image: denimImg,
    href: "/shop-now/modern",
  },
] as const;

export default function HeroSection() {
  const t = useTranslations("homepage.hero");

  return (
    <section className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
