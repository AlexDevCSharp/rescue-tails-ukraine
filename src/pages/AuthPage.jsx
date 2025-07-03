import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister && password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/posts');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded p-8 w-full max-w-md">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              !isRegister ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isRegister ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsRegister(true)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <hr className="my-6" />

        <button
          onClick={async () => {
            try {
              await loginWithGoogle();
              navigate('/posts');
            } catch (err) {
              alert(err.message);
            }
          }}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
