import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addDoc(collection(db, "comments"), {
      postId,
      userId: user.uid,
      userName: user.displayName || user.email,
      content: newComment.trim(),
      createdAt: serverTimestamp(),
    });

    setNewComment("");
    fetchComments();
  };

  const startEditing = (comment) => {
    setEditId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditContent("");
  };

  const saveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    await updateDoc(doc(db, "comments", commentId), {
      content: editContent.trim(),
    });
    cancelEditing();
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;
    await deleteDoc(doc(db, "comments", commentId));
    fetchComments();
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {comments.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
      )}

      {comments.map((c) => (
        <div key={c.id} className="mb-3 border-b pb-2">
          {editId === c.id ? (
            <div className="flex flex-col gap-2">
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(c.id)}
                  className="text-green-700 hover:underline text-sm"
                >
                  💾 Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:underline text-sm"
                >
                  ✖ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{c.userName}:</span> {c.content}
              </p>
              {user?.uid === c.userId && (
                <div className="text-sm flex gap-2 ml-4">
                  <button
                    onClick={() => startEditing(c)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            className="border rounded px-3 py-1 flex-grow"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-sm mt-4">
          <Link to="/login" className="text-blue-600 underline">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
};

export default CommentSection;
