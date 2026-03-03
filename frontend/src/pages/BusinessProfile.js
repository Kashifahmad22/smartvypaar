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
    return (
      <div className="text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Business Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Manage your shop and business information.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="sv-card">

        {!isEditing ? (
          <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">

              <DetailRow label="Shop Name" value={profile.shopName} />
              <DetailRow label="Owner Name" value={profile.ownerName} />
              <DetailRow label="Phone Number" value={profile.phoneNumber} />
              <DetailRow label="GST Number" value={profile.gstNumber} />
              <DetailRow label="Shop Address" value={profile.shopAddress} />
              <DetailRow label="Business Type" value={profile.businessType} />

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="sv-btn-primary"
              >
                Edit Details
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

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

              <div className="sm:col-span-2">
                <InputField
                  label="Shop Address"
                  value={formData.shopAddress || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shopAddress: e.target.value })
                  }
                />
              </div>

            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
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
                className="sv-btn-primary"
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

/* ---------------- UI COMPONENTS ---------------- */

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="font-medium mt-1 sm:mt-0">
        {value || "Not Added"}
      </span>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        className="sv-input"
      />
    </div>
  );
}

export default BusinessProfile;