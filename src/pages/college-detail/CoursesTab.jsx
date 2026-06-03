export default function CoursesTab({ college }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Courses, Fees & Eligibility</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Course</th>
              <th>Duration</th>
              <th>1st Year Fees</th>
              <th>Seats</th>
              <th>Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {college.courses?.length > 0 ? college.courses.map((course, i) => (
              <tr key={i}>
                <td className="font-semibold text-slate-900">{course.name}</td>
                <td className="text-slate-500">{course.duration}</td>
                <td className="font-semibold text-primary-600">
                  {course.fees?.min ? `₹${course.fees.min.toLocaleString()}` : '—'}
                </td>
                <td className="text-slate-600">{course.seats || '—'}</td>
                <td className="text-slate-500 text-xs">{course.eligibility || '—'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-8 text-sm">Course details not available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
