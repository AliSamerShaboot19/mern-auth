import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/UserSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      if (!result.user) {
        throw new Error("Faild to fetch user");
      }

      const userData = {
        name: result.user.displayName || "",
        email: result.user.email || "",
        photo: result.user.photoURL || "",
      };

      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error(`Error : ${res.status}`);
      }
      navigate("/");
      const data = await res.json();
      dispatch(signInSuccess(data));
    } catch (error) {
      console.error("Error in login", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-80 cursor-pointer"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
