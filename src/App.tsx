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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>読み込み中...</div>;

  return (
    <Routes>
      {/* 一般公開ページ */}
      <Route path="/" element={<TopPage />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

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
