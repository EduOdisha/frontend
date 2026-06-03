import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800 pr-4">{faq.question}</span>
        <ChevronRight
          size={16}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqsTab({ college }) {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-2">
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>
      {college.faqs?.length > 0 ? (
        college.faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
          No FAQs available yet.
        </div>
      )}
    </div>
  );
}
