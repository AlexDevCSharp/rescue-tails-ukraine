import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import AuthPage from './pages/AuthPage';
import NewPost from './pages/NewPost';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
