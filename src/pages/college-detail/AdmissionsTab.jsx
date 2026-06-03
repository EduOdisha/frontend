import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function AdmissionsTab({ college }) {
  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Admission Process</h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">
          {college.admissions?.process || 'Admission details will be updated soon.'}
        </p>

        {college.admissions?.entranceExams?.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Required Entrance Exams</h3>
            <div className="flex flex-wrap gap-2">
              {college.admissions.entranceExams.map(e => (
                <Link
                  key={e}
                  to={`/exams?search=${encodeURIComponent(e)}`}
                  className="badge badge-blue hover:bg-primary-100 transition-colors text-sm py-1.5 px-3"
                >
                  {e}
                </Link>
              ))}
            </div>
          </div>
        )}

        {college.admissions?.applicationLink && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <a
              href={college.admissions.applicationLink}
              target="_blank"
              rel="noreferrer"
              className="btn-cta py-2.5 inline-flex"
            >
              Apply on Official Website <ArrowRight size={15} />
            </a>
            {college.admissions.lastDate && (
              <p className="mt-2 text-xs text-slate-500">
                Last date: {new Date(college.admissions.lastDate).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
