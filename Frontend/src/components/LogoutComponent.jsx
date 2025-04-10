import React from 'react';
import { axiosInstance } from '../lib/axios';

const LogoutComponent = () => {

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex justify-end p-4">
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutComponent;
