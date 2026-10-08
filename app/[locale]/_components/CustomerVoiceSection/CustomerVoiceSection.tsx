import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";
import CustomerVoiceCard from "./CustomerVoiceCard";

interface CustomerVoiceItem {
  id: string | number;
  name: string;
  quote: string;
  image: string | StaticImageData;
  href: string;
}

interface CustomerVoiceSectionProps {
  testimonials: CustomerVoiceItem[];
}

export default function CustomerVoiceSection({
  testimonials,
}: CustomerVoiceSectionProps) {
  const t = useTranslations("homepage.customerVoice");

  return (
    <section className="w-full bg-[#ebedef] py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-(--brand-green) md:text-4xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-3 md:gap-24">
          {testimonials.map((item, index) => (
            <CustomerVoiceCard
              key={item.id}
              name={item.name}
              quote={item.quote}
              image={item.image}
              href={item.href}
              viewProductLabel={t("viewProduct")}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
