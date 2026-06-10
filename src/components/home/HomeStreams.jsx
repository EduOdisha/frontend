import { Link } from 'react-router-dom';
import { Section, SectionHeader } from './HomeSections';

export default function HomeStreams({ streams, t }) {
  return (
    <Section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container-xl">
        <SectionHeader
          eyebrow={t('home.byStream.eyebrow')}
          title={t('home.byStream.title')}
          subtitle={t('home.byStream.subtitle')}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {streams.map((stream) => (
            <Link
              key={stream.href}
              to={stream.href}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-xl p-5 text-center transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{stream.icon}</div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                {stream.label}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{stream.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
