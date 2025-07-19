import React, { useEffect, useRef } from "react";

export const AdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initialized.current = true;
      } catch (e) {
        console.error("Adsense error", e);
      }
    }
  }, []);

  return (
    <div ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6649229111325272"
        data-ad-slot="2545599027"
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
};
