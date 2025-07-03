import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const refDoc = doc(db, 'posts', id);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const data = snap.data();
        if (!isAdmin) return navigate('/');
        setTitle(data.title || '');
        setDescription(data.description || '');
        setFacebookLink(data.facebookLink || '');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const refDoc = doc(db, 'posts', id);
      await updateDoc(refDoc, {
        title,
        description,
        facebookLink,
      });

      alert('Post updated!');
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Facebook Link"
          className="w-full border p-2 rounded"
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
