import React, { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import authContext from "../context/auth/authContext";
import credContext from "../context/credential/credContext";

const Navbar = () => {
  const { allCredential } = useContext(credContext);
  const { handleLogout } = useContext(authContext);

  const username = allCredential?.masterUser || "User";

  return (
    <nav className="flex justify-between items-center inset-ring inset-ring-zinc-200 bg-zinc-50 py-2.5 w-[95%] sm:w-2/3 mx-auto px-4 rounded-full shadow-xs">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Hi,</span>
        <span className="font-semibold text-gray-900">{username}</span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-red-50"
        title="Log out of your account"
        aria-label="Logout"
      >
        <span className="text-xs font-medium hidden sm:inline">Logout</span>
        <FiLogOut className="text-base" />
      </button>
    </nav>
  );
};

export default Navbar;
