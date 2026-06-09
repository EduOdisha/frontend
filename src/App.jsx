import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './store/slices/authSlice';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareWidget from './components/common/CompareWidget';
import WhatsAppButton from './components/common/WhatsAppButton';

// Lazy Loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CollegesPage = lazy(() => import('./pages/CollegesPage'));
const CollegeDetailPage = lazy(() => import('./pages/CollegeDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const ExamDetailPage = lazy(() => import('./pages/ExamDetailPage'));
const ScholarshipsPage = lazy(() => import('./pages/ScholarshipsPage'));
const ScholarshipDetailPage = lazy(() => import('./pages/ScholarshipDetailPage'));
const BlogsPage = lazy(() => import('./pages/blog/BlogsPage'));
const BlogDetailPage = lazy(() => import('./pages/blog/BlogDetailPage'));
const CareerGuidancePage = lazy(() => import('./pages/CareerGuidancePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Auth & Dashboard
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CollegeManagement = lazy(() => import('./pages/admin/CollegeManagement'));
const CourseManagement = lazy(() => import('./pages/admin/CourseManagement'));
const ExamManagement = lazy(() => import('./pages/admin/ExamManagement'));
const ScholarshipManagement = lazy(() => import('./pages/admin/ScholarshipManagement'));
const LeadManagement = lazy(() => import('./pages/admin/LeadManagement'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ReviewManagement = lazy(() => import('./pages/admin/ReviewManagement'));

// Page loading indicator
function PageLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">Loading Page...</p>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const isAdminPath = pathname.startsWith('/admin');
  const isDashboardOrAdmin = isAdminPath || pathname.startsWith('/dashboard');

  // Check auth on load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="colleges" element={<CollegeManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="exams" element={<ExamManagement />} />
              <Route path="scholarships" element={<ScholarshipManagement />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reviews" element={<ReviewManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Toaster position="top-right" />
      {!isAdminPath && <Navbar />}
      
      <main className={`flex-grow ${!isAdminPath ? 'pt-16' : ''}`}>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/colleges" element={<CollegesPage />} />
            <Route path="/colleges/:slug" element={<CollegeDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/:slug" element={<ExamDetailPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route path="/scholarships/:slug" element={<ScholarshipDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/career-guidance" element={<CareerGuidancePage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Fallback for other routes */}
            <Route path="*" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-display font-bold text-primary-600 mb-4">404</h1>
                <p className="text-xl text-slate-500 mb-8">This page is under construction or doesn't exist.</p>
                <a href="/" className="btn-primary">Go back home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {!isDashboardOrAdmin && (
        <>
          <CompareWidget />
          <Footer />
        </>
      )}
      {!isAdminPath && <WhatsAppButton />}
    </div>
  );
}