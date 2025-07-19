import React, { useState } from "react";
import { AdBanner } from "./AdBanner";

interface AdRewardPanelProps {
  onRewardConfirmed: () => void;
}

export const AdRewardPanel: React.FC<AdRewardPanelProps> = ({
  onRewardConfirmed,
}) => {
  const [adWatched, setAdWatched] = useState(false);
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4">広告を見て学習計画を作成</h2>

      {/* AdSense広告エリア */}
      <div className="mb-4">
        <AdBanner />
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
