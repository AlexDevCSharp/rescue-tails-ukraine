import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import PostItem from "../components/PostItem";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    };

    fetchPosts();
  }, []);

  // Получение списка уникальных волонтёров
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

      {/* Фильтр по тегам */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {[
          { label: "All", value: "all" },
          { label: "Food Needed", value: "food" },
          { label: "Urgent", value: "urgent" },
          { label: "Medical Help", value: "medical" },
          { label: "Adopted", value: "adopted" },
          { label: "Rainbow Bridge", value: "rainbow" },
          { label: "New Rescue", value: "new" },
        ].map((tag) => (
          <button
            key={tag.value}
            onClick={() => setSelectedTag(tag.value)}
            className={`px-3 py-1 rounded-full border ${
              selectedTag === tag.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Фильтр по волонтёрам */}
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
          filterPosts().map((post) => <PostItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Posts;
