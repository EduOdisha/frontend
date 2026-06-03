import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';
import api from '../../utils/api.js';

export default function LeadForm({ source = 'General', collegeId = null, compact = false }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interestedCourse: '',
    preferredCity: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post('/leads', { ...data, source, college: collegeId }),
    onSuccess: (response, variables) => {
      toast.success('Thank you! Our counselor will contact you shortly.');
      
      const whatsappNumber = "917205402554";
      const message = `Hi, I just submitted an inquiry on EduOdisha.\n\n*Name:* ${variables.name}\n*Phone:* ${variables.phone}\n*Email:* ${variables.email || 'N/A'}\n*Course:* ${variables.interestedCourse || 'N/A'}\n*Source:* ${source || 'General'}\n*Message:* ${variables.message || 'N/A'}`;
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      window.open(url, '_blank');

      setFormData({ name: '', phone: '', email: '', interestedCourse: '', preferredCity: '', message: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return toast.error('Please provide name and phone number');
    }
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (mutation.isSuccess) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Request Received!</h3>
        <p className="text-slate-500 dark:text-slate-400">Our expert counselors will call you within 24 hours.</p>
        <button 
          onClick={() => mutation.reset()}
          className="mt-8 text-primary-600 font-bold hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="input-field"
            required
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Course Interested</label>
          <select 
            name="interestedCourse" 
            value={formData.interestedCourse}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Course</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MBA">MBA</option>
            <option value="MBBS">MBBS</option>
            <option value="BCA/MCA">BCA/MCA</option>
            <option value="Diploma">Diploma</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Your Message (Optional)</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          placeholder="I want to know about admission process..."
          className="input-field resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={mutation.isPending}
        className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary-200"
      >
        {mutation.isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Get Free Guidance
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
      
      <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed px-4">
        By submitting, you agree to our Terms and Privacy Policy. Our experts will reach out to you shortly.
      </p>
    </form>
  );
}