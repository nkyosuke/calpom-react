import React, { useState } from "react";
import { AdBanner } from "./AdBanner";

type AdRewardPanelProps = {
  onRewardConfirmed: () => void;
  loading: boolean;
};

export const AdRewardPanel = ({
  onRewardConfirmed,
  loading,
}: AdRewardPanelProps) => {
  const [adWatched, setAdWatched] = useState(false);

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">広告を見て学習計画を作成</h2>
      {/* AdSense広告エリア */}
      <div className="mb-4">
        <AdBanner />
      </div>

      {/* 擬似広告とボタン */}
      <button
        onClick={() => setAdWatched(true)}
        className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded"
      >
        広告を見終わったらクリック
      </button>

      <button
        onClick={onRewardConfirmed}
        disabled={!adWatched || loading}
        className={`mt-4 px-4 py-2 rounded ${
          adWatched
            ? "bg-blue-600 text-white"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        {loading ? "生成中..." : "学習計画を作成する"}
      </button>
    </div>
  );
};
