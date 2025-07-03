import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-gray-800">
      {/* Hero */}
      <section
        className="bg-cover bg-center text-white min-h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Rescue Tails Ukraine</h1>
          <p className="text-lg mb-6">
            We rescue, feed, treat and support stray animals and volunteers in Ukraine.
            Join our mission — every life matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/posts"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              View Rescue Stories
            </Link>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Help Now
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-700">
          Rescue Tails Ukraine is a volunteer-driven initiative focused on saving abandoned
          and injured animals in war-affected and underserved areas of Ukraine. We collaborate
          with local rescuers and shelters to provide food, treatment, and hope.
        </p>
      </section>

      {/* Why it matters */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Why It Matters</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/ios-filled/100/dog.png"
              alt="icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Emergency Rescue</h3>
            <p>We save animals from dangerous or life-threatening conditions, including those affected by war.</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/ios-filled/100/bowl-of-food.png"
              alt="icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Food & Treatment</h3>
            <p>We provide food, vaccinations, sterilization, and medical care for injured or sick animals.</p>
          </div>
          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/ios-filled/100/volunteer.png"
              alt="icon"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Support Volunteers</h3>
            <p>We help local volunteers with food, transport, and adoption networks so they can save more lives.</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Our Rescues</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <img
            src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80"
            alt="rescued pet"
            className="rounded shadow"
          />
          <img
            src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?auto=format&fit=crop&w=800&q=80"
            alt="rescued pet"
            className="rounded shadow"
          />
          <img
            src="https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
            alt="rescued pet"
            className="rounded shadow"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 text-white text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Every small action saves lives</h2>
        <p className="mb-6">Your donation or even just a share helps animals in need.</p>
        <Link
          to="/login"
          className="bg-white text-blue-600 font-bold px-6 py-3 rounded hover:bg-gray-100 transition"
        >
          I Want to Help
        </Link>
      </section>
    </div>
  );
};

export default Home;
