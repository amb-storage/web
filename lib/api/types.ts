// Kiểu dữ liệu trả về từ backend `/api/v1` (khớp với DTO public-store / cart / customer-auth bên amb/api).
// Response đã được backend chọn sẵn 1 ngôn ngữ theo `Accept-Language`.

export type ApiLocale = "ja" | "en";

export type ApiAvailability =
    | "AVAILABLE"
    | "TEMPORARILY_UNAVAILABLE"
    | "SOLD_OUT"
    | "UNAVAILABLE";

export interface ApiErrorBody {
    statusCode: number;
    code: string;
    message: string | string[];
    requestId: string;
    timestamp: string;
    path: string;
}

export interface ApiPage<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiTaxonomySummary {
    id: string;
    slug: string;
    label: string;
}

export interface ApiMediaSummary {
    id: string;
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
}

export interface ApiSeo {
    title: string | null;
    description: string | null;
}

/* ---------- Catalog ---------- */

export interface ApiProductSummary {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    condition: string | null;
    price: number;
    size: string | null;
    quantity: number | null;
    availability: ApiAvailability;
    categories: ApiTaxonomySummary[];
    primaryMedia: ApiMediaSummary | null;
    secondaryMedia: ApiMediaSummary | null;
    publishedAt: string;
}

export interface ApiProductDetailEntry {
    key: string;
    label: string;
    value: string;
}

export interface ApiPolicyLink {
    slug: string;
    href: string;
    label: string;
}

export interface ApiProductDetail extends ApiProductSummary {
    seo: { title: string; description: string | null };
    details: ApiProductDetailEntry[];
    media: ApiMediaSummary[];
    policyLinks: ApiPolicyLink[];
}

export interface ApiFacetOption extends ApiTaxonomySummary {
    count: number;
}

export interface ApiProductFacets {
    categories: ApiFacetOption[];
    sizes: ApiFacetOption[];
    minPrice: number | null;
    maxPrice: number | null;
}

export type ApiProductSort = "newest" | "price_asc" | "price_desc";

export interface ApiProductListQuery {
    category?: string[];
    size?: string[];
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: ApiProductSort;
    page?: number;
    limit?: number;
}

/* ---------- Rich text ---------- */

export type ApiRichTextMark =
    | { type: "bold" }
    | { type: "italic" }
    | { type: "link"; href: string };

export type ApiRichTextNode =
    | { type: "doc"; content: ApiRichTextNode[] }
    | { type: "paragraph"; content: ApiRichTextNode[] }
    | { type: "heading"; level: 1 | 2 | 3; content: ApiRichTextNode[] }
    | { type: "bulletList"; content: ApiRichTextNode[] }
    | { type: "orderedList"; content: ApiRichTextNode[] }
    | { type: "listItem"; content: ApiRichTextNode[] }
    | { type: "blockquote"; content: ApiRichTextNode[] }
    | { type: "hardBreak" }
    | { type: "text"; text: string; marks?: ApiRichTextMark[] };

export interface ApiRichTextDocument {
    type: "doc";
    content: ApiRichTextNode[];
}

/* ---------- CMS sections ---------- */

export interface ApiCta {
    label: string;
    href: string;
    variant: "PRIMARY" | "SECONDARY" | "TEXT";
    target: "SAME_TAB" | "NEW_TAB";
}

export interface ApiCollectionSummary {
    id: string;
    slug: string;
    title: string;
    description: string | null;
}

export interface ApiStoryCard {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverMedia: ApiMediaSummary;
    publishedAt: string;
}

type Spacing = "SMALL" | "MEDIUM" | "LARGE";
type Width = "NARROW" | "STANDARD" | "WIDE";
type Alignment = "LEFT" | "CENTER" | "RIGHT";

