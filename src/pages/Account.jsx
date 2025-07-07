import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.email === "admin@rescuetails.org";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">👤 Account</h1>
      <p className="text-gray-700 mb-2">
        <strong>Email:</strong> {user?.email}
      </p>

      {isAdmin ? (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">🛠 Admin Tools</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <a href="/posts" className="text-blue-600 hover:underline">
                Manage Posts
              </a>
            </li>
            <li>
              <a href="/volunteers" className="text-blue-600 hover:underline">
                Manage Volunteers
              </a>
            </li>
            {/* Будущие функции админа можно добавить здесь */}
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">📋 My Activity</h2>
          <p className="text-gray-600">
            Here you’ll see your donations and posts in future.
          </p>
        </>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
