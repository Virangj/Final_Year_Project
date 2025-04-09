import { useState } from "react";
import toast from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

export default function PersonalInfo() {
  const { userUpdate } = useAuthStore();
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    NProgress.start();
    setLoading(true);
    if (!dob || !phone || !country || !city || !gender) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      NProgress.done();
      return;
    }
    try {
      const res = await axiosInstance.patch("/update/personalinfo", { dob, phone, country, city, gender });
      userUpdate("dob", dob);
      userUpdate("phone", phone);
      userUpdate("country", country);
      userUpdate("city", city);
      userUpdate("gender", gender);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Failed");
    }
    setDob("")
    setCity("")
    setCountry("")
    setGender("")
    setPhone("")
    setLoading(false);
    NProgress.done();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700 block mb-1">Gender</label>
          <div className="flex items-center space-x-6">
            {["male", "female", "other"].map((option) => (
              <label key={option} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={() => setGender(option)}
                  className="h-4 w-4 text-black focus:ring-black"
                />
                <span className="text-sm capitalize text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`rounded-md bg-black px-4 py-2 mt-4 text-sm font-medium text-white transition hover:opacity-90 ${loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
