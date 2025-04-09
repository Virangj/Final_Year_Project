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
<<<<<<< HEAD
import PostDetails from "./pages/PostDetailsPage";
import Explore from "./pages/ExplorePage";
import Chat from "./pages/ChatPage";
=======
import Profile from "./pages/Profile";
import EditProfile from "./pages/Editprofile";
import CreatePost from "./pages/CreatePost";
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2

function App() {
  const { authUser, token } = useAuthStore();

  console.log(authUser,token)

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
<<<<<<< HEAD
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/Explore" element={<Explore />}/>
        <Route path="/Chat" element={<Chat />}/>
=======
         <Route
          path="/profile"
          element={
            token && authUser ? <Profile /> : <Navigate to="/login" replace:true />
          }
        />
         <Route
          path="/editprofile"
          element={
            token && authUser ? <EditProfile /> : <Navigate to="/login" replace:true />
          }
        />
        <Route
          path="/createpost"
          element={
            token && authUser ? <CreatePost /> : <Navigate to="/login" replace:true />
          }
        />
>>>>>>> 863d417fd35179da1196c9a62701ea8df0c4e9d2
      </Routes>
    </>
  );
}

export default App;
