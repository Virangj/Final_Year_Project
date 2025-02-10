import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  //   const router = createBrowserRouter([
  //     {
  //       path: "/login",
  //       element: <><Login /></>
  //     },
  //   ])
  const authUser = false

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
    </Routes>
  );
}

export default App;
