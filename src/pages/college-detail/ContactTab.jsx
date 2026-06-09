import { MapPin, Globe, Phone, Mail } from 'lucide-react';
import LeadForm from '../../components/common/LeadForm';

export default function ContactTab({ college }) {
  const mapSearchQuery = encodeURIComponent(`${college.name}, ${college.location?.city || ''}, ${college.location?.state || 'Odisha'}`);
  const mapUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

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

      {/* Google Maps Embed Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:col-span-2">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="text-primary-600" size={18} />
          Campus Location & Directions
        </h3>
        <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-sm h-80 bg-slate-50">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            title={`${college.name} Location`}
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Need turn-by-turn navigation? Click the button to open Google Maps directions.
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${mapSearchQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 px-5 text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-start sm:self-auto"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
