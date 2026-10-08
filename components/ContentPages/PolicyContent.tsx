type PolicySection = {
    id: string;
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    details?: {
        title: string;
        paragraphs?: string[];
        bullets?: string[];
    }[];
    notes?: string[];
};

const policyContent: Record<
    "ja" | "en",
    { menu: string; sections: PolicySection[] }
> = {
    ja: {
        menu: "メニュー",
        sections: [
            {
                id: "transaction-policy",
                title: "特定商取引法に基づく表記 / ご利用ガイド",
                details: [
                    { title: "販売業者", bullets: ["Amb:STORAGE"] },
                    { title: "管理者", bullets: ["MAU LAM NGUYEN HUNG"] },
                    { title: "所在地", bullets: ["〒558-0023 大阪府大阪市住吉区山之内1-24-30-106"] },
                    {
                        title: "連絡先",
                        bullets: [
                            "電話番号：06-7164-6821 / 080-5959-2198",
                            "Email：theambitionent@gmail.com",
                            "Instagram：@amb.storage",
                        ],
                    },
                ],
                notes: ["※お問い合わせはメールまたはInstagramのDMよりお願いいたします。"],
            },
            {
                id: "pricing",
                title: "商品価格以外の必要料金",
                paragraphs: [
                    "商品価格には消費税および日本国内への配送料が含まれています。",
                    "海外発送の場合、配送料・関税・輸入税・通関手数料などの追加費用が発生する場合があります。これらの費用は配送先の国および配送方法によって異なります。",
                    "詳細はチェックアウト時にご確認いただくか、ご不明な点がございましたらお問い合わせください。",
                ],
            },
            {
                id: "payment",
                title: "お支払い方法",
                paragraphs: ["以下のお支払い方法をご利用いただけます。"],
                bullets: [
                    "クレジットカード決済",
                    "オンライン決済",
                    "銀行振込",
                    "現金（店頭のみ）",
                ],
                details: [
                    {
                        title: "クレジットカード決済",
                        bullets: ["Visa / MasterCard / AMEX / JCB"],
                    },
                    {
                        title: "オンライン決済",
                        bullets: ["Square Pay / Apple Pay / Google Pay"],
                    },
                    {
                        title: "銀行振込",
                        bullets: [
                            "金融機関：楽天銀行",
                            "支店名 ：254",
                            "口座種別：普通",
                            "口座番号：7789191",
                            "口座名義：グエン ニー（ド",
                        ],
                        paragraphs: [
                            "※お振込は３日間以内にお願いします。",
                            "※払込み手数料はお客様負担でお願い致します。",
                            "※ご入金が確認でき次第、商品を発送致します。",
                            "※払込み時の控えは紛失しないようにご注意下さい。",
                        ],
                    },
                ],
            },
            {
                id: "shipping",
                title: "商品の発送について",
                paragraphs: [
                    "商品は丁寧に検品・梱包したうえで発送いたします。発送までの日数は商品によって異なる場合がありますので、詳細は各商品ページをご確認ください。",
                ],
                bullets: [
                    "日本国内配送の場合、通常は発送後1〜3日程度でお届けとなります。",
                    "海外発送の場合、配送には約2〜4週間程度かかる場合があります。",
                    "通関手続きや配送状況により遅延が発生する場合があります。",
                ],
            },
            {
                id: "returns",
                title: "返品・交換について",
                paragraphs: [
                    "商品の品質管理には十分注意しておりますが、万が一以下のような問題があった場合には返品または交換を承ります。商品到着後7日以内にご連絡ください。",
                ],
                bullets: [
                    "誤った商品が届いた場合",
                    "配送中の事故による破損があった場合",
                    "納品商品の送り間違いの場合は、商品を返送いただいた後に正しい商品をお送りします（送料は当店が負担します）。",
                    "商品が欠品している場合は、同等価格の商品と交換または代金を返金いたします。",
                    "お届けから7日以上経過した商品、箱などが破損・紛失・破棄された商品、お客様都合の返品、注文間違い、使用後の商品は返品・交換をお受けできません。",
                ],
            },
            {
                id: "vintage",
                title: "ヴィンテージ商品の特性について",
                paragraphs: [
                    "当店で取り扱う商品は、主にヴィンテージおよびユーズドアイテムです。そのため新品とは異なり、経年による変化や使用感が見られる場合があります。",
                    "すべての商品は一点一点検品を行い、できる限り正確に状態をお伝えするよう努めております。商品状態について不明点がある場合は、ご購入前にお気軽にお問い合わせください。",
                ],
            },
            {
                id: "privacy",
                title: "プライバシーポリシー",
                paragraphs: [
                    "当店では、お客様の個人情報を適切に管理し、以下の目的の範囲内でのみ利用いたします。",
                ],
                bullets: [
                    "商品の発送",
                    "お問い合わせ対応",
                    "サービス向上のための分析",
                    "個人情報は、法令に基づく場合またはお客様の同意がある場合を除き、第三者へ提供いたしません。",
                ],
            },
            {
                id: "terms",
                title: "利用規約",
                paragraphs: [
                    "当サイトをご利用いただく際には、以下の内容に同意いただいたものとみなします。",
                ],
                bullets: [
                    "商品情報はできる限り正確に掲載しておりますが、ヴィンテージ商品の特性上、個体差が存在する場合があります。",
                    "商品写真は実物に近い色味で掲載しておりますが、モニター環境により実際の色味と異なる場合があります。",
                    "当店の商品は実店舗と在庫を共有しているため、ご注文のタイミングによっては売り切れとなる場合があります。",
                    "当サイトの内容および掲載情報は予告なく変更される場合があります。",
                ],
            },
            {
                id: "license",
                title: "古物商許可証",
                paragraphs: ["第62122R082780号"],
            },
            {
                id: "about",
                title: "Amb:STORAGEについて",
                paragraphs: [
                    "Amb:STORAGEは、ミリタリーやデニムを中心とした特別なヴィンテージ古着の買取・販売を専門とするショップです。",
                    "すべての商品は Originality（オリジナル性）、Condition（コンディション）、Collectible Value（コレクション価値）という基準をもとに厳選されています。",
                    "私たちは、ヴィンテージファッション業界で長年の経験を持つチームによって運営されています。各アイテムは丁寧に検品・選定されたうえでご紹介しています。",
                    "「ヴィンテージの価値は、価格ではなく、その一着が歩んできたストーリーにある。」私たちはそう信じています。",
                ],
            },
            {
                id: "contact",
                title: "お問い合わせ",
                paragraphs: ["ご不明な点がございましたら、お気軽にお問い合わせください"],
            },
        ],
    },
    en: {
        menu: "Menu",
        sections: [
            {
                id: "transaction-policy",
                title: "Specified Commercial Transactions / User Guide",
                details: [
                    { title: "Seller", bullets: ["Amb:STORAGE"] },
                    { title: "Administrator", bullets: ["MAU LAM NGUYEN HUNG"] },
                    { title: "Address", bullets: ["1-24-30-106 Yamanouchi, Sumiyoshi-ku, Osaka 558-0023, Japan"] },
                    {
                        title: "Contact",
                        bullets: [
                            "Phone: 06-7164-6821 / 080-5959-2198",
                            "Email: theambitionent@gmail.com",
                            "Instagram: @amb.storage",
                        ],
                    },
                ],
                notes: ["Please contact us by email or Instagram DM."],
            },
            {
                id: "pricing",
                title: "Additional Charges",
                paragraphs: [
                    "Prices include consumption tax and domestic shipping within Japan.",
                    "International orders may incur shipping fees, customs duties, import taxes, and customs clearance fees. These costs vary by destination and shipping method.",
                    "Please confirm the details at checkout or contact us if you have any questions.",
                ],
            },
            {
                id: "payment",
                title: "Payment Methods",
                paragraphs: ["The following payment methods are available."],
                bullets: [
                    "Credit card (Visa / MasterCard / AMEX / JCB)",
                    "Online payment (Square Pay / Apple Pay / Google Pay)",
                    "Bank transfer (Rakuten Bank, ordinary account 7789191)",
                    "Cash (in-store only)",
                    "Bank transfers must be completed within three days. Transfer fees are the customer's responsibility.",
                ],
            },
            {
                id: "shipping",
                title: "Shipping",
                paragraphs: [
                    "All products are carefully inspected, packed, and shipped. Processing times vary by product, so please check the individual product page.",
                ],
                bullets: [
                    "Domestic delivery usually arrives within 1–3 days after shipment.",
                    "International delivery may take approximately 2–4 weeks.",
                    "Customs procedures and delivery conditions may cause delays.",
                ],
            },
            {
                id: "returns",
                title: "Returns and Exchanges",
                paragraphs: [
                    "If the wrong item arrives or an item is damaged during delivery, please contact us within seven days of delivery for a return or exchange.",
                ],
                bullets: [
                    "We cover the return shipping cost for an incorrect shipment.",
                    "If an item is unavailable, we will offer an item of equivalent value or issue a refund.",
                    "Returns are not accepted after seven days, for customer preference or order mistakes, after use, or when packaging has been damaged, lost, or discarded.",
                ],
            },
            {
                id: "vintage",
                title: "Vintage Item Characteristics",
                paragraphs: [
                    "Our products are primarily vintage and used items, so they may show age-related changes and signs of wear that differ from new products.",
                    "Every item is individually inspected and described as accurately as possible. Please contact us before purchase if you have questions about condition.",
                ],
            },
            {
                id: "privacy",
                title: "Privacy Policy",
                paragraphs: [
                    "We manage personal information appropriately and use it only for the following purposes.",
                ],
                bullets: [
                    "Shipping products",
                    "Responding to inquiries",
                    "Analyzing and improving our services",
                    "We do not provide personal information to third parties unless required by law or with the customer's consent.",
                ],
            },
            {
                id: "terms",
                title: "Terms of Use",
                paragraphs: [
                    "By using this site, you are deemed to agree to the following terms.",
                ],
                bullets: [
                    "Product information is provided as accurately as possible, but vintage items may have individual differences.",
                    "Product photos may look different depending on the monitor environment.",
                    "Inventory is shared with our physical store, so an item may sell out depending on order timing.",
                    "Site content and listed information may change without notice.",
                ],
            },
            {
                id: "license",
                title: "Secondhand Dealer License",
                paragraphs: ["No. 62122R082780"],
            },
            {
                id: "about",
                title: "About Amb:STORAGE",
                paragraphs: [
                    "Amb:STORAGE specializes in buying and selling distinctive vintage clothing, with a focus on military and denim.",
                    "Every item is selected according to Originality, Condition, and Collectible Value.",
                    "Our team has many years of experience in the vintage fashion industry. Each item is carefully inspected and selected before it is presented.",
                    "We believe that the value of vintage lies not in its price, but in the story of the garment and the journey it has taken.",
                ],
            },
            {
                id: "contact",
                title: "Contact",
                paragraphs: [
                    "Please contact us by email or Instagram if you have any questions.",
                ],
            },
        ],
    },
};

