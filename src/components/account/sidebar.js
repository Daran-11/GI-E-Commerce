'use client'

// components/Sidebar.js
import Link from 'next/link';
import { useState } from 'react';


const Sidebar = ({ isOpen, toggleDrawer }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
<div>
<aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen text-black transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >
        <div className='h-full px-3 py-4 overflow-y-auto bg-white'>
          <div className="p-4 flex justify-between lg:hidden">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleDrawer} className="text-black">
              Close
            </button>
          </div>
            <ul className="p-4">
              <li className="mb-2">
                <button
                  className="flex justify-between w-full text-left"
                  onClick={toggleSubMenu}
                >
                  จัดการบัญชี
                </button>
                {isSubMenuOpen && (
                  <ul className="ml-4 mt-2">
                    <li className="mb-2">
                      <Link href="/account/user/profile">ข้อมูลของฉัน</Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/account/user/addresses">ทีอยู่</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="mb-2">
                <Link href="/account/user/purchases">การสั่งซื้อ</Link>
              </li>
            </ul>            
        </div>

    </aside>        

</div>

  );
};

export default Sidebar;
