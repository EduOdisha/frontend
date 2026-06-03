import { BookOpen } from 'lucide-react';
import { Label, Input, AddButton, RemoveButton } from '../../common/FormControls';

export default function CoursesTab({ formData, handleArrayChange, addArrayItem, removeArrayItem, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Courses Offered</h3>
          <p className="text-xs text-slate-400 mt-0.5">Programs available at this college</p>
        </div>
        <AddButton
          onClick={() => addArrayItem('courses', { name: '', duration: '', fees: { min: 0, max: 0 }, seats: 0, eligibility: '' })}
          label="Add Course"
        />
      </div>

      {formData.courses.map((course, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-sm font-bold text-slate-700">{course.name || 'New Course'}</span>
            </div>
            <RemoveButton onClick={() => removeArrayItem('courses', i)} />
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label required>Course Name</Label>
              <Input value={course.name} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'name')} placeholder="e.g. B.Tech Computer Science" />
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={course.duration} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'duration')} placeholder="e.g. 4 Years" />
            </div>
            <div>
              <Label>Total Seats</Label>
              <Input type="number" value={course.seats}
                onChange={(e) => { const n = [...formData.courses]; n[i].seats = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                placeholder="e.g. 120" />
            </div>
            <div>
              <Label>Min Fees (₹/year)</Label>
              <Input type="number" value={course.fees.min}
                onChange={(e) => { const n = [...formData.courses]; n[i].fees.min = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                placeholder="e.g. 80000" />
            </div>
            <div>
              <Label>Max Fees (₹/year)</Label>
              <Input type="number" value={course.fees.max}
                onChange={(e) => { const n = [...formData.courses]; n[i].fees.max = parseInt(e.target.value) || 0; setFormData({ ...formData, courses: n }); }}
                placeholder="e.g. 150000" />
            </div>
            <div className="md:col-span-2">
              <Label>Eligibility Criteria</Label>
              <Input value={course.eligibility} onChange={(e) => handleArrayChange('courses', i, e.target.value, 'eligibility')} placeholder="e.g. 12th with PCM, JEE Main qualified" />
            </div>
          </div>
        </div>
      ))}

      {formData.courses.length === 0 && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
          <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400 font-semibold">No courses added yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Course" to get started</p>
        </div>
      )}
    </div>
  );
}
