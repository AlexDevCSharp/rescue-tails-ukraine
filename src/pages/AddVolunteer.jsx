import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const AddVolunteer = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    facebookLink: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), form);
      setMessage("Volunteer added successfully!");
      setForm({
        firstName: "",
        lastName: "",
        city: "",
        email: "",
        facebookLink: "",
      });
    } catch (err) {
      setMessage("Error adding volunteer.");
      console.error(err);
    }
  };

  if (!isAdmin) {
    return <p className="text-center text-gray-600">Only admin can access this page.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Volunteer</h2>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="facebookLink"
          placeholder="Facebook Link"
          value={form.facebookLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Volunteer
        </button>
      </form>
    </div>
  );
};

export default AddVolunteer;
