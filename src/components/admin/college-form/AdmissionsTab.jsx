import { Building2, GraduationCap } from 'lucide-react';
import { Label, Input, Textarea, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function AdmissionsTab({ formData, handleChange, handleNestedArrayChange, addNestedArrayItem, removeNestedArrayItem }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={Building2} title="About the College" subtitle="Shown on the college detail page" accent="primary">
        <div>
          <Label>About / Overview</Label>
          <Textarea name="about" value={formData.about} onChange={handleChange} rows={5} placeholder="Describe the college, its history, achievements, and USPs..." />
          <p className="text-[10px] text-slate-400 mt-1 text-right">{(formData.about || '').length}/5000</p>
        </div>
      </SectionCard>

      <SectionCard icon={GraduationCap} title="Admission Details" subtitle="Fees, process, and exam requirements" accent="amber">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Annual Fees (₹)</Label>
              <Input type="number" name="fees.min" value={formData.fees.min} onChange={handleChange} placeholder="e.g. 50000" />
            </div>
            <div>
              <Label>Max Annual Fees (₹)</Label>
              <Input type="number" name="fees.max" value={formData.fees.max} onChange={handleChange} placeholder="e.g. 200000" />
            </div>
          </div>

          <div>
            <Label>Admission Process</Label>
            <Textarea name="admissions.process" value={formData.admissions.process} onChange={handleChange} rows={3} placeholder="Describe the admission process step by step..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Application Link</Label>
              <Input type="url" name="admissions.applicationLink" value={formData.admissions.applicationLink} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <Label>Last Date to Apply</Label>
              <Input type="date" name="admissions.lastDate" value={formData.admissions.lastDate} onChange={handleChange} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Entrance Exams Accepted</Label>
              <AddButton onClick={() => addNestedArrayItem('admissions', 'entranceExams', '')} label="Add Exam" />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.admissions.entranceExams.map((exam, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 rounded-lg px-2 py-1">
                  <Input
                    value={exam}
                    onChange={(e) => handleNestedArrayChange('admissions', 'entranceExams', i, e.target.value)}
                    placeholder="e.g. JEE Main"
                    className="border-0 bg-transparent p-0 text-xs font-bold text-primary-700 focus:ring-0 w-24"
                  />
                  <RemoveButton onClick={() => removeNestedArrayItem('admissions', 'entranceExams', i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
