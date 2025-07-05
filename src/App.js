import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import AuthPage from './pages/AuthPage';
import NewPost from './pages/NewPost';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddVolunteer from "./pages/AddVolunteer";
import Volunteers from "./pages/Volunteers";

function App() {
  return (
    <>
      <Navbar />
      <Header />
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
        <Route path="/admin/add-volunteer" element={<AddVolunteer />} />
        <Route path="/volunteers" element={<ProtectedRoute><Volunteers /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
