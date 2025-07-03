import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import PostItem from '../components/PostItem';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId, imageUrl) => {
    const confirm = window.confirm('Delete this post?');
    if (!confirm) return;

    await deleteDoc(doc(db, 'posts', postId));
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(() => {});
    }

    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Rescue Stories</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((post) => (
          <PostItem key={post.id} post={post} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
