// src/pages/BlogArticle3.tsx
import { Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";

export default function BlogArticle3() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        ポモドーロ・テクニックとは？集中力と脳科学の関係
      </h1>
      <div className="text-sm text-gray-500 mb-8">
        公開日: 2025/07/12 ・ カテゴリ: 脳科学 / 生産性
      </div>

      <p className="text-lg leading-relaxed mb-6">
        「集中できない」「やる気が続かない」と感じたことはありませんか？
        現代人の脳は日々多くの情報にさらされ、集中を持続させるのが難しくなっています。
        そんな中で注目されているのが「ポモドーロ・テクニック」です。
        これは25分の作業＋5分の休憩を1セットとし、短い集中と回復を繰り返すことで、生産性を高める時間管理術です。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        なぜ25分が効果的なのか？ 脳科学から見る理由
      </h2>
      <p className="mb-6">
        人間の脳は長時間の集中を苦手とする一方、短時間であれば高い集中力を発揮できます。
        ポモドーロ法は「集中→休憩」のリズムを取り入れることで、脳の前頭前野（集中を司る部位）の疲労を防ぎつつ、効率よくアウトプットできるよう設計されています。
        この25分という時間は、心理学者の研究でも「フロー状態」に入りやすい長さとされており、実際に多くの研究でも効果が示されています。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        ポモドーロの効果を高めるポイント
      </h2>
      <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
        <li>作業前に具体的な目標（例：問題集を2ページ進める）を設定する</li>
        <li>スマホや通知をオフにして「気が散らない環境」を作る</li>
        <li>休憩中も脳を休める（SNSやメール確認を避ける）</li>
      </ul>

      <blockquote className="border-l-4 border-blue-400 pl-4 italic bg-blue-50 p-4 rounded mb-6">
        「ポモドーロは、意志の力ではなく“仕組み”で集中を作り出す方法」
      </blockquote>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        CalPomでポモドーロを実践するには？
      </h2>
      <p className="mb-6">
        CalPomでは、予定に紐づけてポモドーロ記録を行えます。
        1日の集中時間を可視化できるため、学習のリズムが定着しやすくなります。
        統計画面では、実績をカレンダーやグラフで確認できるため、モチベーションの維持にもつながります。
      </p>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/signin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          CalPomで集中力を強化しよう
        </Link>
      </div>
      <AdBanner />
    </div>
  );
}
