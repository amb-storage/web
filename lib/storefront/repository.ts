import type {
  HomepageCollections,
  Product,
  ProductQuery,
  StoreSettings,
  Story,
  StorefrontTaxonomy,
} from "./types";

export interface StorefrontRepository {
  getHomepage(): Promise<HomepageCollections>;
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<StorefrontTaxonomy[]>;
  getCollections(): Promise<StorefrontTaxonomy[]>;
  getStories(): Promise<Story[]>;
  getStoryBySlug(slug: string): Promise<Story | null>;
  getStoreSettings(): Promise<StoreSettings>;
}
