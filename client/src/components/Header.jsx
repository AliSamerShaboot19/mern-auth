import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const currentUser = useSelector((state) => state.user?.currentUser?.data);

  return (
    <div className="bg-slate-200 p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h1 className="font-bold text-2xl text-slate-800">Auth App</h1>
        </Link>
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className="text-slate-700 hover:text-slate-900 font-medium hover:underline transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-slate-700 hover:text-slate-900 font-medium hover:underline transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.profilePicture || "/default-avatar.png"}
                  alt="profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Header;
