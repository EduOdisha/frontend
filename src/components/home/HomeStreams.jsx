import { Link } from 'react-router-dom';
import { Section, SectionHeader } from './HomeSections';

export default function HomeStreams({ streams, t }) {
  return (
    <Section className="py-16 bg-slate-50">
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
              className="bg-white border border-slate-200 hover:border-primary-200 hover:bg-primary-50 rounded-xl p-5 text-center transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{stream.icon}</div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors mb-1">
                {stream.label}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">{stream.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