export type ApiSection =
    | {
          id: string;
          type: "HERO";
          alignment: Alignment;
          background: "WHITE" | "LIGHT_GRAY" | "BRAND_GREEN";
          spacing: Spacing;
          actions: ApiCta[];
      }
    | { id: string; type: "RICH_TEXT"; body: ApiRichTextDocument; width: Width }
    | {
          id: string;
          type: "IMAGE";
          media: ApiMediaSummary;
          alt: string | null;
          width: Width;
      }
    | {
          id: string;
          type: "IMAGE_WITH_TEXT";
          media: ApiMediaSummary;
          imagePosition: "LEFT" | "RIGHT";
          alignment: Alignment;
          content: Array<
              | { type: "RICH_TEXT"; body: ApiRichTextDocument }
              | { type: "CTA"; cta: ApiCta }
          >;
      }
    | {
          id: string;
          type: "CONTACT";
          heading: string;
          body: ApiRichTextDocument;
      }
    | { id: string; type: "GALLERY"; media: ApiMediaSummary[] }
    | {
          id: string;
          type: "QUOTE";
          text: string;
          attribution: string | null;
      }
    | { id: string; type: "DIVIDER"; spacing: Spacing }
    | { id: string; type: "SPACER"; spacing: Spacing }
    | { id: string; type: "PRODUCT_GRID"; products: ApiProductSummary[] }
    | { id: string; type: "PRODUCT_CAROUSEL"; products: ApiProductSummary[] }
    | { id: string; type: "FEATURED_PRODUCT"; product: ApiProductSummary }
    | {
          id: string;
          type: "COLLECTION_GRID";
          collections: ApiCollectionSummary[];
      }
    | {
          id: string;
          type: "TALK_HEADER";
          coverMedia: ApiMediaSummary;
          excerpt: string;
      }
    | { id: string; type: "MILI_TALK_GRID"; talks: ApiStoryCard[] }
    | { id: string; type: "FEATURED_MILI_TALK"; talk: ApiStoryCard };

/* ---------- Home / content ---------- */

export interface ApiHomeHeroSide {
    category: ApiTaxonomySummary;
    media: ApiMediaSummary;
    label: string;
    href: string;
}

export interface ApiProductRail {
    products: ApiProductSummary[];
}

export interface ApiCustomerVoiceItem {
    id: string;
    name: string | null;
    quote: string;
    product?: ApiProductSummary;
}

export interface ApiStoriesIntro {
    heading: string;
    introduction: string;
    supportingText: string | null;
}

export interface ApiHome {
    schemaVersion: 2;
    slug: "home";
    title: string | null;
    seo: ApiSeo | null;
    categoryHeroSplit: { left: ApiHomeHeroSide; right: ApiHomeHeroSide };
    specialVintage?: ApiProductRail;
    newArrivals?: ApiProductRail;
    mostPopular?: ApiProductRail;
    customerVoice?: { items: ApiCustomerVoiceItem[] };
    miliTalksIntro?: ApiStoriesIntro;
    featuredMiliTalk?: ApiStoryCard;
}

export interface ApiCmsPage {
    slug: string;
    title: string | null;
    seo: ApiSeo | null;
    sections: ApiSection[];
}

export interface ApiAboutRichTextBlock {
    heading: string | null;
    body: ApiRichTextDocument;
}

export interface ApiAbout {
    schemaVersion: 2;
    slug: string;
    title: string;
    seo: ApiSeo | null;
    companyOverview: Array<{ id: string; label: string; value: string }>;
    brandPhilosophy: ApiAboutRichTextBlock;
    mission: ApiRichTextDocument;
    vision: ApiRichTextDocument;
    coreValues: Array<{
        id: string;
        title: string;
        body: string;
        position: number;
    }>;
    promise: ApiRichTextDocument;
    knowledgeCommunity: ApiRichTextDocument;
    contact: ApiAboutRichTextBlock;
}

export interface ApiPolicySummary {
    slug: string;
    title: string;
    effectiveAt: string;
}

export interface ApiPolicySection {
    id: string;
    anchorKey: string;
    title: string;
    paragraphs: string[];
    bullets: string[];
    details: Array<{
        id: string;
        title: string | null;
        paragraphs: string[];
        bullets: string[];
    }>;
    notes: string[];
}

