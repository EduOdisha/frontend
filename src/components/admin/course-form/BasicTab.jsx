import { BookOpen, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Label, Input, Select, Switch, SectionCard } from '../../common/FormControls';

export default function BasicTab({ formData, handleChange, setFormData }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={BookOpen} title="Course Identity" subtitle="Basic details for the catalog" accent="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label required>Full Course Name</Label>
            <Input
              name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g. Bachelor of Technology in Computer Science" required
            />
          </div>
          <div>
            <Label>Short Name / Acronym</Label>
            <Input
              name="shortName" value={formData.shortName} onChange={handleChange}
              placeholder="e.g. B.Tech CSE"
            />
          </div>
          <div>
            <Label>Duration</Label>
            <Input
              name="duration" value={formData.duration} onChange={handleChange}
              placeholder="e.g. 4 Years / 2 Years"
            />
          </div>
          <div>
            <Label required>Level</Label>
            <Select name="level" value={formData.level} onChange={handleChange}>
              {['10th', '12th', 'UG', 'PG', 'Diploma', 'Certificate', 'Other'].map(l =>
                <option key={l} value={l}>{l}</option>
              )}
            </Select>
          </div>
          <div>
            <Label required>Stream</Label>
            <Select name="stream" value={formData.stream} onChange={handleChange}>
              {['Engineering', 'Medical', 'Management', 'Nursing', 'Other'].map(s =>
                <option key={s} value={s}>{s}</option>
              )}
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Image */}
      <SectionCard icon={ImageIcon} title="Course Thumbnail" subtitle="Representative image for listings" accent="blue">
        <div className="flex items-start gap-5">
          <div className="flex-1 space-y-3">
            <Label>Image URL</Label>
            <Input
              type="url" name="image.url" value={formData.image?.url || ''} onChange={handleChange}
              placeholder="https://example.com/course-thumbnail.jpg"
            />
            <p className="text-[10px] text-slate-400">Recommended: 16:9 ratio, at least 800×450px</p>
          </div>
          {formData.image?.url ? (
            <div className="w-32 h-20 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
              <img src={formData.image.url} alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
          ) : (
            <div className="w-32 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
              <ImageIcon size={22} />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Status */}
      <SectionCard icon={CheckCircle} title="Visibility Status" subtitle="Control how this course appears on site" accent="emerald">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'isActive',   label: 'Active',   desc: 'Visible on site' },
            { key: 'isFeatured', label: 'Featured', desc: 'Show on homepage' },
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
