import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { signInSuccess } from "../redux/user/UserSlice";

const Profile = () => {
  const user = useSelector((state) => state.user?.currentUser?.data);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setPreview(user.profilePicture || "/default-avatar.png");
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("User data is not available. Please log in again.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("userId", user._id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);

    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }

    if (file) formDataToSend.append("image", file);

    try {
      const res = await axios.put(
        "http://localhost:3000/api/user/update",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("update successful ✅");
        setPreview(res.data.user.profilePicture);

        dispatch(
          signInSuccess({
            ...user,
            ...res.data.user,
            profilePicture: res.data.user.profilePicture,
          })
        );

        setFormData({
          ...formData,
          password: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "failed to update: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }

      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">
            Please log in to view your profile.
          </p>
          <a
            href="/sign-in"
            className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:opacity-80 inline-block"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center">
          <img
            onClick={() => fileRef.current.click()}
            src={preview || "/default-avatar.png"}
            alt="profile"
            className="h-24 w-24 cursor-pointer rounded-lg self-center object-cover"
          />
          <span className="text-sm text-gray-500 mt-1">
            Click the image to change profile picture
          </span>
        </div>

        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-slate-100 rounded-lg p-3"
          required
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="bg-slate-100 rounded-lg p-3"
          required
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="new password"
          className="bg-slate-100 rounded-lg p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          {loading ? " loading..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer hover:text-red-900">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:text-red-900">
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
