// src/pages/HowToUse.tsx
import { useEffect } from "react";
import { AdBanner } from "../components/AdBanner";

export default function HowToUse() {
  useEffect(() => {
    document.title = "使い方ガイド | CalPom";
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">CalPom の使い方</h1>
      <p className="mb-8">
        CalPom は、カレンダーとポモドーロタイマーを組み合わせた学習・作業管理アプリです。
        以下の手順に従って使い方をマスターしましょう！
      </p>

      {/* 広告ブロック 1 */}
      <div className="my-8 text-center">
        <AdBanner />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">1. ログイン画面</h2>
        <p className="mb-2">
          メールアドレスでログインして、あなた専用のデータを管理できます。
        </p>
        <img
          src="/img/login-screen.png"
          alt="ログイン画面"
          className="rounded shadow w-full mb-6"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">2. カレンダー画面</h2>
        <p className="mb-2">予定を追加・編集・ドラッグで移動できます。</p>
        <img
          src="/img/calendar-screen.png"
          alt="カレンダー画面"
          className="rounded shadow w-full mb-6"
        />
      </section>

      {/* 広告ブロック 2 */}
      <div className="my-8 text-center">
        <AdBanner />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">3. ポモドーロタイマー</h2>
        <p className="mb-2">
          右下のトマトアイコンから起動。集中タイムをスタートして、実績を記録しよう！
        </p>
        <img
          src="/img/pomodoro-screen.png"
          alt="ポモドーロタイマー"
          className="rounded shadow w-full mb-6"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">4. 学習実績の確認</h2>
        <p className="mb-2">
          カレンダーや統計ページから、あなたの集中記録を確認できます。
        </p>
        <img
          src="/img/stats-screen.png"
          alt="統計画面"
          className="rounded shadow w-full mb-6"
        />
      </section>

      {/* 広告ブロック 3 */}
      <div className="my-8 text-center">
        <AdBanner />
      </div>

      <footer className="text-sm text-center text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} CalPom
      </footer>
    </main>
  );
}
