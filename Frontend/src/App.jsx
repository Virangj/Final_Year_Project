import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import Email_verification from "./pages/Email_verificationPage";
import { useAuthStore } from "./store/useAuthStore";
import SignUp from "./pages/SignUpPage";
import Email_address from "./pages/Email_addressPage";
import { Toaster } from "react-hot-toast";
import PostDetails from "./pages/PostDetailsPage";
import Explore from "./pages/ExplorePage";
import Chat from "./pages/ChatPage";

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
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/Explore" element={<Explore />}/>
        <Route path="/Chat" element={<Chat />}/>
      </Routes>
    </>
  );
}

export default App;
