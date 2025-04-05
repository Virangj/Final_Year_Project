import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

const Feed = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axiosInstance.get("/posts/randomposts"); // Use axiosInstance
        setArtworks(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (err) {
        setError("Failed to load artworks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  console.log(artworks);
  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
      id="el-ixomahfi"
    >
      {/* Feed Posts */}
      <div className="space-y-6" id="el-rv68wm26">
        {Array.isArray(artworks) &&
          artworks.map((artwork) => (
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

              {/* Post Actions & Content */}
              <div className="p-4 border-t border-neutral-200/20 text-white">
                {/* Post Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1">
                      <Heart className="w-6 h-6" />
                      <span className="text-sm">{artwork.likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm">{artwork.comments.length}</span>
                    </button>
                    <button>
                      <Share className="w-6 h-6" />
                    </button>
                  </div>
                  <button>
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Post Description */}
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
          ))}
      </div>
    </div>
  );
};

export default Feed;
