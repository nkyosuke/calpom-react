// App.tsx
import { Routes, Route } from "react-router-dom";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import ResetPassword from "./auth/ResetPassword";
import CalendarApp from "./AppMain";
import { Navigate } from "react-router-dom";
import TopPage from "./pages/TopPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BlogArticle1 from "./pages/BlogArticle1";
import BlogArticle2 from "./pages/BlogArticle2";
import BlogArticle3 from "./pages/BlogArticle3";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePageTracking } from "./hooks/useAnalytics";
import { auth } from "./firebase";
import GeminiTest from "./pages/GeminiTest";

function App() {
  usePageTracking();
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>読み込み中...</div>;

  return (
    <Routes>
      {/* 一般公開ページ */}
      <Route path="/" element={<TopPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/blog/1" element={<BlogArticle1 />} />
      <Route path="/blog/2" element={<BlogArticle2 />} />
      <Route path="/blog/3" element={<BlogArticle3 />} />
      <Route path="/gemini-test" element={<GeminiTest />} />
      {/* 認証関連 */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset" element={<ResetPassword />} />
      {/* アプリ本体（認証必須） */}
      <Route
        path="/calendar"
        element={user ? <CalendarApp /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
