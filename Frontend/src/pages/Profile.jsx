import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/NavbarComponent';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts'); // Set default active tab
    const [showFullBio, setShowFullBio] = useState(false);
    const [posts, setposts] = useState([])
    const [suggestedUsers, setsuggestedUser] = useState([])
    const [mostliked, setmostliked] = useState([])
    const { authUser, userUpdate } = useAuthStore()
    const navigate = useNavigate()

    const fetchPosts = async () => {
        try {
            console.log("authUser: ", authUser);
            const res = await axiosInstance.get(`/posts/getmypost`); // 
            console.log(res);
            setposts(res.data.posts);
        } catch (err) {
            console.error('Error fetching user posts:', err.response.data.message);
        }
    };

    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
        try {
            // console.log("hi")
            const res = await axiosInstance.get('/posts/suggested');
            setsuggestedUser(res.data.suggestedUsers);
            // console.log(res.data.suggestedUsers)
        } catch (err) {
            console.error('Error fetching suggested users:', err);
        }
    };

    useEffect(() => {
        if (authUser.role === "artist") {
            fetchPosts();
        }
        if (authUser.role !== "artist") {
            fetchSuggestedUsers()
            setActiveTab("suggested")
            console.log(suggestedUsers)
        }
    }, []);

    const navigating = () => {
        navigate("/editprofile")
    };


    const sortedmostlikedPosts = () => {
        if (!posts || posts.length === 0) return []
        const mostlike = ([...posts].sort((a, b) => b.likes.Totallike - a.likes.Totallike))
        setmostliked(mostlike)
    };

    const toggleFollowButton = async (userId) => {
        try {
            const res = await axiosInstance.post(`/update/follow/${userId}`); // backend handles toggle
            const currentFollowing = authUser?.following || [];

            const isFollowing = currentFollowing.includes(userId);

            const updatedFollowing = isFollowing
                ? currentFollowing.filter((id) => id !== userId) // Remove
                : [...currentFollowing, userId]; // Add

            userUpdate('following', updatedFollowing);
            setsuggestedUser((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, followers: res.data.followers } : user
                )
            )
            toast.success(res.data.message)
        } catch (error) {
            console.error("Follow/Unfollow error:", error);
        }
    };

    const handleLikeToggle = async (postId) => {
        try {
            const post = posts.find((post) => post._id === postId);
            if (!post) return;
            const isLiked = post.likes.userId?.includes(authUser._id); // Assuming post.likes.users is an array of userIds
            let response;

            if (isLiked) {
                response = await axiosInstance.post("/posts/unlikepost", { postId });
            } else {
                response = await axiosInstance.post("/posts/likepost", { postId });
            }

            const updatedLikes = response.data.likes;

            setposts((prev) =>
                prev.map((post) =>
                    post._id === postId ? { ...post, likes: updatedLikes } : post
                )
            );
            setmostliked((prev) =>
                prev.map((post) =>
                    post._id === postId ? { ...post, likes: updatedLikes } : post
                )
            )
        } catch (error) {
            console.error("Like toggle failed:", error);
            toast.error("Failed to update like status.");
        }
    };

    const handleShare = () => {
        const currentUrl = window.location.href;
        navigator.clipboard
            .writeText(currentUrl)
            .then(() => {
                toast.success("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
                toast.error("Failed to copy the link.");
            });
    };


    return (
        <>
            <div className="bg-[#080808] min-h-screen flex flex-col md:flex-row">
                <Navbar />
                <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg border border-neutral-200/20 p-6 mb-6 w-full overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                            {/* Profile Picture */}
                            <div className="w-32 h-32 rounded-full aspect-square bg-gray-300 overflow-hidden flex-shrink-0">
                                <img src={authUser.profilePic} className="w-full h-full object-cover" />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 w-full px-2">
                                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                                    <div className="text-center md:text-left">
                                        <h1 className="text-2xl font-semibold break-words">{authUser.username}</h1>
                                        <p className="text-gray-500">{authUser.arttype}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                                        <button
                                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                                            onClick={navigating}
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                            onClick={handleShare}
                                        >
                                            Share Profile
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-6 mb-4">
                                    {authUser.role === "artist" && <div className="text-center">
                                        <p className="font-bold">{posts.length}</p>
                                        <p className="text-gray-500">Posts</p>
                                    </div>}
                                    <div className="text-center">
                                        <p className="font-bold">{authUser.followers?.length || 0}</p>
                                        <p className="text-gray-500">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">{authUser.following?.length || 0}</p>
                                        <p className="text-gray-500">Following</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="w-full max-w-full overflow-hidden">
                                    <p className={`text-sm text-gray-700 whitespace-pre-wrap break-all transition-all   duration-200 ${showFullBio ? "" : "line-clamp-3"}`}>
                                        {authUser.bio}
                                    </p>
                                    {authUser?.bio?.length > 100 && (
                                        <button
                                            onClick={() => setShowFullBio(!showFullBio)}
                                            className="mt-1 text-xs text-black font-medium underline hover:text-gray-800"
                                        >
                                            {showFullBio ? "Show Less" : "Read More"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!-- Content Tabs --> */}
                    <div className="bg-white rounded-lg border border-neutral-200/20">
                        {/* <!-- Tab Navigation --> */}
                        <div className="flex border-b border-neutral-200/20">
                            {authUser.role === "artist" && (
                                <>
                                    <button className={`flex-1 py-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`} onClick={() => setActiveTab("posts")} >Posts</button>
                                    <button className={`flex-1 py-4 font-medium ${activeTab === 'mostliked' ? 'border-b-2 border-black' : ''}`}
                                        onClick={() => {
                                            setActiveTab('mostliked')
                                            sortedmostlikedPosts()
                                        }}>Most liked</button>
                                </>
                            )}
                            <button className={`flex-1 py-4 font-medium ${activeTab === 'suggested' ? 'border-b-2 border-black' : ''}`}
                                onClick={() => {
                                    setActiveTab('suggested')
                                    fetchSuggestedUsers()
                                }}>suggested</button>
                        </div>

                        {activeTab === 'posts' && authUser.role === "artist" && (
                            <div className="p-4">
                                {posts.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {posts.slice().reverse().map((post, index) => (
                                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                                onDoubleClick={() => handleLikeToggle(post._id)}
                                            >
                                                <img
                                                    src={post.image[0]}
                                                    alt="Post"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>
                                                        <Heart className={`${post.likes.userId.includes(authUser._id) ? "text-red-500 fill-red-500" : ""}`} />
                                                    </span>
                                                    <span>{post.likes.Totallike || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* <!-- mostliked Posts --> */}

                        {activeTab === 'mostliked' && authUser.role === "artist" && (
                            <div className="p-4">
                                {mostliked.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {mostliked.map((post) => (
                                            <div
                                                key={post._id}
                                                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                                onDoubleClick={() => handleLikeToggle(post._id)}
                                            >
                                                <img
                                                    src={post.image[0]}
                                                    alt="mostliked Post"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>
                                                        <Heart className={`${post.likes.userId.includes(authUser._id) ? "text-red-500 fill-red-500" : ""}`} />
                                                    </span>
                                                    <span>{post.likes.Totallike || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* <!-- suggested List --> */}
                        {activeTab === 'suggested' && (
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {suggestedUsers.map((user, index) => (
                                        <div key={index} className='w-full h-full flex flex-col bg-gray-400 border border-neutral-200/20 rounded-lg space-x-4 p-4' >
                                            <div className="flex items-center space-x-2 " onClick={() => navigate(`/otheruserprofile/${user.username}`)}>
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                                                    <img src={user.profilePic} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{user.username}</h3>
                                                    <p className="text-sm text-gray-500">{user.arttype}</p>
                                                    < p className="text-sm text-gray-500">{user?.followers?.length || 0} followers</p>
                                                </div>
                                            </div>
                                            <button className="mt-2 px-4 py-1 text-sm bg-black text-white rounded-md hover:bg-gray-900"
                                                onClick={() => toggleFollowButton(user._id)}>
                                                {authUser.following?.includes(user._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div >
                </div >
            </div >
        </>
    )
}

export default Profile