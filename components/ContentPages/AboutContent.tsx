import { Link } from "@/i18n/navigation";

type AboutSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  details?: { label: string; value: string }[];
  values?: { title: string; description: string }[];
};

const content: Record<"ja" | "en", AboutSection[]> = {
  ja: [
    {
      id: "company",
      title: "会社概要",
      details: [
        { label: "社名", value: "NGUYEN NHI合同会社" },
        { label: "代表社員", value: "NGUYEN THUY NHI" },
        { label: "店舗", value: "Amb:STORAGE" },
        { label: "事業内容", value: "ミリタリーおよびデニムを中心としたヴィンテージ古着の買取・販売を行っています。" },
        { label: "問い合わせ先", value: "電話番号：06-7164-6821 / 080-5959-2198\nメール: theambitionent@gmail.com\nInstagram: @amb.storage" },
        { label: "古物商許可証", value: "第６２１２２Ｒ０８２７８０号" },
      ],
    },
    {
      id: "philosophy",
      title: "ブランド理念",
      paragraphs: [
        "ヴィンテージの価値は、価格ではなく、その一着が歩んできたストーリーにある。",
        "私たちはヴィンテージを単なる古い衣服としてではなく、時代を越えて受け継がれてきた歴史と文化の一部であると考えています。",
      ],
    },
    {
      id: "mission",
      title: "Mission",
      paragraphs: [
        "私たちは、ミリタリーやデニムを中心としたヴィンテージアイテムを「オリジナル性」「コンディション」「コレクション価値」という基準で厳選し、その価値や背景を正しく伝えることを使命としています。\n単なる売買にとどまらず、アイテムが持つ歴史やストーリーを共有し、お客様が安心してヴィンテージを楽しめる環境をつくることを大切にしています。",
      ],
    },
    {
      id: "vision",
      title: "Vision",
      paragraphs: [
        "ヴィンテージ文化を広め、コレクターから初心者までが安心して楽しめる信頼性の高いヴィンテージコミュニティを育てていきたいと考えています。\nまた、ブログ「Mili Talks」を通して知識や経験を共有し、ヴィンテージを一過性の流行ではなく、次の世代へと受け継がれる文化として広げていくことを目指しています。",
      ],
    },
    {
      id: "values",
      title: "Core Values",
      values: [
        { title: "1. Authenticity（オリジナルへのこだわり）", description: "ヴィンテージの本質であるオリジナル性を何よりも重視します。" },
        { title: "2. Quality over Quantity（量より質）", description: "取扱点数よりも、一点一点の品質と価値を大切にします。" },
        { title: "3. Transparency（透明性）", description: "商品の状態や情報をできる限り正確にお伝えし、安心して購入できる環境を提供します。" },
        { title: "4. Knowledge Sharing（知識の共有）", description: "経験や情報を積極的に発信し、ヴィンテージ文化の理解を深めていきます。" },
        { title: "5. Respect for History（歴史への敬意）", description: "ヴィンテージは単なる衣服ではなく、時代のストーリーを持つ存在だと考えています。" },
        { title: "6. Trust（信頼）", description: "お客様との長期的な信頼関係を最も大切にしています。" },
      ],
    },
    {
      id: "promise",
      title: "Our Promise",
      paragraphs: [
        "私たちは、知識と経験に基づき商品を厳選し、オリジナル性・状態・背景をできる限り正確に確認したうえでご紹介しています。\nヴィンテージ市場では情報の不透明さが問題になることもありますが、お客様が安心して購入できるよう、誠実で透明性のある販売を心がけています。\n「買ってよかった」と思っていただける一着を届けること。それが私たちの最も大切な責任です。",
      ],
    },
    {
      id: "knowledge",
      title: "Knowledge & Community",
      paragraphs: [
        "私たちは売買だけでなく、ブログ「Mili Talks」を通してヴィンテージに関する知識や経験を共有しています。\n歴史やディテール、見分け方などを発信することで、ヴィンテージ文化の理解を深め、より多くの人がこの世界を楽しめるよう貢献したいと考えています。",
      ],
    },
    {
      id: "contact",
      title: "お問い合わせ",
      paragraphs: ["ご不明な点がございましたら、お気軽にお問い合わせください"],
    },
  ],
  en: [
    {
      id: "company",
      title: "Company Overview",
      details: [
        { label: "Company", value: "NGUYEN NHI LLC" },
        { label: "Representative", value: "NGUYEN THUY NHI" },
        { label: "Store", value: "Amb:STORAGE" },
        { label: "Business", value: "We buy and sell vintage clothing, with a focus on military and denim items." },
        { label: "Contact", value: "Phone: 06-7164-6821 / 080-5959-2198\nEmail: theambitionent@gmail.com\nInstagram: @amb.storage" },
        { label: "Secondhand Dealer License", value: "No. 62122R082780" },
      ],
    },
    {
      id: "philosophy",
      title: "Brand Philosophy",
      paragraphs: [
        "The value of vintage lies not in its price, but in the story of the garment and the journey it has taken.",
        "We see vintage not simply as old clothing, but as part of the history and culture passed down through the ages.",
      ],
    },
    {
      id: "mission",
      title: "Mission",
      paragraphs: [
        "We carefully select vintage items, especially military and denim, based on Originality, Condition, and Collectible Value, and accurately communicate their value and background.\nBeyond buying and selling, we share the history and stories behind each item and create an environment where customers can enjoy vintage with confidence.",
      ],
    },
    {
      id: "vision",
      title: "Vision",
      paragraphs: [
        "We aim to spread vintage culture and build a trusted vintage community where everyone from collectors to beginners can enjoy it with confidence.\nThrough our blog, Mili Talks, we share knowledge and experience and pass vintage on as a culture for future generations rather than a passing trend.",
      ],
    },
    {
      id: "values",
      title: "Core Values",
      values: [
        { title: "1. Authenticity", description: "We value originality as the essence of vintage above all else." },
        { title: "2. Quality over Quantity", description: "We prioritize the quality and value of each item over the number of items we carry." },
        { title: "3. Transparency", description: "We communicate product condition and information as accurately as possible." },
        { title: "4. Knowledge Sharing", description: "We actively share experience and information to deepen understanding of vintage culture." },
        { title: "5. Respect for History", description: "Vintage is more than clothing; it carries the story of its time." },
        { title: "6. Trust", description: "We value long-term relationships of trust with our customers above all." },
      ],
    },
    {
      id: "promise",
      title: "Our Promise",
      paragraphs: [
        "We select products based on knowledge and experience, carefully checking their originality, condition, and background before presenting them.\nBecause information can be unclear in the vintage market, we strive to sell with honesty and transparency so customers can purchase with confidence.\nDelivering an item that makes you feel it was worth buying is our most important responsibility.",
      ],
    },
    {
      id: "knowledge",
      title: "Knowledge & Community",
      paragraphs: [
        "We share knowledge and experience about vintage through our blog, Mili Talks, in addition to buying and selling.\nBy sharing history, details, and identification tips, we hope to deepen understanding of vintage culture and help more people enjoy this world.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: ["Please feel free to contact us if you have any questions."],
    },
  ],
};

export default function AboutContent({ locale }: { locale: string }) {
  const sections = content[locale === "ja" ? "ja" : "en"];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-8 md:pb-28">
      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {sections.map((section) => (
          <section key={section.id} className="scroll-mt-24 py-10 md:py-14">
            <h2 className="text-2xl font-bold text-(--brand-green) md:text-3xl">{section.title}</h2>
            {section.details && (
              <dl className="mt-6 space-y-5 text-sm leading-8 text-gray-700 md:text-base">
                {section.details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="font-semibold text-black">{detail.label}</dt>
                    <dd className="whitespace-pre-line">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-700 md:text-base">
                {paragraph}
              </p>
            ))}
            {section.values && (
              <div className="mt-6 space-y-5 text-sm leading-8 text-gray-700 md:text-base">
                {section.values.map((value) => (
                  <div key={value.title}>
                    <h3 className="font-semibold text-black">{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>
            )}
            {section.id === "company" && (
              <p className="mt-5 text-sm leading-8 text-gray-700 md:text-base">
                <Link href="/policy" className="text-(--brand-green) underline underline-offset-4">
                  {locale === "ja" ? "特定商取引法に基づく表記 / ご利用ガイドはこちら。" : "View the specified commercial transactions and user guide here."}
                </Link>
              </p>
            )}
          </section>
        ))}
      </div>
      <a href="#top" className="mt-8 block text-center text-sm text-(--brand-green) underline underline-offset-4">
        {locale === "ja" ? "TOPに戻る" : "Back to top"}
      </a>
    </div>
  );
}
