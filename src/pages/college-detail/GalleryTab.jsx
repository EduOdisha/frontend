import { Image as ImageIcon } from 'lucide-react';

export default function GalleryTab({ college }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-5">Campus Gallery</h2>
      {college.gallery?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {college.gallery.map((img, i) => (
            <div key={i} className="aspect-video rounded-xl overflow-hidden group cursor-pointer">
              <img
                src={img.url}
                alt={`Campus ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <ImageIcon size={40} className="mx-auto mb-3 text-slate-200" />
          <p className="text-sm">Gallery photos will be added soon.</p>
        </div>
      )}
    </div>
  );
}
