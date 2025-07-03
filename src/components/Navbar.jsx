import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.email === 'admin@rescuetails.org';

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="text-blue-600 font-bold">
          Home
        </Link>
        <Link to="/posts" className="text-blue-600 hover:underline">
          Posts
        </Link>
        {isAdmin && (
          <Link to="/new" className="text-blue-600 hover:underline">
            Create Post
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={logout}
            className="text-red-500 font-medium hover:underline"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
