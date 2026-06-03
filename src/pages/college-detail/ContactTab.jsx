import { MapPin, Globe, Phone, Mail } from 'lucide-react';
import LeadForm from '../../components/common/LeadForm';

export default function ContactTab({ college }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Quick Inquiry</h2>
        <p className="text-sm text-slate-500 mb-5">Our counselor will call you back within 24 hours.</p>
        <LeadForm source="College Contact Tab" collegeId={college._id} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h2>
        <div className="space-y-5">
          {(college.location?.address || college.location?.city) && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Address</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {[
                    college.location.address,
                    college.location.district,
                    college.location.city,
                    college.location.state,
                    college.location.pincode
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}
          {college.contact?.website && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <Globe size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Website</p>
                <a href={college.contact.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary-600 hover:underline break-all">
                  {college.contact.website}
                </a>
              </div>
            </div>
          )}
          {college.contact?.phone?.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <Phone size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Phone</p>
                {college.contact.phone.map((p, i) => (
                  <a key={i} href={`tel:${p}`} className="block text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors">{p}</a>
                ))}
              </div>
            </div>
          )}
          {college.contact?.email && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <Mail size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">Email</p>
                <a href={`mailto:${college.contact.email}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 transition-colors">
                  {college.contact.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
