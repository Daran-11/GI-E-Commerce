// components/Breadcrumb.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter((segment) => segment);

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <div className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </div>
        </li>

        {pathArray.map((segment, index) => {
          const href = "/" + pathArray.slice(0, index + 1).join("/");
          const isLast = index === pathArray.length - 1;
          
          return (
            <li key={index}>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mx-1 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L11.586 9 7.293 4.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {!isLast ? (
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-gray-700 capitalize"
                  >
                    {decodeURIComponent(segment)}
                  </Link>
                ) : (
                  <span className="text-gray-700 capitalize">
                    {decodeURIComponent(segment)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
