import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Email_verification from "./pages/Email_verification";
import { useAuthStore } from "./store/useAuthStore";
import SignUp from "./pages/SignUp";
import Email_address from "./pages/Email_address";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";

function App() {
  const { authUser, token } = useAuthStore();

  return (
    <>
    <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            token && authUser ? <Home /> : <Navigate to="/login" replace:true />
          }
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace:true />}
        />
        <Route
          path="/emailverification"
          element={
            !token && authUser ? (
              <Email_verification />
            ) : (
              <Navigate to="/" replace:true />
            )
          }
        />
        <Route
          path="/signup"
          element={!token ? <SignUp /> : <Navigate to="/" replace:true />}
        />
        <Route
          path="/emailaddress"
          element={
            !token ? <Email_address /> : <Navigate to="/" replace:true />
          }
        />
         <Route
          path="/profile"
          element={
            token && authUser ? <Profile /> : <Navigate to="/login" replace:true />
          }
        />
         <Route
          path="/"
          element={
            token && authUser ? <EditProfile /> : <Navigate to="/login" replace:true />
          }
        />
      </Routes>
    </>
  );
}

export default App;
