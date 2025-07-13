import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import PostItem from "../components/PostItem";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // сортировка по createdOnFacebook (по убыванию)
      fetchedPosts.sort((a, b) => {
        const dateA = a.createdOnFacebook?.toDate?.() || new Date(0);
        const dateB = b.createdOnFacebook?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId, imageUrl) => {
    const confirm = window.confirm("Delete this post?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const uniqueVolunteers = Array.from(
    new Set(
      posts
        .filter((p) => p.volunteerName && p.volunteerLink)
        .map((p) => `${p.volunteerName}|||${p.volunteerLink}`)
    )
  ).map((entry) => {
    const [name, link] = entry.split("|||");
    return { name, link };
  });

  const filterPosts = () => {
    return posts.filter((post) => {
      const tagMatch =
        selectedTag === "all" || post.tags?.includes(selectedTag);
      const volunteerMatch =
        selectedVolunteer === "all" ||
        post.volunteerName === selectedVolunteer;
      return tagMatch && volunteerMatch;
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rescue Posts</h1>

      {/* Фильтры по тегам */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {[
          "all",
          "food",
          "urgent",
          "medical",
          "adopted",
          "rainbow",
          "new",
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full border ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tag === "all"
              ? "All"
              : tag === "food"
              ? "Food Needed"
              : tag === "urgent"
              ? "Urgent"
              : tag === "medical"
              ? "Medical Help"
              : tag === "adopted"
              ? "Adopted"
              : tag === "rainbow"
              ? "Rainbow Bridge"
              : "New Rescue"}
          </button>
        ))}
      </div>

      {/* Фильтры по волонтёрам */}
      {uniqueVolunteers.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Filter by Volunteer:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVolunteer("all")}
              className={`px-3 py-1 rounded text-sm ${
                selectedVolunteer === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All
            </button>
            {uniqueVolunteers.map((vol) => (
              <button
                key={vol.link}
                onClick={() => setSelectedVolunteer(vol.name)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedVolunteer === vol.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {vol.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Посты */}
      <div className="grid gap-6">
        {filterPosts().length === 0 ? (
          <p>No posts found.</p>
        ) : (
          filterPosts().map((post) => (
            <PostItem key={post.id} post={post} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
