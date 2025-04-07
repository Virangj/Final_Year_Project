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
    <div className="max-w-2xl mx-auto px-4 py-6" id="el-ixomahfi">
      {/* <!-- Feed Posts --> */}
      <div className="space-y-6" id="el-rv68wm26">
        {/* <!-- Post 1 --> */}
        {Array.isArray(artworks) &&
          artworks.map((artwork) => (
            <div
              key={artwork._id}
              className="bg-[#1A1A1A] rounded-lg border border-neutral-200/20"
              id="el-ttwkdc8r"
            >
              {/* Post Content with Image */}
              <div
                className="aspect-w-16 aspect-h-9 bg-gray-100"
                id="el-5zfvjrc3"
              >
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
              {/* <!-- Post Header --> */}
              <div
                className="p-4 flex items-center justify-between border-b border-neutral-200/20"
                id="el-fjjmeeof"
              >
                <div className="flex items-center space-x-3" id="el-ne18ujoe">
                  <div
                    className="w-10 h-10 rounded-full bg-gray-300"
                    id="el-qx0ixgwn"
                  ></div>
                  <div id="el-r7tde6mj">
                    <p className="font-medium text-white" id="el-z1y8xp5k">
                      {artwork.username}
                    </p>
                    <p className="text-sm text-gray-500" id="el-a1oqzlbf">
                      Digital Artist
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-500 rounded-full"
                  id="el-foy5yrs8"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    id="el-wzhojhr7"
                  >
                    {/* <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  id="el-wvxrhawb"
                ></path> */}
                  </svg>
                </button>
              </div>
              {/* <!-- Post Content --> */}
              <div
                className="aspect-w-16 aspect-h-9 bg-gray-100"
                id="el-5zfvjrc3"
              ></div>
              {/* <!-- Post Actions --> */}
              <div className="p-4 border-t border-neutral-200/20 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Like Button */}
                    <button className="flex items-center space-x-1">
                      <Heart className="w-6 h-6" />
                      <span>{artwork.likes.length}</span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex items-center space-x-1">
                      <MessageCircle className="w-6 h-6" />
                      <span>{artwork.comments.length}</span>
                    </button>

                    {/* Share Button */}
                    <button>
                      <Share className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Bookmark Button */}
                  <button>
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Artwork Details */}
                <div>
                  <p className="font-medium text-white">{artwork.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {artwork.description}
                  </p>
                  <p className="text-sm text-white mt-2">
                    View all 450 comments
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
