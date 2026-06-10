import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const suffix = value.replace(/[0-9]/g, '');
          const num = parseInt(value);
          let n = 0;
          const step = Math.max(1, Math.ceil(num / 50));
          const t = setInterval(() => {
            n = Math.min(n + step, num);
            setDisplay(n + suffix);
            if (n >= num) clearInterval(t);
          }, 20);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export default function HomeStats({ stats }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="container-xl py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-slate-100 dark:divide-slate-800">
          {stats.map((s, i) => (
            <div key={i} className="px-8 first:pl-0 last:pr-0 text-center py-2">
              <div className="stat-value">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
