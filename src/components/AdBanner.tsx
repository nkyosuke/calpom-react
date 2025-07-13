// src/components/AdBanner.tsx
import { useEffect } from "react";

export const AdBanner = () => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6649229111325272"
      data-ad-slot="2545599027"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};
