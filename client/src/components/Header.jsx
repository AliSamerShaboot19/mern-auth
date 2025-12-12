import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl">
        <Link to="/">
          <h1 className="font-bold">Auth App</h1>
        </Link>
        <ul className="flex gap-4">
          <li>Home</li>
          <li>About</li>
          <li>Sign In</li>
        </ul>
      </div>
    </div>
  );
};
export default Header;
