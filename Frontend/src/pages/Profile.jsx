import React, { useState, useMemo, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts'); // Set default active tab
    const [showFullBio, setShowFullBio] = useState(false);
    const [posts, setposts] = useState([])
    const [suggestedUsers, setsuggestedUser] = useState([])
    const { authUser } = useAuthStore()
    const navigate = useNavigate()

    const fetchPosts = async () => {
        try {
            const res = await axiosInstance.get(`/post/getmypost/?role=${authUser.role}&username=${authUser.username}`); // 
            setposts(res.data.posts);
        } catch (err) {
            console.error('Error fetching user posts:', err.response.data.message);
        }
    };

    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
        try {
            console.log("hi")
            const res = await axiosInstance.get('/post/suggested');
            setsuggestedUser(res.data.suggestedUsers);
            console.log(res.data.suggestedUsers)
        } catch (err) {
            console.error('Error fetching suggested users:', err);
        }
    };

    useEffect(() => {
        if (authUser.role === "artist") {
            fetchPosts();
        }
    }, []);

    const showContent = (value) => {
        setActiveTab(value); // Update active tab on button click
        if (value === "suggested") {
            fetchSuggestedUsers()
        }
    };

    const navigating = () => {
        navigate("/editprofile")
    };


    const sortedmostlikedPosts = useMemo(() => {
        if (!posts || posts.length === 0) return []
        return [...posts].sort((a, b) => b.likes.Totalike - a.likes.Totallike)
    }, [posts])



    return (
        <>
            <div className="bg-[#E5E7EB] min-h-screen flex flex-col md:flex-row">
                <Navbar/>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                                        <button className="px-4 py-2 border border-neutral-200/20 rounded-lg hover:bg-gray-50 transition-colors">
                                            Share Profile
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-6 mb-4">
                                    <div className="text-center">
                                        <p className="font-bold">245</p>
                                        <p className="text-gray-500">Posts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">15.3k</p>
                                        <p className="text-gray-500">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">284</p>
                                        <p className="text-gray-500">Suggested</p>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="w-full max-w-full overflow-hidden">
                                    <p className={`text-sm text-gray-700 whitespace-pre-wrap break-all transition-all duration-200 ${showFullBio ? "" : "line-clamp-3"}`}>
                                        {authUser.bio}
                                    </p>
                                    {authUser.bio.length > 100 && (
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
                    <div x-data="{ activeTab: 'posts' }" className="bg-white rounded-lg border border-neutral-200/20">
                        {/* <!-- Tab Navigation --> */}
                        <div className="flex border-b border-neutral-200/20">
                            <button className={`flex-1 py-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-black' : ''}`} onClick={() => showContent('posts')} >Posts</button>
                            <button className={`flex-1 py-4 font-medium ${activeTab === 'mostliked' ? 'border-b-2 border-black' : ''}`} onClick={() => showContent('mostliked')}>Most liked</button>
                            <button className={`flex-1 py-4 font-medium ${activeTab === 'suggested' ? 'border-b-2 border-black' : ''}`} onClick={() => showContent('suggested')}>suggested</button>
                        </div>

                        {/* // <!-- Posts Grid --> */}
                        <div className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* <!-- Post Items --> */}
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>
                        {activeTab === 'posts' && (
                            <div className="p-4">
                                {posts.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {posts.map((post, index) => (
                                            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={post.image}
                                                    alt="Post"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>❤️</span>
                                                    <span>{post.totalLikes || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* <!-- mostliked Posts --> */}
                        <div x-show="activeTab === 'mostliked'" className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* <!-- mostliked Post Items --> */}
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                                <div className="aspect-square bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>
                        {activeTab === 'mostliked' && (
                            <div className="p-4">
                                {sortedmostlikedPosts.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {sortedmostlikedPosts.map((post) => (
                                            <div
                                                key={post._id}
                                                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={post.image}
                                                    alt="mostliked Post"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                    <span>❤️</span>
                                                    <span>{post.likes.totallike || 0}</span>
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
                                        <div key={index} className="flex items-center space-x-4 p-4 border border-neutral-200/20 rounded-lg">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300">
                                                <img src={user.profilepic} alt={user.username} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{user.username}</h3>
                                                <p className="text-sm text-gray-500">{user.arttype}</p>
                                                <button className="mt-2 px-4 py-1 text-sm bg-black text-white rounded-full hover:bg-gray-900">
                                                    Follow
                                                </button>
                                            </div>
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