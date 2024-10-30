import { useState, useRef, useEffect } from "react";
import { IoIosNotificationsOutline, IoIosNotifications } from "react-icons/io";
import { useRouter } from "next/navigation";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [newOrderIds, setNewOrderIds] = useState([]);
  const drawerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const router = useRouter();

  // Function to fetch new orders
  const fetchNewOrders = async () => {
    try {
      const lastFetchTime = localStorage.getItem("lastFetchTime") || new Date().toISOString();
      const response = await fetch(`/api/orders?lastFetchTime=${lastFetchTime}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const existingIds = JSON.parse(localStorage.getItem("newOrderIds")) || [];
      const newIds = data.map(order => order.id).filter(id => !existingIds.includes(id));

      if (newIds.length > 0) {
        const combinedIds = [...existingIds, ...newIds];
        setNewOrderIds(combinedIds);
        setNewOrderCount(newIds.length);
        localStorage.setItem("newOrderIds", JSON.stringify(combinedIds));
        localStorage.setItem("newOrderCount", newIds.length);
      }

      localStorage.setItem("lastFetchTime", new Date().toISOString());
    } catch (error) {
      console.error("Failed to fetch new orders:", error);
    }
  };

  useEffect(() => {
    // Load notifications from local storage on mount
    const storedCount = parseInt(localStorage.getItem("newOrderCount"), 10) || 0;
    const storedOrderIds = JSON.parse(localStorage.getItem("newOrderIds")) || [];
    setNewOrderCount(storedCount);
    setNewOrderIds(storedOrderIds);

    // Poll for new orders if the user is logged in
    const isLoggedIn = true; // Replace with your authentication check
    if (isLoggedIn) {
      pollingIntervalRef.current = setInterval(fetchNewOrders, 10000); // Fetch every 10 seconds
    }

    return () => {
      clearInterval(pollingIntervalRef.current); // Cleanup on unmount
    };
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setNewOrderCount(0); // Reset count when opening
      localStorage.setItem("newOrderCount", 0); // Reset count in local storage
    }
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsOpen(false);
      setNewOrderCount(0);
      localStorage.setItem("newOrderCount", 0); // Reset count on close
    }
  };

  const deleteAllNotifications = () => {
    setNewOrderIds([]);
    localStorage.removeItem("newOrderIds"); // Clear all notifications from local storage
  };

  const deleteNotification = (id) => {
    const updatedIds = newOrderIds.filter(orderId => orderId !== id);
    setNewOrderIds(updatedIds); // Update state
    localStorage.setItem("newOrderIds", JSON.stringify(updatedIds)); // Update local storage
  };

  return (
    <div className="flex items-center relative">
      <button onClick={toggleDrawer} className="relative">
        {newOrderCount > 0 ? (
          <IoIosNotifications className="text-red-600 text-2xl" />
        ) : (
          <IoIosNotificationsOutline className="text-gray-600 text-2xl" />
        )}
        {newOrderCount > 0 && !isOpen && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
            {newOrderCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          <div className="fixed inset-0 bg-black opacity-30" onClick={handleClickOutside}></div>
          <div
            ref={drawerRef}
            className="bg-gray-600 text-white shadow-lg w-80 h-full p-4 transition-transform transform translate-x-0 z-10"
          >
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button onClick={deleteAllNotifications} className="text-red-500 mt-2">
              Clear All Notifications
            </button>
            <ul className="mt-4">
              {newOrderIds.length > 0 ? (
                newOrderIds.map((id) => (
                  <li key={id} className="p-2 border-b border-gray-700 flex justify-between items-center">
                    <span>New Incoming Order ID: {id}</span>
                    <button onClick={() => deleteNotification(id)} className="text-red-500">
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <li className="p-2">No new incoming orders</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
