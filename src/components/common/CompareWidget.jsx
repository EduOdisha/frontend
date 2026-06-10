import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, ArrowRight, GitCompare } from 'lucide-react';
import { removeFromCompare, clearCompare } from '../../store/slices/compareSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompareWidget() {
  const { colleges } = useSelector((state) => state.compare);
  const dispatch = useDispatch();

  if (colleges.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Compare Colleges</h4>
              <p className="text-xs text-slate-500">{colleges.length} of 4 selected</p>
            </div>
          </div>

          <div className="w-full flex-grow flex items-center justify-center md:justify-start gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {colleges.map((college) => (
              <div 
                key={college._id} 
                className="relative group shrink-0"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center">
                  <img 
                    src={college.logo?.url || '/placeholder-logo.png'} 
                    alt={college.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <button 
                  onClick={() => dispatch(removeFromCompare(college._id))}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {Array.from({ length: 4 - colleges.length }).map((_, i) => (
              <div 
                key={`empty-${i}`}
                className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700"
              >
                <span className="text-xl">+</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => dispatch(clearCompare())}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Clear All
            </button>
            <Link 
              to="/compare" 
              className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm"
            >
              Compare Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
