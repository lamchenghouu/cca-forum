import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Register from './pages/authAndProfile/Register';
import Login from './pages/authAndProfile/Login';
import Logout from './pages/authAndProfile/Logout';
import PostDisplay from './pages/posts/PostDisplay';
import ResetPassword from './pages/authAndProfile/ResetPassword';
import ForgotPassword from './pages/authAndProfile/ForgotPassword';
import EditProfile from './pages/authAndProfile/EditProfile';
import CreatePost from './pages/posts/CreatePost';
import EditPost from './pages/posts/EditPost';
import IndivPost from './pages/posts/IndivPost';
import EditComment from './pages/posts/EditComment';
import About from './pages/sideBarItems/About';
import TagList from './pages/sideBarItems/TagList';
// so many react hooks :)


function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          {/* viewParam is for comment opening after comment update */}
          <Route path="/posts/:mode/:id/:viewParam" element={<PostDisplay />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/createpost" element={<CreatePost />} />
          {/* here edit post :id is the postid*/}
          <Route path="/editpost/:mode/:id" element={<EditPost />} />
          <Route path="/post/:mode/:id" element={<IndivPost />} />
          <Route path="/editcomment/:mode/:id" element={<EditComment />} />
          <Route path="/taglist" element={<TagList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
