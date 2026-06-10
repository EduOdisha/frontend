import { CheckCircle, Phone, School } from 'lucide-react';
import { Section } from './HomeSections';

export default function HomeWhyUs({ items, t }) {
  const icons = [
    <CheckCircle size={22} className="text-primary-600" />,
    <Phone size={22} className="text-primary-600" />,
    <School size={22} className="text-primary-600" />,
  ];

  return (
    <Section className="page-section bg-white dark:bg-slate-950">
      <div className="container-xl">
        <div className="max-w-xl mb-10">
          <p className="section-eyebrow">{t('home.whyUs.eyebrow')}</p>
          <h2 className="section-title">{t('home.whyUs.title')}</h2>
          <p className="section-subtitle">{t('home.whyUs.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Array.isArray(items) ? items : []).map((item, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl p-6">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/40 rounded-lg flex items-center justify-center mb-4">
                {icons[i]}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
