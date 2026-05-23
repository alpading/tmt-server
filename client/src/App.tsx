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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/travel-test" element={<TravelTestPage />} />
          <Route path="/main" element={<MainMapPage />} />
          <Route path="/recommendation-style" element={<RecommendationStylePage />} />
          <Route path="/category-selection" element={<CategorySelectionPage />} />
          <Route path="/theme-selection" element={<ThemeSelectionPage />} />
          <Route path="/course-recommendations" element={<CourseRecommendationsPage />} />
          <Route path="/restaurant-preference" element={<RestaurantPreferencePage />} />
          <Route path="/restaurant-detail-preference" element={<RestaurantDetailPreferencePage />} />
          <Route path="/restaurant-recommendations" element={<RestaurantRecommendationsPage />} />
          <Route path="/stay-preference" element={<StayPreferencePage />} />
          <Route path="/stay-detail-preference" element={<StayDetailPreferencePage />} />
          <Route path="/activity-preference" element={<ActivityPreferencePage />} />
          <Route path="/activity-recommendations" element={<ActivityRecommendationsPage />} />
          <Route path="/stay-recommendations" element={<StayRecommendationsPage />} />
          <Route path="/restaurant-detail" element={<RestaurantDetailPage />} />
          <Route path="/stay-detail" element={<StayDetailPage />} />
          <Route path="/activity-detail" element={<ActivityDetailPage />} />
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/saved-courses" element={<SavedCoursesPage />} />
          <Route path="/saved-places" element={<SavedPlacesPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/edit-travel-tendency" element={<EditTravelTendencyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
