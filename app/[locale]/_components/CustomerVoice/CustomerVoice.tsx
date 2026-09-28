import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";
import CustomerVoiceCard from "./CustomerVoiceCard";

interface CustomerVoiceItem {
  id: string | number;
  name: string;
  quote: string;
  products: { image: string | StaticImageData; href: string }[];
}

interface CustomerVoiceSectionProps {
  testimonials: CustomerVoiceItem[];
}

export default function CustomerVoiceSection({
  testimonials,
}: CustomerVoiceSectionProps) {
  const t = useTranslations("homepage.customerVoice");

  return (
    <section className="w-full bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-10 text-center text-2xl md:text-3xl font-bold text-[#1B3B2B] tracking-tight">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <CustomerVoiceCard
              key={item.id}
              name={item.name}
              quote={item.quote}
              products={item.products}
              viewProductLabel={t("viewProduct")}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
