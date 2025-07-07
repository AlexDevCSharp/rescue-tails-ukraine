import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const PostItem = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  const {
    title,
    description,
    imageUrl,
    facebookLink,
    tags = [],
    createdAt,
    volunteerName,
    volunteerLink,
  } = post;

  const createdDate = createdAt?.toDate?.();
  const formattedDate = createdDate ? format(createdDate, "PPP p") : "";

  const tagStyles = {
    urgent: "bg-red-100 text-red-700",
    food: "bg-yellow-100 text-yellow-800",
    medical: "bg-blue-100 text-blue-800",
    adopted: "bg-green-100 text-green-800",
    rainbow: "bg-purple-100 text-purple-800",
    new: "bg-pink-100 text-pink-800",
  };

  return (
    <div className="bg-white shadow rounded overflow-hidden flex flex-col border border-gray-200 hover:shadow-lg transition">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Animal"
          className="h-64 w-full object-cover"
        />
      )}
      <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1 text-gray-800">
            <Link to={`/posts/${post.id}`} className="hover:underline text-blue-800">
              {title}
            </Link>
          </h2>

          {formattedDate && (
            <p className="text-xs text-gray-500 mb-2">{formattedDate}</p>
          )}

          <p className="text-gray-700 text-sm mb-3">
            {description.length > 200
              ? `${description.slice(0, 200)}...`
              : description}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    tagStyles[tag] || "bg-gray-200 text-gray-800"
                  }`}
                >
                  {tag === "food"
                    ? "Food Needed"
                    : tag === "urgent"
                    ? "Urgent"
                    : tag === "medical"
                    ? "Medical Help"
                    : tag === "adopted"
                    ? "Adopted"
                    : tag === "rainbow"
                    ? "Rainbow Bridge"
                    : tag === "new"
                    ? "New Rescue"
                    : tag
                  }
                </span>
              ))}
            </div>
          )}

          {volunteerName && (
            <p className="text-sm mt-2 text-gray-600">
              By:{" "}
              {volunteerLink ? (
                <a
                  href={volunteerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {volunteerName}
                </a>
              ) : (
                volunteerName
              )}
            </p>
          )}
        </div>

        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
          {facebookLink && (
            <a
              href={facebookLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              📎 View on Facebook
            </a>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(post.id, post.imageUrl)}
              className="text-red-600 text-sm hover:underline"
            >
              🗑 Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
