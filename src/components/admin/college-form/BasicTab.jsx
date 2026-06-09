import { Building2, Award, Star, CheckCircle } from 'lucide-react';
import { Label, Input, Select, Switch, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function BasicTab({ formData, handleChange, handleArrayChange, addArrayItem, removeArrayItem, setFormData }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={Building2} title="College Identity" subtitle="Core registration details" accent="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label required>College Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. KIIT University" required />
          </div>
          <div>
            <Label>Short Name / Acronym</Label>
            <Input name="shortName" value={formData.shortName} onChange={handleChange} placeholder="e.g. KIIT" />
          </div>
          <div>
            <Label>Established Year</Label>
            <Input type="number" name="established" value={formData.established} onChange={handleChange} placeholder="e.g. 1992" />
          </div>
          <div>
            <Label required>College Type</Label>
            <Select name="type" value={formData.type} onChange={handleChange}>
              {['Government', 'Private', 'Deemed', 'Autonomous', 'Central'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </div>
          <div>
            <Label required>Category / Stream</Label>
            <Select name="category" value={formData.category} onChange={handleChange}>
              {['Engineering', 'Medical', 'Management', 'Nursing', 'Polytechnic', 'Other'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Affiliation</Label>
            <Input name="affiliation" value={formData.affiliation} onChange={handleChange} placeholder="e.g. Deemed to be University / Biju Patnaik University" />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Award} title="Rankings & Accreditation" accent="amber">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>NAAC Grade</Label>
            <Select name="naacGrade" value={formData.naacGrade} onChange={handleChange}>
              <option value="">Not Accredited</option>
              {['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'].map(g => <option key={g}>{g}</option>)}
            </Select>
          </div>
          <div>
            <Label>NIRF Ranking</Label>
            <Input type="number" name="nirfRanking" value={formData.nirfRanking} onChange={handleChange} placeholder="e.g. 47" />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Star} title="Highlights" subtitle="Key selling points (shown as bullet points)" accent="emerald">
        <div className="space-y-3">
          {formData.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
              <Input value={h} onChange={(e) => handleArrayChange('highlights', i, e.target.value)} placeholder="e.g. 95% placement rate" />
              <RemoveButton onClick={() => removeArrayItem('highlights', i)} />
            </div>
          ))}
          <AddButton onClick={() => addArrayItem('highlights', '')} label="Add Highlight" />
        </div>
      </SectionCard>

      <SectionCard icon={CheckCircle} title="Visibility Status" accent="emerald">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'isActive', label: 'Active', desc: 'Visible on site' },
            { key: 'isFeatured', label: 'Featured', desc: 'Show on homepage' },
            { key: 'isVerified', label: 'Verified', desc: 'Verified badge' },
          ].map(({ key, label, desc }) => (
            <div key={key} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all select-none
              ${formData[key] ? 'border-emerald-300 bg-emerald-50/40 text-emerald-800' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500'}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold">{label}</span>
                <span className="text-[10px] text-slate-400">{desc}</span>
              </div>
              <Switch
                checked={formData[key]}
                onChange={() => setFormData(prev => ({ ...prev, [key]: !prev[key] }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
