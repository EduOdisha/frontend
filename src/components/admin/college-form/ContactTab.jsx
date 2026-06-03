import { Globe, Mail, Phone } from 'lucide-react';
import { Label, Input, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function ContactTab({ formData, handleChange, handleNestedArrayChange, addNestedArrayItem, removeNestedArrayItem }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={Globe} title="Online Presence" subtitle="Website and email contact" accent="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Official Website</Label>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input type="url" name="contact.website" value={formData.contact.website} onChange={handleChange} placeholder="https://college.ac.in" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Email Address</Label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} placeholder="info@college.ac.in" className="pl-9" />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Phone} title="Phone Numbers" subtitle="Add multiple contact numbers" accent="emerald">
        <div className="space-y-3">
          {formData.contact.phone.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 shrink-0 w-5 text-right">{i + 1}.</span>
              <div className="relative flex-1">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input type="tel" value={p} onChange={(e) => handleNestedArrayChange('contact', 'phone', i, e.target.value)} placeholder="+91 XXXXX XXXXX" className="pl-9" />
              </div>
              <RemoveButton onClick={() => removeNestedArrayItem('contact', 'phone', i)} />
            </div>
          ))}
          <AddButton onClick={() => addNestedArrayItem('contact', 'phone', '')} label="Add Phone" />
        </div>
      </SectionCard>
    </div>
  );
}
