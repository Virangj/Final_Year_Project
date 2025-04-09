import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Heart, MessageCircle, Share } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const fetchPosts = async (page) => {
    const res = await axiosInstance.get(`/posts/randomposts?page=${page}&limit=10`);
    return res.json();
};

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    // const [like,setlike] = useState


    const loadMorePosts = async () => {
        const newPosts = await fetchPosts(page);
        if (newPosts.length === 0) {
            setHasMore(false);
        } else {
            setPosts((prev) => [...prev, ...newPosts]);
            setPage((prev) => prev + 1);
        }
    };

    // const like = async ()=>{

    // }

    return (
        <>
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={hasMore}
                loader={<p className="text-center">Loading more posts...</p>}
                className="p-4"
                scrollThreshold={0.8}
            >
                {posts.map((post) => (
                    <div className="p-4 shadow-lg w-[40%] mx-auto rounded-xl border bg-white text-black">
                        <div className="flex items-center space-x-3">
                            <img
                                src={post.userimage}
                                alt={post.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{post.username}</h3>
                                <p className="text-sm text-gray-500">{post.userrole}</p>
                            </div>
                        </div>

                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-60 object-cover rounded-lg mt-3"
                        // onDoubleClick={like}
                        />

                        <div className=" flex flex-col mt-3 pl-0">
                            <div className="flex space-x-3  text-gray-600">
                                <span className="flex items-center space-x-1">
                                    <Heart size={18} /> <span>{post.likes}k</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <MessageCircle size={18} /> <span>{post.comments}</span>
                                </span>
                                <Share size={18} />
                            </div>
                            <h4 className="font-bold mt-2">{post.title}</h4>
                            <p className="text-gray-600 text-sm">{post.description}</p>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
            <div className="p-4 shadow-lg w-[40%] mx-auto rounded-xl border bg-white text-black">
                <div className="flex items-center space-x-3">
                    <img
                        src={'/background_Image.png'}
                        alt="artist"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">sagar</h3>
                        <p className="text-sm text-gray-500">ganesh</p>
                    </div>
                </div>

                <img
                    src={'/background_Image.png'}
                    alt="artist"
                    className="w-full h-60 object-cover rounded-lg mt-3"
                // onDoubleClick={}
                />

                <div className=" flex flex-col mt-3 pl-0">
                    <div className="flex space-x-3">
                        <span className="flex items-center space-x-1">
                            <Heart size={18} className="ml-0" /> <span>100k</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <MessageCircle size={18} /> <span>comment</span>
                        </span>
                        <Share size={18} />
                    </div>
                    <h4 className="font-bold mt-2">title</h4>
                    <p className="text-gray-600 text-sm">description</p>
                </div>
            </div>
        </>
    );
}
