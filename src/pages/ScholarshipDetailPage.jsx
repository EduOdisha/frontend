import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, Award, CheckCircle2, 
  ChevronRight, FileText, IndianRupee,
  Briefcase, GraduationCap, Clock, 
  ExternalLink, Info, AlertCircle,
  MapPin, TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import LeadForm from '../components/common/LeadForm';

export default function ScholarshipDetailPage() {
  const { slug } = useParams();

  const { data: scholarship, isLoading, error } = useQuery({
    queryKey: ['scholarship', slug],
    queryFn: async () => {
      const { data } = await api.get(`/scholarships/${slug}`);
      return data.data;
    },
  });

  if (isLoading) return <div className="min-h-screen pt-24 bg-slate-50 dark:bg-slate-950"></div>;
  if (error) return <div className="min-h-screen pt-24 flex items-center justify-center">Scholarship not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="container-xl">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/scholarships" className="hover:text-primary-600 transition-colors">Scholarships</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-300 font-medium">{scholarship.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary-50 dark:bg-primary-900/20 shadow-sm border border-primary-100 dark:border-primary-800 p-4 shrink-0 flex items-center justify-center text-primary-600">
              <Award className="w-full h-full" />
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="badge badge-blue">{scholarship.type}</span>
                <span className="badge badge-purple">{scholarship.category}</span>
                {scholarship.isFeatured && <span className="badge badge-orange">Popular</span>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {scholarship.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Provider: <span className="text-slate-900 dark:text-slate-200">{scholarship.provider}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {scholarship.applicationLink && (
                <a href={scholarship.applicationLink} target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-center gap-2">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 border-l-4 border-l-emerald-500">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Scholarship Amount</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {scholarship.amount?.type === 'Full' ? 'Full Fees' : `₹${scholarship.amount?.value?.toLocaleString()}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">{scholarship.amount?.type} support</p>
              </div>
              <div className="card p-6 border-l-4 border-l-primary-500">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Applicable For</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {scholarship.level?.join(', ')}
                </p>
              </div>
              <div className="card p-6 border-l-4 border-l-amber-500">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Deadline</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {scholarship.lastDate ? new Date(scholarship.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Ongoing'}
                </p>
              </div>
            </div>

            {/* Description */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-primary-500" />
                About Scholarship
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {scholarship.description}
                </p>
              </div>
            </section>

            {/* Eligibility Section */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Eligibility Criteria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" /> Family Income
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{scholarship.eligibility?.income || 'No limit specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Academic Performance
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">Minimum {scholarship.eligibility?.percentage || 'Not specified'}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.eligibility?.category?.map(cat => (
                        <span key={cat} className="badge badge-blue">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> State
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{scholarship.eligibility?.state}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Documents Required */}
            {scholarship.documents?.length > 0 && (
              <section className="card p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-500" />
                  Documents Required
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarship.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Application Process */}
            <section className="card p-8">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-500" />
                How to Apply?
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {scholarship.applicationProcess}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-500" />
                Important Note
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ensure all documents are ready before starting the application. Keep a digital copy of your Aadhaar card and bank passbook.
              </p>
            </div>

            {scholarship.faqs?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">FAQs</h3>
                <div className="space-y-4">
                  {scholarship.faqs.slice(0, 3).map((faq, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{faq.question}</h4>
                      <p className="text-xs text-slate-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Scholarship Support</h3>
              <p className="text-sm text-slate-500 mb-6">Need help with the application? Our counselors can guide you.</p>
              <LeadForm source="Scholarship Page" compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
