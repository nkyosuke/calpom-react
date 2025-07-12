// src/pages/BlogArticle.tsx
import { Link } from "react-router-dom";

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
        CalPomは、予定管理、ポモドーロタイマー、学習計画の自動生成を統合した画期的な時間管理ツールです。
        本記事ではその活用方法を紹介します。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        1. 予定を効率よく登録する
      </h2>
      <p className="mb-6">
        カレンダー上で予定を直接追加・編集・ドラッグできます。
        まずは1週間分の予定をまとめて入力しましょう。
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        2. 集中力を可視化する
      </h2>
      <p className="mb-6">
        各予定にポモドーロタイマーを紐づけることで、
        実際にどれだけ集中して取り組めたかを記録できます。
      </p>

      <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 bg-gray-50 p-4 mb-6 rounded">
        「可視化すると、やる気も出るし振り返りもできる」
      </blockquote>

      <h2 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-blue-400 pl-3">
        3. 学習計画を自動生成
      </h2>
      <p className="mb-6">
        AIがゴールと締切から逆算し、毎日の学習タスクを提案してくれます。
        「今週は何をやるべきか」が一目瞭然になります。
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
    </div>
  );
}
