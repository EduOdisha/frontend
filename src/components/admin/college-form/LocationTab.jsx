import { MapPin } from 'lucide-react';
import { Label, Input, Select, SectionCard } from '../../common/FormControls';

export default function LocationTab({ formData, handleChange }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={MapPin} title="Campus Address" subtitle="Where is the college located?" accent="rose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Full Address</Label>
            <Input name="location.address" value={formData.location.address} onChange={handleChange} placeholder="e.g. KIIT Road, Patia, Bhubaneswar" />
          </div>
          <div>
            <Label required>City</Label>
            <Select name="location.city" value={formData.location.city} onChange={handleChange}>
              {['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore', 'Koraput', 'Jharsuguda', 'Baripada', 'Other'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>District</Label>
            <Input name="location.district" value={formData.location.district} onChange={handleChange} placeholder="e.g. Khordha" />
          </div>
          <div>
            <Label>State</Label>
            <Input name="location.state" value={formData.location.state} onChange={handleChange} placeholder="Odisha" />
          </div>
          <div>
            <Label>PIN Code</Label>
            <Input name="location.pincode" value={formData.location.pincode} onChange={handleChange} placeholder="e.g. 751024" maxLength={6} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
