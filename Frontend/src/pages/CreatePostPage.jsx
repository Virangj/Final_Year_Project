import React, { useState } from 'react';
import Navbar from '../components/NavbarComponent';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import ImagePreviewSlider from '../components/PreviewComponent';

const CreatePost = () => {
    const [files, setFiles] = useState([]);
    const [previews, setpreviews] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authUser } = useAuthStore()
    const navigate = useNavigate()

    const handleimagesChange = (e) => {
        const files = Array.from(e.target.files);
        setFiles(files);

        const imagespreviews = files.map((file) => URL.createObjectURL(file));
        setpreviews(imagespreviews);
    };

    const handlePostSubmit = async () => {
        setIsSubmitting(true);
        NProgress.start();
        if (!files || !title || !description) {
            toast.error('Please fill in all fields and upload an images.');
            NProgress.done()
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        // formData.append("profilepic", authUser.profilePic);
        formData.append("username", authUser._id);
        formData.append("arttype", authUser.arttype);
        files.forEach((img) => formData.append('files', img)); // 'images' matches field name in multer
        formData.append("role", authUser.role)        

        try {
            await axiosInstance.post(`/posts/addpost`, formData);
            console.log('Post created!');
            navigate("/profile")
        } catch (err) {
            console.error('Error creating post:', err);
            if (err.response.data.message) {
                toast.error(err.response.data.message)
            }
        }
        NProgress.done()
        setIsSubmitting(false);
    };

    return (
        <div className="bg-black min-h-screen flex flex-col md:flex-row">
            <Navbar />
            <div className="w-[80%] mx-auto px-4 py-6">
                {/* Create Post Section */}
                <div className="bg-white rounded-lg border border-neutral-200/20 mb-6">
                    <div className="p-6 border-b border-neutral-200/20">
                        <h2 className="text-2xl font-bold">Create Post</h2>
                    </div>
                    <div className="p-6">
                        {/* Title Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Post Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 bg-white  focus:border-black focus:outline-none rounded-lg  "
                                placeholder="Give your artwork a title"
                            />
                        </div>

                        {/* Upload Area */}
                        <div className="mb-6">
                            <div className="border-2 border-dashed border-neutral-200/20 rounded-lg p-8">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-500">Drag and drop your artwork here, or click to browse</p>
                                    <p className="mt-1 mb-4 text-xs text-gray-400">Supports: JPG, PNG, GIF, MP4 (Max 10MB)</p>
                                    <label className="relative cursor-pointer text-sm bg-black border px-4 py-2 text-white rounded-lg hover:bg-gray-900 transition">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="images/*"
                                            multiple
                                            onChange={handleimagesChange}
                                            className="absolute opacity-0 left-0 top-0 w-full h-full cursor-pointer"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2  scrollbar-none   rounded-lg border border-gray-300 bg-white  focus:border-black focus:outline-none"
                                rows="4"
                                placeholder="Tell the story behind your artwork"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            {/* <button className="px-6 py-2 border border-neutral-200/20 rounded-lg hover:bg-gray-50">Save Draft</button> */}
                            <button
                                onClick={handlePostSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-black text-white rounded-lg  transition ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-800"
                                    }`}
                            >
                                Publish Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* previews Section */}
                <div className="bg-white rounded-lg border border-neutral-200/20 ">
                    <ImagePreviewSlider previews={previews} title={title} description={description} />
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
