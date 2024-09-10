export const syncCartWithServer = async (session) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  for (const item of cart) {
    await fetch("/api/auth/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
  }

  // Clear local storage cart after syncing
  localStorage.removeItem("cart");
};
