import { Image as ImageIcon } from 'lucide-react';
import { Input, SectionCard, AddButton, RemoveButton } from '../../common/FormControls';

export default function ImagesTab({ formData, handleChange, handleArrayChange, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard icon={ImageIcon} title="College Logo" subtitle="Square format recommended (PNG/SVG)" accent="primary">
          <div className="space-y-3">
            <div className="relative">
              <Input type="url" name="logo.url" value={formData.logo?.url} onChange={handleChange} placeholder="https://example.com/logo.png" className="pr-10" />
              <ImageIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
            {formData.logo?.url ? (
              <div className="w-full aspect-square max-w-[120px] mx-auto rounded-2xl border-2 border-slate-100 p-3 bg-slate-50">
                <img src={formData.logo.url} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
                <ImageIcon size={28} />
                <span className="text-[10px] font-semibold">Logo preview</span>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard icon={ImageIcon} title="College Banner" subtitle="Landscape 16:9 recommended" accent="blue">
          <div className="space-y-3">
            <div className="relative">
              <Input type="url" name="banner.url" value={formData.banner?.url} onChange={handleChange} placeholder="https://example.com/banner.jpg" className="pr-10" />
              <ImageIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
            {formData.banner?.url ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                <img src={formData.banner.url} alt="Banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 gap-2">
                <ImageIcon size={28} />
                <span className="text-[10px] font-semibold">Banner preview</span>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard icon={ImageIcon} title="Campus Gallery" subtitle="Add multiple campus images" accent="emerald">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.gallery?.map((img, i) => (
              <div key={i} className="bg-slate-50/40 rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image {i + 1}</span>
                  <RemoveButton onClick={() => removeArrayItem('gallery', i)} />
                </div>
                <Input type="url" value={img.url} onChange={(e) => handleArrayChange('gallery', i, e.target.value, 'url')} placeholder="https://..." />
                {img.url ? (
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-200">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <AddButton onClick={() => addArrayItem('gallery', { url: '' })} label="Add Gallery Image" />
        </div>
      </SectionCard>
    </div>
  );
}
