import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ExploreComponent = () => {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const {Myself} = useAuthStore()

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

      // Handle structure consistently
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else if (Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else {
        console.warn("Unexpected post data structure");
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch explore post", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPost();
  }, []);

  useEffect(() => {
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
    console.log(username);    
    try {
      const res = await axiosInstance.post("/update/follow", { username });
      console.log("Following data: ",res);
      
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
                  src={artist.profilePic || "/fallback.jpg"}
                  alt={artist.username}
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
          {posts.map((artwork, i) => (
            <div
              key={i}
              onClick={() => setSelectedArtwork(artwork)}
              className="relative group overflow-hidden rounded-lg bg-gray-800 cursor-pointer"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={
                  Array.isArray(artwork.image) && artwork.image.length > 0
                    ? artwork.image[0]
                    : "/fallback.jpg"
                }
                alt={artwork.title || "Artwork"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/40 transition-all" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="font-semibold">{artwork.title}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <img
                    src={artwork.username.profilePic || "/fallback.jpg"}
                    alt="Artist"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <p className="text-sm">{artwork.username.username}</p>
                </div>
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
              src={
                Array.isArray(selectedArtwork.image) &&
                selectedArtwork.image.length > 0
                  ? selectedArtwork.image[0]
                  : "/fallback.jpg"
              }
              alt={selectedArtwork.title || "Artwork"}
              className="w-full max-h-[60vh] object-contain rounded-lg mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {selectedArtwork.title}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={selectedArtwork.username.profilePic || "/fallback.jpg"}
                className="w-6 h-6 rounded-full object-cover"
                alt="User profile"
              />
              <p className="text-white/70 text-sm sm:text-base">
                By: {selectedArtwork.username.username}
              </p>
            </div>
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
