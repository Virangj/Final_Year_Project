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
import Email_address from "./pages/Email_Address";

function App() {
    // const router = createBrowserRouter([
    //   {
    //     path: "/login",
    //     element: <><Login /></>
    //   },
    // ])
  // const authUser = false;
  const {authUser} = useAuthStore()

  return (
    // <>
    //   <RouterProvider router={router} />

    // </>
    <Routes>
      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/emailverification"
        element={<Email_verification />}
      />
      <Route
        path="/signup"
        element={!authUser ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/emailaddress"
        element={<Email_address />}
      />
    </Routes>
  );
}

export default App;
