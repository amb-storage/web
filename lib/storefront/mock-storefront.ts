import { categories, collections, homepage, products, stories, storeSettings } from "@/data/mock";
import { filterAndSortProducts } from "./filters";
import type { StorefrontRepository } from "./repository";
import type { ProductQuery } from "./types";

export const mockStorefrontRepository: StorefrontRepository = {
  async getHomepage() {
    return homepage;
  },
  async getProducts(query?: ProductQuery) {
    return filterAndSortProducts(products, query);
  },
  async getProductBySlug(slug) {
    return products.find((product) => product.slug === slug) ?? null;
  },
  async getCategories() {
    return categories;
  },
  async getCollections() {
    return collections;
  },
  async getStories() {
    return stories;
  },
  async getStoryBySlug(slug) {
    return stories.find((story) => story.slug === slug) ?? null;
  },
  async getStoreSettings() {
    return storeSettings;
  },
};
