import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CustomerVoiceCard from "@/components/CustomerVoiceCard/CustomerVoiceCard";
import type { CustomerVoice } from "@/lib/storefront";

// Trang chủ chỉ hiện vài đánh giá đầu (theo thứ tự admin sắp), phần còn lại ở /customer-voice
const HOME_VOICE_LIMIT = 3;

interface CustomerVoiceSectionProps {
  voices: CustomerVoice[];
}

export default function CustomerVoiceSection({ voices }: CustomerVoiceSectionProps) {
  const t = useTranslations("homepage.customerVoice");
  const shown = voices.slice(0, HOME_VOICE_LIMIT);

  return (
    <section className="w-full bg-[#ebedef] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <h2 className="text-3xl font-bold text-(--brand-green) md:text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 tracking-[0.06em] text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {shown.map((voice, index) => (
            <CustomerVoiceCard key={voice.id} voice={voice} index={index} clampQuote />
          ))}
        </div>

        {voices.length > shown.length && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/customer-voice"
              className="group inline-flex items-center gap-2 border-2 border-(--brand-green) px-6 py-3 text-sm font-semibold text-(--brand-green) transition-colors hover:bg-(--brand-green) hover:text-white"
            >
              {t("viewAll", { count: voices.length })}
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
