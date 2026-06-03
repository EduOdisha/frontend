import { HelpCircle } from 'lucide-react';
import { Label, Input, Textarea, AddButton, RemoveButton } from '../../common/FormControls';

export default function FaqsTab({ formData, handleArrayChange, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400 mt-0.5">Common questions students ask about this college</p>
        </div>
        <AddButton onClick={() => addArrayItem('faqs', { question: '', answer: '' })} label="Add FAQ" />
      </div>

      {formData.faqs.map((faq, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-amber-50/50 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">Q{i + 1}</span>
              <span className="text-xs font-bold text-amber-700 truncate">{faq.question || 'New Question'}</span>
            </div>
            <RemoveButton onClick={() => removeArrayItem('faqs', i)} />
          </div>
          <div className="p-5 space-y-3">
            <div>
              <Label required>Question</Label>
              <Input
                value={faq.question}
                onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'question')}
                placeholder="e.g. What is the average placement package?"
              />
            </div>
            <div>
              <Label required>Answer</Label>
              <Textarea
                value={faq.answer}
                onChange={(e) => handleArrayChange('faqs', i, e.target.value, 'answer')}
                rows={3}
                placeholder="Provide a detailed and helpful answer..."
              />
            </div>
          </div>
        </div>
      ))}

      {formData.faqs.length === 0 && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
          <HelpCircle size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400 font-semibold">No FAQs added yet</p>
        </div>
      )}
    </div>
  );
}
