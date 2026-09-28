import type { StaticImageData } from "next/image";
import jacket4 from "@/assets/jacket-4.jpeg";
import jacket2 from "@/assets/jacket-2.jpeg";
import jacket6 from "@/assets/jacket-6.jpeg";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  coverImage: StaticImageData;
  excerpt: Record<"ja" | "en", string>;
  contentHtml: Record<"ja" | "en", string>;
}

// Mock nội dung blog - contentHtml là chuỗi HTML tĩnh (viết tay, không phải scrape từ site thật),
// render trực tiếp qua dangerouslySetInnerHTML vì đây là nội dung tự viết/kiểm soát được, không
// phải input người dùng.
export const blogPosts: BlogPost[] = [
  {
    slug: "ma-1-bomber-flight-jacket-revisiting-the-story",
    title: "MA-1 Bomber Flight Jacket - Revisiting the Story",
    date: "2026年8月12日",
    coverImage: jacket4,
    excerpt: {
      ja: "空軍パイロット用に開発されたMA-1は、やがて民間のファッションアイテムへと姿を変えていきました。誕生の背景を振り返ります。",
      en: "Originally developed for Air Force pilots, the MA-1 eventually crossed over into civilian fashion. Here's a short look back at where it came from.",
    },
    contentHtml: {
      ja: `
        <p>MA-1フライトジャケットは、その前身であるB-15シリーズの後継モデルとして、1950年代初頭にアメリカ空軍のパイロット向けに開発されました。<strong>MIL-J-8279</strong>規格のもとで製造が始まり、当初は軍用の防寒着として設計されたものです。</p>
        <h2>セージグリーンという定番色</h2>
        <p>支給品のMA-1は基本的に<strong>セージグリーン</strong>一色で展開されており、他の色（ブラック、ネイビー、レッドなど）を見かけた場合は、そのほとんどが後年の商用モデルだと考えられます。</p>
        <img src="${jacket4.src}" alt="MA-1 flight jacket" />
        <p>1970年代に入るとCWU-45/P（通称MA-2）へと役割を譲り渡しましたが、その頃には<a href="#">Alpha Industries</a>をはじめとするメーカーが民間向けの展開を進め、今日まで続くファッションアイテムとしての地位を確立していきました。</p>
        <h2>選ぶときに見るポイント</h2>
        <ul>
          <li>タグの色と文字（金文字/黒タグなど、年代によって仕様が異なります）</li>
          <li>裏地の色（表地と同色かどうか）</li>
          <li>ジッパーのメーカー刻印</li>
        </ul>
        <p>こうした細部を見比べていくと、同じ「MA-1」でも年代ごとの個性が見えてきて面白いものです。</p>
      `,
      en: `
        <p>The MA-1 flight jacket was developed in the early 1950s for U.S. Air Force pilots as the successor to the earlier B-15 series, produced under the <strong>MIL-J-8279</strong> specification as cold-weather gear for military use.</p>
        <h2>Sage Green as the standard</h2>
        <p>Issue MA-1s were produced almost exclusively in <strong>Sage Green</strong> — if you come across one in another color (black, navy, red, and so on), it's very likely a later commercial version.</p>
        <img src="${jacket4.src}" alt="MA-1 flight jacket" />
        <p>By the 1970s the MA-1 had been succeeded in service by the CWU-45/P (often called the MA-2), but around that same time manufacturers like <a href="#">Alpha Industries</a> began pushing it into civilian fashion, which is how it earned the reputation it still carries today.</p>
        <h2>A few things worth checking</h2>
        <ul>
          <li>Tag color and lettering style (varies by era)</li>
          <li>Whether the lining matches the outer shell color</li>
          <li>Zipper manufacturer stamp</li>
        </ul>
        <p>Comparing these small details is part of the fun — every era of "MA-1" has its own quiet personality.</p>
      `,
    },
  },
  {
    slug: "us-navy-n1-deck-jacket-unlocking-the-details",
    title: "U.S NAVY N-1 Deck Jacket - Unlocking the Details of a Hidden Masterpiece",
    date: "2026年7月2日",
    coverImage: jacket2,
    excerpt: {
      ja: "甲板作業員のために作られたN-1デッキジャケット。無骨なつくりの奥にある、静かな機能美を覗いてみます。",
      en: "Built for deck crews working in rough weather, the N-1 deck jacket hides real function beneath its rugged looks.",
    },
    contentHtml: {
      ja: `
        <p>N-1デッキジャケットは、第二次世界大戦中に米海軍の甲板作業員向けとして採用されたアウターです。風の強い甲板上での作業を想定し、防風性と保温性を重視した作りになっています。</p>
        <h2>ボアカラーとコットンシェル</h2>
        <p>特徴的な<strong>アルパカボアの襟</strong>は、着脱の際にジッパーを引き上げるだけで首元をしっかりガードできるよう設計されています。表地はミリタリー特有のヘビーコットンで、経年による色落ちや擦れが独特の表情を生み出します。</p>
        <img src="${jacket2.src}" alt="N-1 deck jacket detail" />
        <p>当店では、こうした個体差のある一点物を中心にセレクトしています。同じモデルでも、使われ方によって表情がまったく違うのがヴィンテージの面白いところです。</p>
      `,
      en: `
        <p>The N-1 deck jacket was issued to U.S. Navy deck crews during World War II, built to handle the wind and cold of open-deck work at sea.</p>
        <h2>Pile collar meets a cotton shell</h2>
        <p>The signature <strong>alpaca pile collar</strong> zips up to shield the neck in rough weather, while the heavy cotton shell develops its own fade and wear pattern over the years — no two jackets age quite the same way.</p>
        <img src="${jacket2.src}" alt="N-1 deck jacket detail" />
        <p>We tend to gravitate toward pieces like this one — items where the wear tells its own story. Same model, completely different character, depending on how it lived its life before it got to us.</p>
      `,
    },
  },
  {
    slug: "a-short-history-of-the-denim-jacket",
    title: "A Short History of the Denim Jacket",
    date: "2026年5月18日",
    coverImage: jacket6,
    excerpt: {
      ja: "作業着として生まれ、いまや定番アイテムとなったデニムジャケット。その歩みをざっくり振り返ります。",
      en: "From workwear to wardrobe staple — a quick look at how the denim jacket got here.",
    },
    contentHtml: {
      ja: `
        <p>デニムジャケットは、もともと鉱山や鉄道など、過酷な現場で働く労働者のための作業着として生まれました。丈夫なデニム生地は摩耗に強く、実用性を最優先に設計されています。</p>
        <h2>作業着からアイコンへ</h2>
        <p>20世紀半ば以降、デニムジャケットは映画やカルチャーを通じて若者の象徴的なアイテムへと変化していきます。ポケットの形状やステッチの仕様は、ブランドや年代によって細かく異なり、それが今日のコレクターたちの探求心をかき立てています。</p>
        <img src="${jacket6.src}" alt="Denim jacket detail" />
        <p>経年による色落ちの表情は一着ごとに異なり、まさに「育てる」楽しさがあるアイテムだと言えるでしょう。</p>
      `,
      en: `
        <p>The denim jacket started life as plain workwear — something durable enough for miners, railroad workers, and anyone else who needed clothing built to take a beating.</p>
        <h2>From workwear to icon</h2>
        <p>From the mid-20th century onward, film and youth culture turned it into something closer to a symbol. Pocket shapes and stitching details differ across brands and eras, which is exactly what keeps collectors digging.</p>
        <img src="${jacket6.src}" alt="Denim jacket detail" />
        <p>Every jacket fades differently over time — it's less "clothing you buy" and more "clothing you grow into."</p>
      `,
    },
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
