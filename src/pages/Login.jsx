import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, loginWithGoogle, loginWithFacebook, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/posts');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Login to Rescue Tails Ukraine</h1>

      <button
        onClick={loginWithGoogle}
        className="bg-red-500 text-white px-6 py-2 rounded mb-3 hover:bg-red-600"
      >
        Sign in with Google
      </button>

      <button
        onClick={loginWithFacebook}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-3 hover:bg-blue-700"
      >
        Sign in with Facebook
      </button>

      <button
        onClick={loginWithEmail}
        className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
      >
        Sign in with Email
      </button>
    </div>
  );
};

export default Login;
