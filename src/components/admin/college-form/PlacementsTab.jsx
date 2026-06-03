import { TrendingUp, Users } from 'lucide-react';
import { Label, Input, Textarea, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function PlacementsTab({ formData, handleChange, handleNestedArrayChange, addNestedArrayItem, removeNestedArrayItem }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={TrendingUp} title="Placement Statistics" subtitle="Annual placement data" accent="emerald">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50/50 rounded-xl p-4 text-center border border-emerald-100">
            <Label>Average Package (₹)</Label>
            <Input type="number" name="placements.averagePackage" value={formData.placements.averagePackage} onChange={handleChange} placeholder="850000" className="text-center font-bold text-emerald-700 bg-white mt-2 border border-emerald-200" />
            <p className="text-[10px] text-emerald-500 mt-1 font-semibold">Annual CTC</p>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4 text-center border border-blue-100">
            <Label>Highest Package (₹)</Label>
            <Input type="number" name="placements.highestPackage" value={formData.placements.highestPackage} onChange={handleChange} placeholder="4500000" className="text-center font-bold text-blue-700 bg-white mt-2 border border-blue-200" />
            <p className="text-[10px] text-blue-500 mt-1 font-semibold">Annual CTC</p>
          </div>
          <div className="bg-amber-50/50 rounded-xl p-4 text-center border border-amber-100">
            <Label>Placement %</Label>
            <Input type="number" name="placements.placementPercentage" value={formData.placements.placementPercentage} onChange={handleChange} placeholder="95" className="text-center font-bold text-amber-700 bg-white mt-2 border border-amber-200" max={100} min={0} />
            <p className="text-[10px] text-amber-500 mt-1 font-semibold">of eligible students</p>
          </div>
        </div>

        <div className="mt-4">
          <Label>Placement Description</Label>
          <Textarea name="placements.description" value={formData.placements.description} onChange={handleChange} rows={3} placeholder="Describe placement highlights, industry connections, companies visiting campus..." />
        </div>
      </SectionCard>

      <SectionCard icon={Users} title="Top Recruiters" subtitle="Companies that hire from this college" accent="blue">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.placements.topRecruiters.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <Input
                  value={r}
                  onChange={(e) => handleNestedArrayChange('placements', 'topRecruiters', i, e.target.value)}
                  placeholder="Company name"
                  className="border-0 bg-transparent p-0 text-xs font-bold text-slate-700 focus:ring-0 w-24"
                />
                <RemoveButton onClick={() => removeNestedArrayItem('placements', 'topRecruiters', i)} />
              </div>
            ))}
          </div>
          <AddButton onClick={() => addNestedArrayItem('placements', 'topRecruiters', '')} label="Add Recruiter" />
        </div>
      </SectionCard>
    </div>
  );
}
