import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

const Feed = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch artworks on load
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axiosInstance.get("/posts/randomposts");
        setArtworks(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        localStorage.setItem("Posts", JSON.stringify(response.data.data));
      } catch (err) {
        setError("Failed to load artworks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Toggle like on a post
  const toggleLike = async (postId) => {
    try {
      const res = await axiosInstance.post("/posts/likepost", { postId }); // ✅ BACKEND API
      const updatedLikes = res.data.likes;

      // Update local state
      setArtworks((prevArtworks) =>
        prevArtworks.map((art) =>
          art._id === postId ? { ...art, likes: updatedLikes } : art
        )
      );
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Something went wrong while liking the post!");
    }
  };

  const userId = "USER_ID"; // Replace with logged-in user ID (e.g., from context or store)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Feed Posts */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          artworks.map((artwork) => {
            const isLiked = artwork.likes.includes(userId); // Check if user has liked
            return (
              <div
                key={artwork._id}
                className="bg-[#1A1A1A] rounded-xl border border-neutral-200/20 overflow-hidden"
              >
                {/* Post Image */}
                <div className="aspect-video bg-gray-100">
                  {artwork.image && artwork.image.length > 0 ? (
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      slidesPerView={1}
                      className="w-full h-full"
                    >
                      {artwork.image.map((img, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={img}
                            alt={`Artwork Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src="default_image.png"
                      alt="Default Artwork Image"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-neutral-200/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">
                        {artwork.username}
                      </p>
                      <p className="text-xs text-gray-500">Digital Artist</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-full">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="6" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="18" r="1" />
                    </svg>
                  </button>
                </div>

                {/* Post Actions */}
                <div className="p-4 border-t border-neutral-200/20 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => toggleLike(artwork._id)}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isLiked ? "text-red-500 fill-red-500" : ""
                          }`}
                        />
                        <span className="text-sm">{artwork.likes.length}</span>
                      </button>
                      <button className="flex items-center space-x-1">
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm">
                          {artwork.comments.length}
                        </span>
                      </button>
                      <button>
                        <Share className="w-6 h-6" />
                      </button>
                    </div>
                    <button>
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">
                      {artwork.title}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {artwork.description}
                    </p>
                    <p className="text-sm text-white mt-2">
                      View all {artwork.comments.length} comments
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;
