import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CheckoutResult from "../_components/CheckoutResult/CheckoutResult";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("checkout.cancel");
    // Trang kết quả thanh toán không cần index
    return { title: t("title"), robots: { index: false, follow: false } };
}

export default function CheckoutCancelPage() {
    return <CheckoutResult status="cancel" />;
}
