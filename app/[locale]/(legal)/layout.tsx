import AboutUsHeader from "@/components/ContentPages/AboutUsHeader";

// Layout chung của About / Policy: header + tab nằm ở đây nên không bị mount lại khi đổi tab,
// nhờ vậy gạch chân của tab trượt được qua lại thay vì nhảy
export default function LegalLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <article id="top" className="w-full">
      <AboutUsHeader />
      {children}
    </article>
  );
}
