import type { StaticImageData } from "next/image";

export type Locale = "ja" | "en";
export type LocalizedText = Record<Locale, string>;
export type Availability = "AVAILABLE" | "LOW_STOCK" | "SOLD_OUT";
export type Currency = "JPY";

export interface Money {
  amount: number;
  currency: Currency;
}

export type ProductImage = string | StaticImageData;

export interface ProductTag {
  id: string;
  label: LocalizedText;
  variant?: "default" | "accent" | "brand";
}

export type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string }
  | { type: "divider" };

export type StoryContentSection =
  | {
      type: "richText";
      contentHtml: LocalizedText;
      tone?: "white" | "muted";
    }
  | {
      type: "imageText";
      image: ProductImage;
      contentHtml: LocalizedText;
      reverse?: boolean;
      tone?: "white" | "muted";
    }
  | {
      type: "contact";
      title: LocalizedText;
      description: LocalizedText;
    };

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  price: Money;
  size: string;
  category: "military" | "denim";
  period: string;
  images: ProductImage[];
  availability: Availability;
  tags: ProductTag[];
  publishedAt: string;
  description: LocalizedText;
  condition?: LocalizedText;
  measurements?: LocalizedText;
}

export type ProductSort = "newest" | "price-low" | "price-high";

export interface ProductQuery {
  search?: string;
  category?: string;
  period?: string;
  price?: string;
  size?: string;
  sort?: ProductSort;
}

export interface Story {
  slug: string;
  title: string;
  date: string;
  coverImage: ProductImage;
  excerpt: LocalizedText;
  contentHtml: LocalizedText;
  contentSections?: StoryContentSection[];
}

export interface StorefrontTaxonomy {
  id: string;
  name: LocalizedText;
}

export interface HomepageCollections {
  specialVintage: string[];
  mostPopular: string[];
  newArrivals: string[];
  customerVoices: Array<{
    id: string;
    name: string;
    quote: string;
    productId: string;
  }>;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  taxNote: LocalizedText;
  socialLinks: Array<{ label: string; href: string }>;
  shippingReturns: Record<Locale, DescriptionBlock[]>;
}
