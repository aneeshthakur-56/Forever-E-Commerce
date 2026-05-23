import React, { useState, useEffect } from 'react';
import { useShopContext } from '../context/ShopContext';
import { makeApiRequest } from '../utils/apiService';
import { toast } from 'sonner';
import SavedAddresses from '../components/SavedAddresses';

const Profile = () => {
  const { isAuth, navigate, userData, setUserData, isLoading: contextLoading } = useShopContext();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!contextLoading && !isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate, contextLoading]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setPreviewUrl(userData.profilePicture || "");
    }
  }, [userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }

      const res = await makeApiRequest("/api/user/profile", "PUT", formData, {
        "Content-Type": "multipart/form-data"
      });

      if (res.success) {
        toast.success("Profile updated successfully");
        setUserData({ ...userData, ...res.data });
        setPreviewUrl(res.data.profilePicture || previewUrl);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (contextLoading || !userData) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-6 border-t">
      <div className="flex flex-col gap-6 p-8 border border-gray-200 rounded-xl shadow-sm bg-white">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">My Profile</h2>
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-8">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <label htmlFor="profileImage" className="cursor-pointer relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md flex items-center justify-center bg-gray-50">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                ) : (
                  <div className="text-4xl text-gray-400 font-bold uppercase">{name?.charAt(0) || "U"}</div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
            </label>
            <input 
              type="file" 
              id="profileImage" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">Click picture to upload a new one</p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={userData.email || ""} 
                readOnly
                disabled
                className="border border-gray-200 bg-gray-50 text-gray-500 rounded-md px-4 py-2 cursor-not-allowed"
                title="Email address cannot be changed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isUpdating}
              className="bg-black text-white px-8 py-3 rounded-md font-medium shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

      <SavedAddresses />

    </div>
  );
};

export default Profile;