export default function PolicyContent({ locale }: { locale: string }) {
    const content = policyContent[locale === "ja" ? "ja" : "en"];

    return (
        <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-8 md:pb-28 mt-5">
            <section
                className="bg-[#eef5f0] px-5 py-8 md:px-10"
                aria-labelledby="policy-menu-title"
            >
                <h2
                    id="policy-menu-title"
                    className="text-2xl font-bold text-(--brand-green) md:text-3xl"
                >
                    {content.menu}
                </h2>
                <ol className="mt-5 space-y-2 text-sm leading-7 text-gray-700 md:text-base">
                    {content.sections.map((section, index) => (
                        <li key={section.id} className="flex items-baseline gap-1">
                            <span className="w-8 shrink-0 tabular-nums">{index + 1}.</span>
                            <a
                                className="underline-offset-4 transition-colors hover:text-(--brand-green) hover:underline"
                                href={`#${section.id}`}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="mt-10 divide-y divide-gray-200 border-t border-gray-200">
                {content.sections.map((section) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className="scroll-mt-24 py-5 md:py-8"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-(--brand-green) md:text-3xl">
                            {section.title}
                        </h2>
                        <div className="mt-5 space-y-4 text-sm leading-8 text-gray-700 md:text-base">
                            {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                            {section.bullets && (
                                <ul className="list-disc space-y-2 pl-5">
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                            {section.details?.map((detail) => (
                                <div key={detail.title} className="space-y-2">
                                    <h3 className="font-semibold text-black">{detail.title}</h3>
                                    {detail.paragraphs?.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                    {detail.bullets && (
                                        <ul className="list-disc space-y-2 pl-5">
                                            {detail.bullets.map((bullet) => (
                                                <li key={bullet}>{bullet}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                            {section.notes?.map((note) => <p key={note}>{note}</p>)}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
