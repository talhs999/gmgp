"use client";
import { useEffect, useState } from "react";

function getNextSaturday() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const daysUntil = day === 6 ? 7 : (6 - day);
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntil);
  next.setHours(8, 0, 0, 0); // 8am delivery
  return next;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function update() {
      const diff = getNextSaturday().getTime() - new Date().getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", val: timeLeft.days },
    { label: "Hours", val: timeLeft.hours },
    { label: "Mins", val: timeLeft.minutes },
    { label: "Secs", val: timeLeft.seconds },
  ];

  return (
    <section className="bg-black text-white py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {/* Label */}
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
              Next Delivery
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Every Saturday 🚚
            </h2>
            <p className="text-gray-400 text-xs mt-1">Order before Friday midnight</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-center gap-3">
                <div className="text-center">
                  <div className="bg-accent text-white font-black text-3xl w-16 h-16 flex items-center justify-center rounded-lg tabular-nums">
                    {String(u.val).padStart(2, "0")}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 text-gray-400">
                    {u.label}
                  </p>
                </div>
                {i < units.length - 1 && (
                  <span className="text-accent font-black text-2xl pb-5">:</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href="/shop" className="btn-accent whitespace-nowrap">
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
