import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Email_verification from "./pages/Email_verification";
import { useAuthStore } from "./store/useAuthStore";
import SignUp from "./pages/SignUp";
import Email_address from "./pages/Email_address";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";
// import ChangePassword from "./pages/ChangePassword";
// import PasswordReset from "./pages/PasswordReset";

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/login",
  //     element: <><Login /></>
  //   },
  // ])
  // const authUser = false;
  const { authUser, token } = useAuthStore()

  console.log(authUser, token)

  return (
    // <>
    //   <RouterProvider router={router} />

    // </>
    <Routes>
      <Route
        path="/"
        element={token && authUser ? <Home /> : <Navigate to="/login" replace:true />}
      />
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/" replace:true />}
      />
      <Route
        path="/emailverification"
        element={!token && authUser ? <Email_verification /> : <Navigate to="/" replace:true />}
      />
      <Route
        path="/signup"
        element={!token ? <SignUp /> : <Navigate to="/" replace:true />}
      />
      <Route
        path="/emailaddress"
        element={!token ? <Email_address /> : <Navigate to="/" replace:true />}
      />
      {/* <Route
        path="/changepassword"
        element={<ChangePassword />}
      />
      <Route
        path="/resetpassword"
        element={<PasswordReset />}
      /> */}
      <Route
        path="/profile"
        element={token && authUser ? <Profile /> : <Navigate to="/login" replace:true />}
      />
      <Route
        path="/editprofile"
        element={token && authUser ? <EditProfile /> : <Navigate to="/login" replace:true />}
      />
    </Routes>
  );
}

export default App;
