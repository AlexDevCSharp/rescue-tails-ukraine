import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const refDoc = doc(db, 'posts', id);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      } else {
        navigate('/posts');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirm = window.confirm('Delete this post?');
    if (!confirm) return;

    await deleteDoc(doc(db, 'posts', post.id));
    if (post.imageUrl) {
      const imageRef = ref(storage, post.imageUrl);
      await deleteObject(imageRef).catch(() => {});
    }

    alert('Post deleted');
    navigate('/posts');
  };

  if (!post) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-72 object-cover rounded mb-6 shadow"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.description}</p>

      {post.facebookLink && (
        <a
          href={post.facebookLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline block mb-4"
        >
          View on Facebook
        </a>
      )}

      <p className="text-sm text-gray-500 mb-6">
        Posted by <strong>{post.author}</strong>
      </p>

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
