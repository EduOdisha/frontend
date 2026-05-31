import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './store/slices/authSlice';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareWidget from './components/common/CompareWidget';

// Pages
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import ComparePage from './pages/ComparePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import CoachingPage from './pages/CoachingPage';
import BlogsPage from './pages/blog/BlogsPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import CareerGuidancePage from './pages/CareerGuidancePage';

// Auth & Dashboard
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CollegeManagement from './pages/admin/CollegeManagement';
import CourseManagement from './pages/admin/CourseManagement';
import ExamManagement from './pages/admin/ExamManagement';
import ScholarshipManagement from './pages/admin/ScholarshipManagement';
import LeadManagement from './pages/admin/LeadManagement';
import BlogManagement from './pages/admin/BlogManagement';
import UserManagement from './pages/admin/UserManagement';

export default function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.ui);

  const isAdminPath = pathname.startsWith('/admin');

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
          </Route>
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Toaster position="top-right" />
      {!isAdminPath && <Navbar />}
      
      <main className={`flex-grow ${!isAdminPath ? 'pt-16' : ''}`}>
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
          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/career-guidance" element={<CareerGuidancePage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback for other routes while they are being built */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-6xl font-display font-bold text-primary-600 mb-4">404</h1>
              <p className="text-xl text-slate-500 mb-8">This page is under construction or doesn't exist.</p>
              <a href="/" className="btn-primary">Go back home</a>
            </div>
          } />
        </Routes>
      </main>

      {!isAdminPath && (
        <>
          <CompareWidget />
          <Footer />
        </>
      )}
    </div>
  );
}