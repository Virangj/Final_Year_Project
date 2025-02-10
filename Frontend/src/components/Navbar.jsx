import React from 'react'

const Navbar = () => {
  return (
    <nav className="sticky top-0 h-screen w-64 bg-white border-r border-neutral-200/20 hidden lg:block">
            <div className="flex flex-col h-full">
                {/* <!-- Logo --> */}
                <div className="p-6 border-b border-neutral-200/20">
                    <h1 className="text-2xl font-bold">Creative Threads</h1>
                </div>

                {/* <!-- Navigation Links --> */}
                <div className="flex-1 py-6">
                    <a href="#feed" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all active">
                        <span>Feed</span>
                    </a>
                    <a href="#explore" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all">
                        <span>Explore</span>
                    </a>
                    <a href="#profile" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all">
                        <span>Profile</span>
                    </a>
                    <a href="#chat" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all">
                        <span>Chat</span>
                    </a>
                    <a href="#notifications" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all">
                        <span>Notifications</span>
                    </a>
                    <a href="#settings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all">
                        <span>Settings</span>
                    </a>
                </div>

                {/* <!-- User Profile Section --> */}
                <div className="p-6 border-t border-neutral-200/20">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">john@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
  )
}

export default Navbar
