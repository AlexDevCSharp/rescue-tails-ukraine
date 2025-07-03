import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const PostItem = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@rescuetails.org';

  return (
    <div className="bg-white shadow rounded overflow-hidden flex flex-col">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Animal"
          className="h-64 w-full object-cover"
        />
      )}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">
            <Link to={`/posts/${post.id}`} className="hover:underline text-blue-800">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-700 text-sm mb-4">{post.description}</p>
        </div>

        <div className="mt-auto flex justify-between items-center">
          {post.facebookLink && (
            <a
              href={post.facebookLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View on Facebook
            </a>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(post.id, post.imageUrl)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
