import { notFound } from "next/navigation";

// Bắt mọi URL không khớp route nào dưới [locale] để hiện not-found.tsx (có header/footer + bản dịch)
export default function CatchAllPage() {
    notFound();
}
