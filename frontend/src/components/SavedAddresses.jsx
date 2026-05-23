import React, { useState } from 'react';
import { useShopContext } from '../context/ShopContext';
import { makeApiRequest } from '../utils/apiService';
import { toast } from 'sonner';

const SavedAddresses = () => {
  const { userData, setUserData } = useShopContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "", city: "",
    state: "", zipCode: "", country: "", phone: ""
  });

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setFormData(address);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentAddress(null);
    setFormData({
      firstName: "", lastName: "", email: "", street: "", city: "",
      state: "", zipCode: "", country: "", phone: ""
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await makeApiRequest(`/api/user/address/${id}`, "DELETE");
      if (res.success) {
        toast.success("Address deleted");
        setUserData({ ...userData, addresses: res.data });
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (currentAddress) {
        res = await makeApiRequest(`/api/user/address/${currentAddress._id}`, "PUT", formData);
      } else {
        res = await makeApiRequest(`/api/user/address`, "POST", formData);
      }
      
      if (res.success) {
        toast.success(currentAddress ? "Address updated" : "Address added");
        setUserData({ ...userData, addresses: res.data });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addresses = userData?.addresses || [];

  return (
    <div className="flex flex-col gap-6 p-8 border border-gray-200 rounded-xl shadow-sm bg-white mt-8 mb-2">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
        {!isEditing && (
          <button onClick={handleAddNew} className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
            Add New Address
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          </div>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          <input name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
            <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
            <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          </div>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="border border-gray-300 p-2.5 rounded-md focus:ring-1 focus:ring-black outline-none" required />
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border rounded hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-black text-white rounded hover:bg-gray-800 transition-colors">Save Address</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500 italic py-4">No saved addresses found. Add one for faster checkout!</p>
          ) : (
            addresses.map(addr => (
              <div key={addr._id} className="border border-gray-200 rounded-lg p-5 flex flex-col gap-1 bg-gray-50/50 hover:shadow-sm transition-shadow">
                <p className="font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-sm text-gray-600">{addr.country}</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">📞 {addr.phone}</p>
                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-200 text-sm font-medium">
                  <button onClick={() => handleEdit(addr)} className="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(addr._id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
