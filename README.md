## My log สิ่งที่ต้องทำ
(ยังไม่รวมเรื่อง style / tailwind และระบบจัดการหลังบ้าน)
 - [x] ทำ หน้าดูคำสั่งซื้อ ของ ผู้ใช้
 - [x] ทำให้ cart สามารถเลือกสินค้าหลายชินเพื่อชำระสินค้าได้
 - [x] เพิ่ม Field สำหรับเก็บ รูป ของ Product ใน Schema Prisma
 - [x] ทำ Review rating ในหน้า รายละเอียดสินค้า
 - [x] ทำ หน้าแยก สำหรับ ปรับเปลี่ยน ทีอยู่ จัดส่ง
 - [ ] ปุ่มเพิ่มลดจำนวนสินค้ายังบัคอยู่
 - [x] หน้า Checkout ต้องเช็คก่อนว่า user ได้เลือกที่อยู่จัดสี่งหรือยัง ก่อน กด สั่งซื้อ
 - [x] แก้ปัญหา ใน Product ลบข้อมูลสินค้าไม่ได้เนื่องจาก database server ป้องกันการลบข้อมูลที่มีการ Reference ที่อื่นอยู่ด้วย โดยเปลี่ยนเป็นการทำ soft deletion ใช้การใส่ Isdeleted 
 - [x] ปรับโครงสร้าง Order tabe and OrderItems table
 - [x] Omise payment gateway การโอนเข้าไปในระบบ (พักเงินไว้ที่แพลตฟอร์ม)
 - [ ] Omise payment gateway ทำระบบการโอนเงินให้ผู้ขายหลังการส่งสำเร็จ (สถานะการส่ง ขึ้นสถานะ  "Delivered")
 - [X] ใส่ field Cost เก็บข้อมูลราคาทุน ใน Product table สำหรับทำวิเคราะห์รายได้
 - [X] ใส่ช่อง input สำหรับใสราคาทุน(Cost)ในหน้าสร้างสินค้า ใน Dashboard ของผู้ขาย

 - [ ] ปรับ table certificate และ farmer ให้ตรงกับของสรัล
 - [ ] Farmer Product Filter & search bar & pagination
 - [ ] Farmer Order Filter & search bar & pagination
 - [ ] เชื่อมข้อมูลหน้า Dashboard 
 - [ ] ทำให้ใส่รูปสินค้าหลายรูปได้
 - [ ] ทำหน้าดูคำสั่งซื้อของลูกค้าให้ครบตามสถานะสินค้า การโชว์รายละเอียดสำคัญต่างๆ (Preparing, ShippedOutForDelivery, DeliveredCanceled, Returned, FailedDelivery, AwaitingPickup, RefundProcessed)
 - [ ] ช่องทางการขอ Refund ?
 - [ ] หน้าไว้ดูออเดอร์ของผู้ขาย (ระบบจัดการออเดอร์ )
 - [ ] หน้าประวัติสินค้าที่เคยวางขาย
 - [ ] Filter สินค้าในหน้าหลัก(Filter ราคา, ใหม่สุด เก่าสุด ,ขายดีที่สุด)
 - [ ] ทำ Component ดาวสำหรับรีวิว
 - [ ] ใส่ดาว Review (คะแนนเฉลี่ย) ไว้ที่ Product Card หน้าหลัก 
 - [ ] ใส่ดาว Review (คะแนนเฉลี่ย) ไว้ที่หน้ารายละเอียดสินค้า
 - [ ] UI ส่วน Review ข้างล่างหน้ารายละเอียดสินค้า
 - [ ] UI หน้า Checkout
 - [ ] UI หน้า Confirmed-Order
 - [ ] UI หน้า Account/Profile
 - [ ] UI หน้า Account/Mypurchases
 - [ ] UI หน้า Account/Addresses
 - [ ] Admin หน้าเพิ่ม Role ดูการ Transactions ล่าสุดจากทุกคน
 - [ ] Admin แจ้งข่าวสารเว็บ สามารถเปลี่ยนslider รูป ที่หน้าหลักได้
 - [ ] ทำหน้ารายงานปัญหา 
 - [ ] แถบแจ้งเตือน ? สำหรับแจ้งเตือนการส่งสินค้า และเกี่ยวกับเว็บไซต์



 