import { Info, FileText, GraduationCap, Layers } from 'lucide-react';
import { Label, Textarea, SectionCard, AddButton, Chip } from '../../common/FormControls';

export default function CurriculumTab({ formData, handleChange, arrChange, arrAdd, arrRemove }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={Info} title="Description" subtitle="Brief intro shown in course listing cards" accent="primary">
        <Label>Short Description</Label>
        <Textarea
          name="description" value={formData.description} onChange={handleChange}
          rows={3} placeholder="A concise summary of the course — what it covers and who it's for..."
        />
        <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.description.length}/500 chars</p>
      </SectionCard>

      <SectionCard icon={FileText} title="Detailed Overview" subtitle="Full curriculum/course content shown on detail page" accent="purple">
        <Label>Course Overview</Label>
        <Textarea
          name="overview" value={formData.overview} onChange={handleChange}
          rows={6} placeholder="Cover semester-wise syllabus, subjects, learning outcomes, lab work, projects..."
        />
      </SectionCard>

      <SectionCard icon={GraduationCap} title="Admission Info" subtitle="Who can apply and how" accent="amber">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Eligibility Criteria</Label>
            <Textarea
              name="eligibility" value={formData.eligibility} onChange={handleChange}
              rows={4} placeholder="e.g. 12th with PCM, minimum 60%&#10;JEE Main qualified students&#10;Age: 17–25 years"
            />
          </div>
          <div>
            <Label>Admission Process</Label>
            <Textarea
              name="admissionProcess" value={formData.admissionProcess} onChange={handleChange}
              rows={4} placeholder="e.g. 1. Register on college portal&#10;2. Upload documents&#10;3. Appear for counselling&#10;4. Fee payment"
            />
          </div>
        </div>
      </SectionCard>

      {/* Entrance Exams */}
      <SectionCard icon={Layers} title="Entrance Exams Accepted" subtitle="Exams students need for this course" accent="rose">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.entranceExams.map((exam, i) => (
              <Chip key={i} value={exam}
                onChange={e => arrChange('entranceExams', i, e.target.value)}
                onRemove={() => arrRemove('entranceExams', i)}
                placeholder="e.g. JEE Main"
              />
            ))}
          </div>
          <AddButton onClick={() => arrAdd('entranceExams')} label="Add Exam" />
        </div>
      </SectionCard>
    </div>
  );
}
