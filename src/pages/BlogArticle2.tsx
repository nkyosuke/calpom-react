// src/pages/BlogArticle2.tsx
import { Link } from "react-router-dom";

export default function BlogArticle2() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        ポモドーロ法 × 学習計画で最大効果を出すコツ
      </h1>
      <div className="text-sm text-gray-500 mb-8">
        公開日: 2025/07/11 ・ カテゴリ: 時間術 / 集中力
      </div>

      {/* カード：メリット */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          なぜこの組み合わせが最強なのか？
        </h2>
        <p className="text-gray-700">
          学習計画で「何をやるか」が明確になり、ポモドーロ法で「どう集中するか」が決まります。
          <br />
          計画と集中が両輪となり、効率よく目標達成が可能になります。
        </p>
      </div>

      {/* カード：実践方法 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          CalPomでの実践方法
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>学習ゴールと締切を入力してAIに分割してもらう</li>
          <li>1日の計画タスクを確認する</li>
          <li>ポモドーロタイマーでタスク実行＆実績を記録</li>
        </ul>
      </div>

      {/* カード：継続のコツ */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-2  text-blue-700">
          継続のコツは「可視化」と「ご褒美」
        </h2>
        <p className="text-gray-700">
          実績がグラフやカレンダーに可視化されると、やる気が維持しやすくなります。
          <br />
          週の目標を達成したら、自分にちょっとしたご褒美をあげましょう！
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
    </div>
  );
}
