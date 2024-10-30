// components/Navbar.js
"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Notification from "../notification/notification"; // Import the Notification component

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md h-[60px] flex items-center justify-between px-6 z-50">
      <h1 className="font-bold text-xl">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Notification />
        <div className="flex items-center space-x-2">
          {session ? (
            <>
              <Image
                className="rounded-full object-cover"
                src="/dinosaur.png" // Adjust to the path of the user profile image
                alt="User Avatar"
                width={50}
                height={50}
              />
              <div>
                <span className="text-gray-700 font-medium">{session.user.name}</span>
                <span className="text-[var(--textSoft)] text-base block mt-1">{session.user.role}</span>
              </div>
            </>
          ) : (
            <span className="text-gray-700 font-medium">Guest</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
