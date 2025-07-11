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
            <h3 className="text-lg font-semibold mb-2">カレンダー管理</h3>
            <p>予定の追加・編集・ドラッグ操作に対応</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">ポモドーロ記録</h3>
            <p>選択した予定に集中記録を紐づけ可能</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">学習計画の自動生成</h3>
            <p>AIが目標から逆算して学習計画を自動作成(開発中)</p>
          </div>
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
