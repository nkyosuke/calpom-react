// src/pages/BlogArticle.tsx
import { Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";

export default function BlogArticle1() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      {/* タイトル */}
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        CalPomの効果的な使い方
      </h1>
      <div className="text-sm text-gray-500 mb-8">
        公開日: 2025/07/11 ・ カテゴリ: 活用ガイド
      </div>

      {/* 本文 */}
      <p className="text-lg leading-relaxed mb-6">
        CalPomは、予定管理、ポモドーロタイマー、学習計画の自動生成を統合した革新的な時間管理アプリです。
        日々の学習や仕事に追われがちな方でも、直感的に使えるデザインと機能で、無理なく習慣化できるように設計されています。
        本記事ではCalPomを使いこなすための基本的な活用法を、ステップごとに紹介します。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        1. 予定を登録する
      </h2>
      <p className="mb-6">
        CalPomのカレンダー画面では、予定をマウス操作で簡単に追加・編集・移動できます。
        曜日別にタスクを並べたり、時間帯ごとに色分けして整理することも可能です。
        スマホでもPCでも同じように使えるため、スキマ時間に計画を立て直すのも簡単です。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        2. 集中力を可視化する
      </h2>
      <p className="mb-6">
        CalPomでは、予定に対してポモドーロタイマーを紐づけることができます。
        これにより「ただの予定」ではなく、「どれだけ集中して取り組んだか」が記録として残ります。
        タイマー中は休憩を挟みながら効率よく学習や作業が進められ、終了後には自動的に実績として保存されます。
        この実績は後から統計グラフで確認できるため、自分の成長や改善ポイントが一目でわかります。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        3. 学習計画を自動生成
      </h2>
      <p className="mb-6">
        試験勉強や資格取得を目指している方にとって、「何から始めるか」「いつまでに何をやるか」は最大の悩みです。
        CalPomでは、目標や試験日を入力するだけで、AIがゴールから逆算した学習スケジュールを自動生成してくれます。
        毎日の予定に自然に落とし込まれるため、無理なく継続でき、抜け漏れの心配も減ります。
        まさに“スケジュールのパーソナルトレーナー”といえる存在です。
      </p>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/signin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          CalPomを今すぐ使ってみる
        </Link>
      </div>

      {/* 広告 */}
      <div className="my-10">
        <AdBanner />
      </div>
    </div>
  );
}
