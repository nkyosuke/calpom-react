import React from "react";

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">利用規約</h1>
      <p className="mb-2">
        本アプリをご利用いただく前に、以下の利用規約をよくお読みください。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. サービス内容</h2>
      <p className="mb-2">
        本アプリは、予定管理やポモドーロタイマーなどの機能を提供します。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. 禁止事項</h2>
      <p className="mb-2">
        法令に違反する行為、他ユーザーへの迷惑行為などは禁止されています。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. 免責事項</h2>
      <p className="mb-2">
        本アプリの利用により発生した損害について、当方は一切責任を負いません。
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. 規約の変更</h2>
      <p className="mb-2">本規約は予告なく変更されることがあります。</p>
    </div>
  );
};

export default Terms;