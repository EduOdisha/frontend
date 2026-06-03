import { TrendingUp, Briefcase, Star } from 'lucide-react';
import { Label, Input, Textarea, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function CareerTab({ formData, handleChange, arrChange, arrAdd, arrRemove }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={TrendingUp} title="Career Scope" subtitle="Industries and opportunities after this course" accent="emerald">
        <Label>Career Scope Description</Label>
        <Textarea
          name="careerScope" value={formData.careerScope} onChange={handleChange}
          rows={5} placeholder="Describe career paths, industries hiring, growth potential, and why this course has a bright future..."
        />
      </SectionCard>

      {/* Job Roles */}
      <SectionCard icon={Briefcase} title="Key Job Roles" subtitle="Common positions graduates get hired for" accent="blue">
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {formData.jobRoles.map((role, i) => (
              <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <Briefcase size={11} className="text-blue-400 shrink-0" />
                <Input
                  value={role}
                  onChange={e => arrChange('jobRoles', i, e.target.value)}
                  placeholder="Job title"
                  className="border-0 bg-transparent p-0 text-xs font-semibold text-blue-700 focus:ring-0"
                />
                <RemoveButton onClick={() => arrRemove('jobRoles', i)} />
              </div>
            ))}
          </div>
          <AddButton onClick={() => arrAdd('jobRoles')} label="Add Job Role" />
        </div>
      </SectionCard>

      {/* Skills */}
      <SectionCard icon={Star} title="Skills Learned" subtitle="Key skills students gain from this course" accent="purple">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-full px-3 py-1.5">
                <Input
                  value={skill}
                  onChange={e => arrChange('skills', i, e.target.value)}
                  placeholder="Skill"
                  className="border-0 bg-transparent p-0 text-xs font-bold text-purple-700 focus:ring-0 w-20"
                />
                <RemoveButton onClick={() => arrRemove('skills', i)} />
              </div>
            ))}
          </div>
          <AddButton onClick={() => arrAdd('skills')} label="Add Skill" />
        </div>
      </SectionCard>
    </div>
  );
}
