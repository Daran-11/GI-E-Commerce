import { Box, Button, Modal, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

function ConfirmDeliveryButton({ orderId, userId, productId }) {
  const [open, setOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowRating(false);
  };

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

        setShowRating(true); // Show rating form after confirmation
        toast.success("ขอบคุณที่ใช้บริการ อย่าลืมให้คะแนนสินค้าของเรา")
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast.error('ไม่สามารถยืนยันการได้รับสินค้าได้');
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(`/api/rating-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, rating, review }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('ขอบคุณสำหรับการรีวิวของท่าน!');
        //handleClose();
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('ไม่สามารถส่งรีวิวได้');
    }
  };

  return (
    <>
      <button
        className='w-fit px-4 py-2 text-white bg-[#4eac14] hover:bg-[#316b0c] rounded-xl'
        onClick={handleOpen}
      >
        ยืนยันการได้รับสินค้า
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <>
            <Typography variant="h6" component="h2">
              ยืนยันการได้รับสินค้า
            </Typography>
            <Typography sx={{ mt: 2 }}>
              ท่านยืนยันว่าได้รับสินค้าแล้วใช้หรือไม่?
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="contained" color="primary" onClick={handleConfirmDelivery}>
                ยืนยัน
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
            </Box>
          </>
        </Box>
      </Modal>
    </>
  );
}

export default ConfirmDeliveryButton;
