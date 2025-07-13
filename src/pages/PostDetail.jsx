import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import CommentSection from "../components/CommentSection";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const refDoc = doc(db, "posts", id);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      } else {
        navigate("/posts");
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this post?");
    if (!confirm) return;

    await deleteDoc(doc(db, "posts", post.id));
    if (post.imageUrl) {
      const imageRef = ref(storage, post.imageUrl);
      await deleteObject(imageRef).catch(() => {});
    }

    alert("Post deleted");
    navigate("/posts");
  };

  if (!post) return <div className="text-center py-20">Loading...</div>;

  const {
    title,
    description,
    imageUrl,
    facebookLink,
    createdAt,
    tags = [],
    volunteerName,
    volunteerLink,
  } = post;

  const formattedDate = createdAt?.toDate
    ? format(createdAt.toDate(), "PPP p")
    : "";

  const tagStyles = {
    urgent: "bg-red-100 text-red-700",
    food: "bg-yellow-100 text-yellow-800",
    medical: "bg-blue-100 text-blue-800",
    adopted: "bg-green-100 text-green-800",
    rainbow: "bg-purple-100 text-purple-800",
    new: "bg-indigo-100 text-indigo-800",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post"
          className="w-full h-72 object-cover rounded mb-6 shadow"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{title}</h1>

      {formattedDate && (
        <p className="text-sm text-gray-500 mb-2">Posted: {formattedDate}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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
                ? "🌈 Rainbow Bridge"
                : tag === "new"
                ? "New Rescue"
                : tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700 mb-4 whitespace-pre-line">{description}</p>

      <CommentSection postId={post.id} />

      {facebookLink && (
        <a
          href={facebookLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline block mb-4"
        >
          📎 View on Facebook
        </a>
      )}

      {volunteerName && (
        <p className="text-sm text-gray-600 mb-6">
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

      {isAdmin && (
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Post
          </button>
          <button
            onClick={() => navigate(`/posts/${post.id}/edit`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
