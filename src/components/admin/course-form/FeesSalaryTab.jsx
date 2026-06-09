import { DollarSign, TrendingUp } from 'lucide-react';
import { Label, Input, SectionCard, SalaryBar } from '../../common/FormControls';

export default function FeesSalaryTab({ formData, handleChange }) {
  const maxSalary = Math.max(
    Number(formData.averageSalary.senior) || 0,
    1
  );

  return (
    <div className="space-y-5">
      {/* Fees */}
      <SectionCard icon={DollarSign} title="Course Fees" subtitle="Annual fee range across institutions" accent="amber">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide mb-2">Minimum Fees</p>
            <Label>Annual Amount (₹)</Label>
            <Input
              type="number" name="fees.min" value={formData.fees.min} onChange={handleChange}
              placeholder="e.g. 50000" className="text-center font-bold text-amber-700 bg-white mt-1 border border-amber-200"
            />
            {Number(formData.fees.min) > 0 && (
              <p className="text-xs font-bold text-amber-600 mt-2">
                ₹{(Number(formData.fees.min) / 1000).toFixed(0)}K / year
              </p>
            )}
          </div>
          <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 text-center">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mb-2">Maximum Fees</p>
            <Label>Annual Amount (₹)</Label>
            <Input
              type="number" name="fees.max" value={formData.fees.max} onChange={handleChange}
              placeholder="e.g. 200000" className="text-center font-bold text-rose-700 bg-white mt-1 border border-rose-200"
            />
            {Number(formData.fees.max) > 0 && (
              <p className="text-xs font-bold text-rose-600 mt-2">
                ₹{(Number(formData.fees.max) / 1000).toFixed(0)}K / year
              </p>
            )}
          </div>
        </div>
        {Number(formData.fees.min) > 0 && Number(formData.fees.max) > 0 && (
          <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-semibold text-center">
              Fee Range: <span className="text-slate-800 font-bold">
                ₹{(Number(formData.fees.min) / 1000).toFixed(0)}K – ₹{(Number(formData.fees.max) / 1000).toFixed(0)}K per year
              </span>
            </p>
          </div>
        )}
      </SectionCard>

      {/* Salary */}
      <SectionCard icon={TrendingUp} title="Average Salary After Course" subtitle="Expected salary by experience level (in LPA)" accent="emerald">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { key: 'entry',  label: 'Entry Level', placeholder: '4', color: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700' },
            { key: 'mid',    label: 'Mid Level',   placeholder: '8', color: 'bg-blue-50 border-blue-100',    textColor: 'text-blue-700' },
            { key: 'senior', label: 'Senior Level', placeholder: '15', color: 'bg-emerald-50 border-emerald-100', textColor: 'text-emerald-700' },
          ].map(({ key, label, placeholder, color, textColor }) => (
            <div key={key} className={`rounded-xl p-4 border text-center ${color}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wide mb-2 ${textColor}`}>{label}</p>
              <Input
                type="number"
                name={`averageSalary.${key}`}
                value={formData.averageSalary[key]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`text-center font-extrabold bg-white border-0 ${textColor}`}
              />
              {Number(formData.averageSalary[key]) > 0 && (
                <p className={`text-xs font-bold mt-2 ${textColor}`}>
                  ₹{formData.averageSalary[key]} LPA
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Visual salary bars */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Salary Progression</p>
          <SalaryBar label="Entry Level"  value={Number(formData.averageSalary.entry)}  max={maxSalary} color="text-emerald-600" />
          <SalaryBar label="Mid Level"    value={Number(formData.averageSalary.mid)}    max={maxSalary} color="text-blue-600" />
          <SalaryBar label="Senior Level" value={Number(formData.averageSalary.senior)} max={maxSalary} color="text-emerald-600" />
        </div>
      </SectionCard>
    </div>
  );
}
