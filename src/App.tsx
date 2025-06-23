// App.tsx
import { Routes, Route } from 'react-router-dom';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ResetPassword from './auth/ResetPassword';
import CalendarApp from './AppMain';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/calendar" element={<CalendarApp />} />
    </Routes>
  );
}

export default App;
