import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

function BusinessProfile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <h1 className="text-4xl font-bold text-white">
        Business Profile
      </h1>

      <div className="bg-[#111827] border border-gray-700 p-8 rounded-3xl shadow-xl">

        {!isEditing ? (
          <>
            <DetailRow label="Shop Name" value={profile.shopName} />
            <DetailRow label="Owner Name" value={profile.ownerName} />
            <DetailRow label="Phone Number" value={profile.phoneNumber} />
            <DetailRow label="GST Number" value={profile.gstNumber} />
            <DetailRow label="Shop Address" value={profile.shopAddress} />
            <DetailRow label="Business Type" value={profile.businessType} />

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
              >
                Edit Details
              </button>
            </div>
          </>
        ) : (
          <>
            <InputField
              label="Shop Name"
              value={formData.shopName || ""}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
            />

            <InputField
              label="Owner Name"
              value={formData.ownerName || ""}
              onChange={(e) =>
                setFormData({ ...formData, ownerName: e.target.value })
              }
            />

            <InputField
              label="Phone Number"
              value={formData.phoneNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />

            <InputField
              label="GST Number"
              value={formData.gstNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, gstNumber: e.target.value })
              }
            />

            <InputField
              label="Shop Address"
              value={formData.shopAddress || ""}
              onChange={(e) =>
                setFormData({ ...formData, shopAddress: e.target.value })
              }
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await updateProfile(formData);
                    setProfile(res.data.user);
                    setIsEditing(false);
                  } catch (err) {
                    console.error("Update error:", err);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-700">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">
        {value || "Not Added"}
      </span>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-400 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}

export default BusinessProfile;