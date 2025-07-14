// src/pages/BlogArticle2.tsx
import { Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";

export default function BlogArticle2() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        ポモドーロ法 × 学習計画で最大効果を出すコツ
      </h1>
      <div className="text-sm text-gray-500 mb-8">
        公開日: 2025/07/11 ・ カテゴリ: 時間術 / 集中力
      </div>

      <p className="text-lg leading-relaxed mb-8">
        勉強や仕事に取り組んでいて、「集中できない」「何から手をつけたらいいかわからない」と感じたことはありませんか？
        CalPomでは、タスクの自動スケジューリング（学習計画）とポモドーロ・タイマーを組み合わせて、集中力と行動力の両方を引き出します。
        本記事では、その理論と実践方法、さらに継続のコツを紹介します。
      </p>

      {/* カード：メリット */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          なぜこの組み合わせが最強なのか？
        </h2>
        <p className="text-gray-700">
          学習計画によって「何をやるか」「いつやるか」が明確になり、ポモドーロ法によって「どのように集中して取り組むか」が明確になります。
          タスク管理と集中力の強化は、まさに車の両輪。どちらか一方だけでは持続的な成果にはつながりません。
          この2つを連動させることで、無駄を最小限に、達成感を最大化できます。
        </p>
      </div>

      {/* カード：実践方法 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          CalPomでの実践方法
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            最初に「ゴール」と「締切」を設定すると、AIがタスクを日付ごとに自動分割してくれます。
            これにより、「今日は何をすればいいのか」が常に明確になります。
          </li>
          <li>
            カレンダーで1日の予定を確認したら、取りかかる順番を決めましょう。
            小さなタスク単位に分かれていることで、心理的負担も軽減されます。
          </li>
          <li>
            タスクを選んで、ポモドーロ・タイマーを起動。25分集中→5分休憩のサイクルを繰り返します。
            セットごとに実績が自動的に記録され、カレンダーや統計で振り返ることができます。
          </li>
        </ul>
      </div>

      {/* カード：継続のコツ */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          継続のコツは「可視化」と「ご褒美」
        </h2>
        <p className="text-gray-700">
          継続するうえで大切なのは、「見える化」と「小さな達成感」です。
          CalPomでは、ポモドーロ実績をカレンダーやグラフで可視化できます。
          日々の積み上げが視覚的に分かることで、やる気の維持や習慣化に繋がります。
          また、1週間継続できたら「スイーツを食べる」など、自分へのご褒美を設定するのも有効です。
          モチベーションと報酬のサイクルを作ることで、継続がグッと楽になります。
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/signin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          CalPomで実践してみる
        </Link>
      </div>

      {/* 広告 */}
      <div className="my-10">
        <AdBanner />
      </div>
    </div>
  );
}
