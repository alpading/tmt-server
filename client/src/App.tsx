import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TravelTestPage from './pages/TravelTestPage';
import MainMapPage from './pages/MainMapPage';
import RecommendationStylePage from './pages/RecommendationStylePage';
import MyPage from './pages/MyPage';
import SavedCoursesPage from './pages/SavedCoursesPage';
import SavedPlacesPage from './pages/SavedPlacesPage';
import EditProfilePage from './pages/EditProfilePage';
import EditTravelTendencyPage from './pages/EditTravelTendencyPage';
import CategorySelectionPage from './pages/CategorySelectionPage';
import RestaurantPreferencePage from './pages/RestaurantPreferencePage';
import RestaurantDetailPreferencePage from './pages/RestaurantDetailPreferencePage';
import RestaurantRecommendationsPage from './pages/RestaurantRecommendationsPage';
import StayPreferencePage from './pages/StayPreferencePage';
import StayDetailPreferencePage from './pages/StayDetailPreferencePage';
import ActivityPreferencePage from './pages/ActivityPreferencePage';
import StayRecommendationsPage from './pages/StayRecommendationsPage';
import ActivityRecommendationsPage from './pages/ActivityRecommendationsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import StayDetailPage from './pages/StayDetailPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import WriteReviewPage from './pages/WriteReviewPage';
import ThemeSelectionPage from './pages/ThemeSelectionPage';
import CourseRecommendationsPage from './pages/CourseRecommendationsPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/travel-test" element={<TravelTestPage />} />
          <Route path="/main" element={<PrivateRoute><MainMapPage /></PrivateRoute>} />
          <Route path="/recommendation-style" element={<PrivateRoute><RecommendationStylePage /></PrivateRoute>} />
          <Route path="/category-selection" element={<PrivateRoute><CategorySelectionPage /></PrivateRoute>} />
          <Route path="/theme-selection" element={<PrivateRoute><ThemeSelectionPage /></PrivateRoute>} />
          <Route path="/course-recommendations" element={<PrivateRoute><CourseRecommendationsPage /></PrivateRoute>} />
          <Route path="/restaurant-preference" element={<PrivateRoute><RestaurantPreferencePage /></PrivateRoute>} />
          <Route path="/restaurant-detail-preference" element={<PrivateRoute><RestaurantDetailPreferencePage /></PrivateRoute>} />
          <Route path="/restaurant-recommendations" element={<PrivateRoute><RestaurantRecommendationsPage /></PrivateRoute>} />
          <Route path="/stay-preference" element={<PrivateRoute><StayPreferencePage /></PrivateRoute>} />
          <Route path="/stay-detail-preference" element={<PrivateRoute><StayDetailPreferencePage /></PrivateRoute>} />
          <Route path="/activity-preference" element={<PrivateRoute><ActivityPreferencePage /></PrivateRoute>} />
          <Route path="/activity-recommendations" element={<PrivateRoute><ActivityRecommendationsPage /></PrivateRoute>} />
          <Route path="/stay-recommendations" element={<PrivateRoute><StayRecommendationsPage /></PrivateRoute>} />
          <Route path="/restaurant-detail" element={<PrivateRoute><RestaurantDetailPage /></PrivateRoute>} />
          <Route path="/stay-detail" element={<PrivateRoute><StayDetailPage /></PrivateRoute>} />
          <Route path="/activity-detail" element={<PrivateRoute><ActivityDetailPage /></PrivateRoute>} />
          <Route path="/write-review" element={<PrivateRoute><WriteReviewPage /></PrivateRoute>} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/saved-courses" element={<PrivateRoute><SavedCoursesPage /></PrivateRoute>} />
          <Route path="/saved-places" element={<PrivateRoute><SavedPlacesPage /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
          <Route path="/edit-travel-tendency" element={<PrivateRoute><EditTravelTendencyPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
