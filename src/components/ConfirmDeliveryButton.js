
function ConfirmDeliveryButton({ orderId, userId }) {
  const handleConfirmDelivery = async () => {
    try {
      const response = await fetch(`/api/orders/confirm-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, userId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('ยืนยันการได้รับสินค้าเสร็จสิ้น!');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      alert('ไม่สามารถยืนยันการได้รับสินค้าได้');
    }
  };

  return (
    <button
      className='w-fit px-4 py-2 text-white bg-[#4eac14] hover:bg-[#316b0c] rounded-xl'
      onClick={handleConfirmDelivery}
    >
      ยืนยันการได้รับสินค้า
    </button>
  );
}

export default ConfirmDeliveryButton;
