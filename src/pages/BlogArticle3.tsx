// src/pages/BlogArticle3.tsx
import { Link } from "react-router-dom";

export default function BlogArticle3() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        ポモドーロ・テクニックとは？集中力と脳科学の関係
      </h1>
      <div className="text-sm text-gray-500 mb-8">
        公開日: 2025/07/11 ・ カテゴリ: 集中力 / 脳科学
      </div>

      {/* カード：基本編 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          ポモドーロとは？
        </h2>
        <p className="text-gray-700">
          25分間の作業 + 5分間の休憩
          を1セットとする集中力維持法。1980年代にフランチェスコ・シリロ氏が考案しました。
          キッチンタイマーの形がトマト（イタリア語で
          pomodoro）だったことが由来です。
        </p>
      </div>

      {/* カード：脳科学編 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          なぜ集中できるの？脳科学の裏付け
        </h2>
        <p className="text-gray-700">
          私たちの脳は長時間の集中を苦手としています。ドーパミンやノルアドレナリンなどの神経伝達物質が、
          集中開始から20〜30分で減少し始めることがわかっています。
          <br />
          ポモドーロ法はその限界を前提に、短い集中と小休憩を繰り返すことでパフォーマンスを最大化する手法です。
        </p>
      </div>

      {/* カード：実践編 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          効果を最大化する実践ポイント
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>1ポモドーロは「単一タスク」に集中する</li>
          <li>中断されない環境を整える（通知OFFなど）</li>
          <li>ポモ終了時に「何ができたか」を振り返る</li>
        </ul>
      </div>

      {/* カード：CalPomでの活用 */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          CalPomでの実践例
        </h2>
        <p className="text-gray-700">
          CalPomでは、予定に対してポモドーロ記録を直接ひもづけることができます。
          <br />
          学習計画 → 実行 → 可視化 の流れをワンストップで行えるのが強みです。
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/signin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          CalPomで体験してみる
        </Link>
      </div>
    </div>
  );
}
