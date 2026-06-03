import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Share2, Globe } from "lucide-react";
import api from '../../utils/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blogs/${slug}`);
      setBlog(data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [fetchBlog]);

  if (loading) {
    return (
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-6" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-12" />
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-3xl mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-32 pb-16 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
        <Link to="/blogs" className="text-primary-600 mt-4 inline-block">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/blogs" className="hover:text-primary-600 transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] md:max-w-md font-medium">
            {blog.title}
          </span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center">
            <div className="mb-4">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {blog.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                  <img 
                    src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.name || 'Author'}&background=random`} 
                    alt={blog.author?.name} 
                  />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-200">{blog.author?.name || 'EduOdisha Team'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
            </div>
          </header>

          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10">
            <img 
              src={blog.image?.url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
              alt={blog.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <article className="prose prose-slate dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </article>

              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-slate-400 mr-2 uppercase tracking-wider">Posted in:</span>
                  <Link 
                    to={`/blogs?category=${blog.category}`}
                    className="bg-slate-100 dark:bg-slate-900 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {blog.category}
                  </Link>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Share this article</span>
                <div className="flex gap-3">
                  <button className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 rounded-full shadow-sm transition-all">
                    <Globe className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 rounded-full shadow-sm transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <aside className="lg:w-1/3">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary-600 rounded-full" />
                    Related Articles
                  </h3>
                  <div className="space-y-6">
                    {blog.relatedBlogs && blog.relatedBlogs.length > 0 ? (
                      blog.relatedBlogs.map(related => (
                        <Link key={related._id} to={`/blogs/${related.slug}`} className="group flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                            <img src={related.image?.url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={related.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-primary-600 mb-1 block">{related.category}</span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">
                              {related.title}
                            </h4>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No related articles found.</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}