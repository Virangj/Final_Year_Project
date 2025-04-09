import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { X } from "lucide-react";

const ExploreComponent = () => {
  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/explore/users");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch explore user", err);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get("/posts/randomposts");
      setPost(res.data.data);
    } catch (err) {
      console.error("Failed to fetch explore post", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, []);

  useEffect(() => {
    // Lock scroll when modal open
    if (selectedArtwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedArtwork]);

  const categories = [
    "All",
    "Digital Art",
    "Photography",
    "Illustrations",
    "Paintings",
    "3D Art",
  ];

  const handleFollowing = async (username) => {
    try {
      const res = await axiosInstance.post("/update/follow", { username });
      console.log(res.data);
      fetchUser(); // Refresh users after following
    } catch (error) {
      console.error("Failed in following user", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white px-4 py-6 max-w-7xl mx-auto relative">
      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-4 mb-8 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`px-6 py-2 rounded-full whitespace-nowrap ${
              i === 0 ? "bg-white text-black" : "bg-black border border-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Artists */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trending Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {user.map((artist, idx) => (
            <div
              key={idx}
              className="bg-white text-black p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{artist.username}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {artist.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {artist.followers} followers
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFollowing(artist.username)}
                className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Artworks */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Trending Artworks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          {post.map((artwork, i) => (
            <div
              key={i}
              onClick={() => setSelectedArtwork(artwork)}
              className="relative group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={artwork.image[0]}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/40 transition-all" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="font-semibold">{artwork.title}</p>
                <p className="text-sm">by {artwork.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Artwork Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-gray-900 rounded-lg p-4 sm:p-6">
            <button
              className="absolute top-4 right-4 text-white hover:text-red-400"
              onClick={() => setSelectedArtwork(null)}
            >
              <X size={28} />
            </button>
            <img
              src={selectedArtwork.image[0]}
              alt={selectedArtwork.title}
              className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {selectedArtwork.title}
            </h2>
            <p className="text-white/70 mb-1 text-sm sm:text-base">
              By: {selectedArtwork.username}
            </p>
            <p className="text-white/60 text-sm sm:text-base">
              {selectedArtwork.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreComponent;
