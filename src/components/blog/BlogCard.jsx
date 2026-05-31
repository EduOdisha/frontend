import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

export default function BlogCard({ blog, loading }) {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="bg-slate-200 dark:bg-slate-800 h-48 rounded-t-2xl" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden h-48 rounded-t-2xl">
        <img 
          src={blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg">
            {blog.category}
          </span>
        </div>
        {blog.isFeatured && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
            Featured
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary-600" />
            <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary-600" />
            <span>5 min read</span>
          </div>
        </div>
        
        <h3 className="font-display font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-lg">
          <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
              <img 
                src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.name || 'Author'}&background=random`} 
                alt={blog.author?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{blog.author?.name || 'EduOdisha Team'}</span>
          </div>
          <Link to={`/blogs/${blog.slug}`} className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">
            Read More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
