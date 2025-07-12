// src/pages/TopPage.tsx
import { Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";

export default function TopPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 bg-gradient-to-b from-blue-100 to-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          CalPom - カレンダー × ポモドーロ
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-xl">
          予定管理 × 集中力管理。
          <br />
          ポモドーロタイマーと学習計画を組み合わせた最強の時間管理アプリ。
        </p>
        <Link to="/signin">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition">
            今すぐ使ってみる
          </button>
        </Link>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-10">主な機能</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto text-center">
          <div>
            <div className="w-full aspect-[4/3] overflow-hidden rounded shadow mb-4">
              <img
                src="./feature-calendar.jpg"
                alt="カレンダーで予定をドラッグする様子"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">カレンダー管理</h3>
            <p>予定の追加・編集・ドラッグ操作に対応</p>
          </div>
          <div>
            <div className="w-full aspect-[4/3] overflow-hidden rounded mb-4">
              <img
                src="./feature-pomodoro.jpg"
                alt="ポモドーロの実績登録パネル"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">ポモドーロ記録</h3>
            <p>選択した予定に集中記録を紐づけ可能</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">学習計画の自動生成</h3>
            <p>AIが目標から逆算して学習計画を自動作成(開発中)</p>
          </div>
        </div>
      </section>
      {/* ブログ記事カードセクション */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-10">活用ガイド</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          <Link
            to="/blog/1"
            className="block bg-blue-50 hover:bg-blue-100 transition rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-2">
              📘 CalPomの効果的な使い方
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              予定管理 × 集中記録 × 学習計画を連動させて最大活用しよう！
            </p>
            <span className="inline-block text-blue-600 hover:underline text-sm font-medium">
              ▶ 記事を読む
            </span>
          </Link>
          <Link
            to="/blog/2"
            className="block bg-blue-50 hover:bg-blue-100 transition rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-2">
              📘 ポモドーロ法 × 学習計画で最大効果を出すコツ
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              なぜこの組み合わせが最強なのか？
            </p>
            <span className="inline-block text-blue-600 hover:underline text-sm font-medium">
              ▶ 記事を読む
            </span>
          </Link>
          <Link
            to="/blog/3"
            className="block bg-blue-50 hover:bg-blue-100 transition rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-2">
              📘 ポモドーロ・テクニックとは？集中力と脳科学の関係
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              ポモドーロとは？
              <br />
              なぜ集中できるの？脳科学の裏付けと実践方法を解説します。
            </p>
            <span className="inline-block text-blue-600 hover:underline text-sm font-medium">
              ▶ 記事を読む
            </span>
          </Link>
        </div>
      </section>
      <AdBanner />

      {/* フッター */}
      <footer className="text-sm text-center py-6 bg-white border-t">
        <Link to="/privacy" className="mx-2 text-blue-600 hover:underline">
          プライバシーポリシー
        </Link>
        <Link to="/terms" className="mx-2 text-blue-600 hover:underline">
          利用規約
        </Link>
        <p className="text-gray-500 mt-2">
          &copy; {new Date().getFullYear()} CalPom
        </p>
      </footer>
    </div>
  );
}
