import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Gmail_verification from "./pages/Gmail_verification";
import { useAuthStore } from "./store/useAuthStore";

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
        path="/verification"
        element={<Gmail_verification />}
      />
    </Routes>
  );
}

export default App;
