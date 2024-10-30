import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Rating } from "react-simple-star-rating";

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
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      alert('ไม่สามารถยืนยันการได้รับสินค้าได้');
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
        alert('ขอบคุณสำหรับการรีวิวของคุณ!');
        //handleClose();
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('ไม่สามารถส่งรีวิวได้');
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
          {!showRating ? (
            <>
              <Typography variant="h6" component="h2">
                Confirm Delivery
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure you received the product?
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleConfirmDelivery}>
                  Confirm
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" component="h2">
                Rate Your Product
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Rating
                  onClick={setRating}
                  ratingValue={rating}
                  size={25}
                  label
                  transition
                  fillColor="orange"
                  emptyColor="gray"
                  allowHover={true}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Review (optional)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="contained" color="primary" onClick={handleRatingSubmit}>
                    Submit Review
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ConfirmDeliveryButton;
