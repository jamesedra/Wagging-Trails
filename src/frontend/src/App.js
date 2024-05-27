import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DisplayOwner from "./pages/DisplayOwner";
import AddOwner from "./pages/AddOwner";
import UpdateOwner from "./pages/UpdateOwner";
import HomePage from "./pages/HomePage";
import Login from "./components/Login/LoginForm";
import Register from "./components/Login/RegisterForm";
import PostPage from "./pages/PostPage";
import FeedPage from "./pages/FeedPage";
import TagPage from "./pages/TagPage";
import ProfilePage from "./pages/ProfilePage";
import DisplayDog from "./pages/DisplayDog";
import MyFriendsPage from "./pages/MyFriends";
import MultiTagPage from "./pages/MultipleTagPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home/1" />} />
          <Route path="/home/:ownerID" element={<FeedPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/post/:ownerID/:postID" element={<PostPage />}></Route>
          <Route path="/profile/:ownerID" element={<ProfilePage />}></Route>
          <Route path="/post/:tag" element={<TagPage />}></Route>
          <Route path="/post-by-tags/:tags" element={<MultiTagPage />}></Route>
          <Route path="/owners" element={<DisplayOwner />}></Route>
          <Route path="/add-owner" element={<AddOwner />}></Route>
          <Route path="/update-owner" element={<UpdateOwner />}></Route>
          <Route path="/dogs" element={<DisplayDog />}></Route>
          <Route path="/friends/:ownerID" element={<MyFriendsPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
