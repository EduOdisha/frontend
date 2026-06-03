import { Wrench } from 'lucide-react';
import { SectionCard, FacilityToggle } from '../../common/FormControls';

const FACILITY_LABELS = {
  hostel: 'Hostel', library: 'Library', sports: 'Sports', canteen: 'Canteen',
  wifi: 'Wi-Fi', lab: 'Labs', transport: 'Transport', medicalFacility: 'Medical', gym: 'Gym',
};

export default function FacilitiesTab({ formData, setFormData }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={Wrench} title="Campus Facilities" subtitle="Toggle available facilities" accent="purple">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.keys(formData.facilities).map(f => (
            <FacilityToggle
              key={f}
              label={FACILITY_LABELS[f] || f}
              checked={formData.facilities[f]}
              onChange={() => setFormData(prev => ({
                ...prev,
                facilities: { ...prev.facilities, [f]: !prev.facilities[f] }
              }))}
            />
          ))}
        </div>

        {/* Visual Summary */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">
            {Object.values(formData.facilities).filter(Boolean).length} of {Object.keys(formData.facilities).length} facilities enabled
          </p>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(Object.values(formData.facilities).filter(Boolean).length / Object.keys(formData.facilities).length) * 100}%` }}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
