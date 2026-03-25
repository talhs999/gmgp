export default function Marquee() {
  const line1 = "🔥 Loved by Meat Lovers  ·  🥩 Premium Cuts  ·  ⭐ 4.9/5 Rating  ·  🚚 Saturday Delivery  ·  🇦🇺 100% Australian  ·  🔥 Loved by Meat Lovers  ·  🥩 Premium Cuts  ·  ⭐ 4.9/5 Rating  ·  🚚 Saturday Delivery  ·  🇦🇺 100% Australian  · ";
  const line2 = "✅ Halal Certified  ·  🌟 Wagyu Available  ·  📦 Vacuum Sealed Fresh  ·  🎁 Gift Packs  ·  🏆 Award Winning Quality  ·  ✅ Halal Certified  ·  🌟 Wagyu Available  ·  📦 Vacuum Sealed Fresh  ·  🎁 Gift Packs  ·  🏆 Award Winning Quality  · ";

  return (
    <div className="overflow-hidden bg-accent py-3">
      {/* Line 1 — Left to Right */}
      <div className="marquee-wrap mb-2">
        <div className="marquee-track text-white text-xs font-bold uppercase tracking-widest">
          <span>{line1}</span>
          <span aria-hidden>{line1}</span>
        </div>
      </div>

      {/* Line 2 — Right to Left */}
      <div className="marquee-wrap">
        <div className="marquee-track-reverse text-white text-xs font-bold uppercase tracking-widest">
          <span>{line2}</span>
          <span aria-hidden>{line2}</span>
        </div>
      </div>
    </div>
  );
}
