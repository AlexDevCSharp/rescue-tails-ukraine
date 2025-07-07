import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import { format } from "date-fns";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "posts", id));
      if (!snap.exists()) return navigate("/posts");

      const data = snap.data();
      if (!isAdmin) return navigate("/");

      setTitle(data.title || "");
      setDescription(data.description || "");
      setFacebookLink(data.facebookLink || "");
      setTags(data.tags || []);
      setImageUrl(data.imageUrl || "");
      setOldImageUrl(data.imageUrl || "");
      setSelectedVolunteer(data.volunteerId || "");
      setUpdatedAt(data.updatedAt?.toDate() || null);

      const volSnap = await getDocs(collection(db, "volunteers"));
      const volList = volSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVolunteers(volList);

      setLoading(false);
    };

    fetchData();
  }, [id, isAdmin, navigate]);

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        // Удалим старое изображение, если было
        if (oldImageUrl) {
          const publicId = oldImageUrl
            .split("/")
            .pop()
            .split(".")[0]; // получаем public_id
          await fetch(`https://api.cloudinary.com/v1_1/c-19bb0bd05628c71aa4a984bde71290/image/destroy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              public_id: publicId,
              api_key: "752552293275684",
              api_secret: "CMKAUqUWTlP5YQkjh8parBsMRr4",
            }),
          });
        }

        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const volunteer = volunteers.find((v) => v.id === selectedVolunteer);

      await updateDoc(doc(db, "posts", id), {
        title,
        description,
        facebookLink,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
        ...(isAdmin && {
          tags,
          volunteerId: selectedVolunteer || "",
          volunteerName: volunteer?.firstName + " " + volunteer?.lastName || "",
          volunteerLink: volunteer?.facebookLink || "",
        }),
      });

      alert("Post updated!");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

      {updatedAt && (
        <p className="text-sm text-gray-500 mb-2">
          Last updated: {format(updatedAt, "PPP p")}
        </p>
      )}

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

        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="w-full h-48 object-cover rounded shadow mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        {isAdmin && (
          <>
            <select
              value={selectedVolunteer}
              onChange={(e) => setSelectedVolunteer(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Volunteer (optional)</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.firstName} {v.lastName} ({v.city})
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-4 mt-4">
              {["food", "urgent", "medical", "adopted", "rainbow", "new"].map(
                (tag) => (
                  <label key={tag} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={tags.includes(tag)}
                      onChange={handleTagChange}
                    />
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
                      : "New Rescue"}
                  </label>
                )
              )}
            </div>
          </>
        )}

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
