import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>
      <p className="mb-2">
        本アプリでは、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いに努めています。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. 取得する情報</h2>
      <p className="mb-2">メールアドレス、使用状況などの情報を取得する場合があります。</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. 利用目的</h2>
      <p className="mb-2">取得した情報は、アプリの改善やユーザーサポートに使用されます。</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. 第三者提供</h2>
      <p className="mb-2">
        法令に基づく場合を除き、ユーザーの同意なしに第三者に提供することはありません。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookie等の使用</h2>
      <p className="mb-2">
        本アプリでは、利便性向上や広告配信のためにCookieを使用しています。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. 改定</h2>
      <p className="mb-2">本ポリシーは予告なく変更される場合があります。</p>
    </div>
  );
};

export default Privacy;