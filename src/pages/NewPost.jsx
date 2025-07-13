import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [createdOnFacebook, setCreatedOnFacebook] = useState("");

  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  useEffect(() => {
    const fetchVolunteers = async () => {
      const snapshot = await getDocs(collection(db, "volunteers"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVolunteers(data);
    };

    if (isAdmin) fetchVolunteers();
  }, [isAdmin]);

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setTags((prev) => [...prev, value]);
    } else {
      setTags((prev) => prev.filter((tag) => tag !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const volunteer = volunteers.find((v) => v.id === selectedVolunteer);

      await addDoc(collection(db, "posts"), {
        title,
        description,
        facebookLink,
        imageUrl,
        createdAt: serverTimestamp(),
        createdOnFacebook: createdOnFacebook ? new Date(createdOnFacebook) : serverTimestamp(),
        authorId: user.uid,
        tags,
        volunteerName: volunteer?.firstName + " " + volunteer?.lastName || "",
        volunteerLink: volunteer?.facebookLink || "",
      });

      navigate("/posts");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Facebook link (optional)"
          className="w-full border p-2 rounded"
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {isAdmin && (
          <>
            <select
              className="w-full border p-2 rounded"
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
            >
              <option value="">Select Volunteer (optional)</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.firstName} {v.lastName} ({v.city})
                </option>
              ))}
            </select>

            <input
              type="date"
              className="w-full border p-2 rounded"
              value={createdOnFacebook}
              onChange={(e) => setCreatedOnFacebook(e.target.value)}
              required
            />
          </>
        )}

        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { label: "Food Needed", value: "food" },
            { label: "Urgent", value: "urgent" },
            { label: "Medical Help", value: "medical" },
            { label: "Adopted", value: "adopted" },
            { label: "Rainbow Bridge", value: "rainbow" },
            { label: "New Rescue", value: "new" },
          ].map((tag) => (
            <label key={tag.value} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={tag.value}
                checked={tags.includes(tag.value)}
                onChange={handleTagChange}
              />
              {tag.label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
