import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import ForgetPassword from "./pages/ForgetPassword";
import { Toaster } from "react-hot-toast";
import EmailVerificationpage from "./pages/EmailVerificationpage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  console.log(isAuthenticated, user);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900  via-green-900 to-emerald-900 flex justify-center items-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/sign-up" element={<Signuppage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<EmailVerificationpage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
