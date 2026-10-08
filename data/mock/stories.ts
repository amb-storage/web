import jacket2 from "@/assets/jacket-2.jpeg";
import jacket4 from "@/assets/jacket-4.jpeg";
import jacket6 from "@/assets/jacket-6.jpeg";
import type { Story } from "@/lib/storefront/types";

export const stories: Story[] = [
  {
    slug: "ma-1-bomber-flight-jacket-revisiting-the-story",
    title: "MA-1 Bomber Flight Jacket - Revisiting the Story",
    date: "2026年8月12日",
    coverImage: jacket4,
    excerpt: {
      ja: "空軍パイロット用に開発されたMA-1は、やがて民間のファッションアイテムへと姿を変えていきました。",
      en: "Originally developed for Air Force pilots, the MA-1 eventually crossed over into civilian fashion.",
    },
    contentHtml: {
      ja: "<p>MA-1フライトジャケットは、1950年代初頭にアメリカ空軍のパイロット向けに開発されたアウターです。</p><h2>選ぶときに見るポイント</h2><p>タグ、裏地、ジッパーの細部を見比べると、年代ごとの個性が見えてきます。</p>",
      en: "<p>The MA-1 flight jacket was developed in the early 1950s for U.S. Air Force pilots as cold-weather gear.</p><h2>A few things worth checking</h2><p>Comparing tags, linings, and zipper details is part of the fun.</p>",
    },
  },
  {
    slug: "us-navy-n1-deck-jacket-unlocking-the-details",
    title: "U.S NAVY N-1 Deck Jacket - Unlocking the Details",
    date: "2026年7月2日",
    coverImage: jacket2,
    excerpt: {
      ja: "甲板作業員のために作られたN-1デッキジャケット。その静かな機能美を覗いてみます。",
      en: "Built for deck crews working in rough weather, the N-1 deck jacket hides real function beneath its rugged looks.",
    },
    contentHtml: {
      ja: "<p>N-1デッキジャケットは、第二次世界大戦中に米海軍の甲板作業員向けとして採用されたアウターです。</p>",
      en: "<p>The N-1 deck jacket was issued to U.S. Navy deck crews during World War II, built to handle wind and cold.</p>",
    },
  },
  {
    slug: "a-short-history-of-the-denim-jacket",
    title: "A Short History of the Denim Jacket",
    date: "2026年5月18日",
    coverImage: jacket6,
    excerpt: {
      ja: "作業着として生まれ、いまや定番アイテムとなったデニムジャケットの歩みを振り返ります。",
      en: "From workwear to wardrobe staple — a quick look at how the denim jacket got here.",
    },
    contentHtml: {
      ja: "<p>デニムジャケットは、鉱山や鉄道など、過酷な現場で働く労働者のための作業着として生まれました。</p>",
      en: "<p>The denim jacket started life as workwear built to take a beating, then became a wardrobe staple.</p>",
    },
  },
];
