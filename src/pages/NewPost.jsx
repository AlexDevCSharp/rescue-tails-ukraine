import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const NewPost = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'rescuetails_preset'); // ← замени на своё

    try {
      setUploading(true);
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/c-19bb0bd05628c71aa4a984bde71290/image/upload', // ← замени
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await handleImageUpload();

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        description,
        facebookLink,
        imageUrl,
        author: user.email,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setDescription('');
      setFacebookLink('');
      setImageFile(null);
      alert('Post created!');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Facebook Link (optional)"
          className="w-full p-2 border rounded"
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default NewPost;
