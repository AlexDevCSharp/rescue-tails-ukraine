import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const Volunteers = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === "admin@rescuetails.org";

  const [volunteers, setVolunteers] = useState([]);
  const [newVolunteer, setNewVolunteer] = useState({
    firstName: "",
    lastName: "",
    city: "",
    facebookLink: "",
    email: "",
  });

  const fetchVolunteers = async () => {
    const snapshot = await getDocs(collection(db, "volunteers"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVolunteers(data);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleChange = (e) => {
    setNewVolunteer({ ...newVolunteer, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), {
        ...newVolunteer,
        createdAt: serverTimestamp(),
      });
      setNewVolunteer({
        firstName: "",
        lastName: "",
        city: "",
        facebookLink: "",
        email: "",
      });
      fetchVolunteers();
    } catch (err) {
      console.error("Error adding volunteer:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this volunteer?")) return;
    try {
      await deleteDoc(doc(db, "volunteers", id));
      fetchVolunteers();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Volunteers</h1>

      {isAdmin && (
        <form onSubmit={handleAdd} className="space-y-3 mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Add Volunteer</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border p-2 rounded"
              value={newVolunteer.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border p-2 rounded"
              value={newVolunteer.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="border p-2 rounded"
              value={newVolunteer.city}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={newVolunteer.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="facebookLink"
              placeholder="Facebook Link"
              className="col-span-2 border p-2 rounded"
              value={newVolunteer.facebookLink}
              onChange={handleChange}
            />
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add
          </button>
        </form>
      )}

      <div className="bg-white rounded shadow p-4">
        {volunteers.length === 0 ? (
          <p>No volunteers found.</p>
        ) : (
          <ul className="space-y-3">
            {volunteers.map((v) => (
              <li
                key={v.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">
                    {v.firstName} {v.lastName} ({v.city})
                  </p>
                  <p className="text-sm text-gray-600">{v.email}</p>
                  {v.facebookLink && (
                    <a
                      href={v.facebookLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm"
                    >
                      Facebook
                    </a>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Volunteers;
