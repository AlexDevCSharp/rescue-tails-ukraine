import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-blue-700 text-center sm:text-left"
        >
          🐾 Rescue Tails Ukraine
        </Link>

        <div className="flex justify-center sm:justify-end gap-4 text-sm">
          <Link
            to="/posts"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Posts
          </Link>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Facebook
          </a>
          <Link to="/volunteers" className="text-blue-600 underline">Manage Volunteers</Link>
        </div>
      </div>
    </header>
  );
};


export default Header;