export interface ApiPolicyDetail {
    schemaVersion: 2;
    slug: string;
    title: string;
    effectiveAt: string;
    sections: ApiPolicySection[];
    seo: ApiSeo | null;
}

// Landing Mili Talks do admin soạn (`GET /content/stories`)
export interface ApiStoriesLanding {
    schemaVersion: 2;
    slug: string;
    title: string | null;
    seo: ApiSeo | null;
    intro: ApiStoriesIntro;
    featuredTalk?: ApiStoryCard;
    grids: Array<{
        id: string;
        title: string;
        description: string | null;
        talks: ApiStoryCard[];
    }>;
    references: Array<{ id: string; title: string; items: string[] }> | null;
}

export interface ApiStoryDetail extends ApiStoryCard {
    seo: ApiSeo | null;
    sections: ApiSection[];
}

/* ---------- Navigation / settings ---------- */

export interface ApiNavigationItem {
    label: string;
    href: string;
    external: boolean;
    children: ApiNavigationItem[];
}

export interface ApiStoreSettings {
    defaultCurrency: string;
    storeName: string | null;
    contactEmail: string | null;
    instagramUrl: string | null;
    taxDisplayMode: "NONE" | "TAX_INCLUDED" | "TAX_EXCLUDED";
    taxNote: string | null;
    footerText: string | null;
    socialLinks: Array<{ label: string; href: string }>;
    shippingPolicy: ApiPolicyLink | null;
    returnsPolicy: ApiPolicyLink | null;
}

/* ---------- Cart / checkout ---------- */

export interface ApiCartPrice {
    currency: string;
    amount: number;
}

export interface ApiCartItem {
    productId: string;
    quantity: number;
    product: { id: string; slug: string; name: string } | null;
    size: string | null;
    status: "ELIGIBLE" | "UNAVAILABLE" | "NOT_PURCHASABLE";
    availability: ApiAvailability;
    reason: string | null;
    unitPrice: ApiCartPrice | null;
    lineTotal: ApiCartPrice | null;
}

export interface ApiCart {
    id: string;
    status: "ACTIVE" | "EXPIRED";
    expiresAt: string | null;
    currency: string;
    itemCount: number;
    items: ApiCartItem[];
    subtotal: ApiCartPrice;
}

// Body `POST /checkout/sessions`; prefecture bắt buộc khi country là Nhật (JP / JPN / JAPAN / 日本)
export interface ApiShippingAddress {
    country: string;
    postalCode: string;
    prefecture?: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
}

export interface ApiCheckoutSessionInput {
    email: string;
    successUrl: string;
    cancelUrl: string;
    recipientName: string;
    phoneNumber: string;
    shippingAddress: ApiShippingAddress;
}

export interface ApiCheckoutSession {
    orderId: string;
    checkoutUrl: string;
}

/* ---------- Customer auth ---------- */

export interface ApiCustomerOtpAccepted {
    status: "accepted";
    challengeId: string;
    expiresAt: string;
}

export interface ApiCustomerAuth {
    customer: { id: string; email: string; status: "ACTIVE" };
    session: { createdAt: string; expiresAt: string; lastSeenAt: string };
}

/* ---------- Contact (お問い合わせ) ---------- */

export const CONTACT_CATEGORIES = ["PRODUCT", "BUYING", "ORDER", "FEEDBACK", "OTHER"] as const;
export type ApiContactCategory = (typeof CONTACT_CATEGORIES)[number];

// POST /contact — hợp đồng theo amb-portal/docs/CONTACT_API_PROPOSAL.md
export interface ApiContactRequest {
    name: string;
    email: string;
    category: ApiContactCategory;
    subject: string;
    message: string;
    orderNumber: string | null;
    locale: ApiLocale;
    // Honeypot chống bot: người thật không thấy ô này nên luôn để trống
    website: string;
}

export interface ApiContactAccepted {
    id: string;
}
