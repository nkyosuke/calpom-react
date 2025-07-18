import React, { useEffect, useState } from "react";

interface AdRewardPanelProps {
  onRewardConfirmed: () => void;
}

export const AdRewardPanel: React.FC<AdRewardPanelProps> = ({
  onRewardConfirmed,
}) => {
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    // Google AdSense script の読み込み（初回のみ）
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.setAttribute("data-ad-client", "ca-pub-6649229111325272"); // あなたのIDに変更
    document.body.appendChild(script);
  }, []);

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">広告を見て学習計画を作成</h2>

      {/* AdSense広告エリア */}
      <div className="mb-4">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6649229111325272" // 自分のIDに
          data-ad-slot="2545599027" // 広告スロットID
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      <button
        onClick={() => {
          setAdWatched(true);
        }}
        className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded"
      >
        広告を見終わったらここをクリック
      </button>

      <button
        onClick={onRewardConfirmed}
        disabled={!adWatched}
        className={`mt-4 px-4 py-2 rounded ${
          adWatched
            ? "bg-blue-600 text-white"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        学習計画を作成する
      </button>
    </div>
  );
};
