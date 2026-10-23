import CartView from "./_components/CartView/CartView";

export default async function CartPage({
    searchParams,
}: PageProps<"/[locale]/cart">) {
    const { checkout } = await searchParams;
    // Stripe redirect về `?checkout=success|cancel`; chỉ để hiện thông báo, không đổi trạng thái thanh toán
    const checkoutStatus =
        checkout === "success" || checkout === "cancel" ? checkout : null;

    return <CartView checkoutStatus={checkoutStatus} />;
}
