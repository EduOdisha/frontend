export default function ProfileSettingsTab({ user }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-3.5 rounded-full bg-primary-500" />
        <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
      </div>
      
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 max-w-2xl shadow-xs">
        <div className="space-y-6">
          {/* Avatar section */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-display font-extrabold text-2xl border-4 border-primary-50/50 shadow-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.name || 'Student'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage your student account settings and target stream.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Full Name</label>
              <input type="text" defaultValue={user?.name} className="input-base focus:border-primary-500 focus:ring-primary-500/10" />
            </div>
            <div>
              <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Email Address</label>
              <input type="email" defaultValue={user?.email} disabled className="input-base bg-slate-50 cursor-not-allowed text-slate-400 border-slate-200" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Phone Number</label>
              <input type="tel" defaultValue={user?.phone} placeholder="+91 XXXXX XXXXX" className="input-base focus:border-primary-500 focus:ring-primary-500/10" />
            </div>
            <div>
              <label className="label-base text-xs uppercase tracking-wider font-bold text-slate-400">Target Stream</label>
              <select className="input-base focus:border-primary-500 focus:ring-primary-500/10 bg-white">
                <option value="">Select your stream</option>
                {['Engineering', 'Medical', 'Management', 'Nursing', 'Other'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-2">
            <button className="btn-primary py-2.5 px-6 rounded-xl font-bold shadow-md shadow-primary-600/10">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
