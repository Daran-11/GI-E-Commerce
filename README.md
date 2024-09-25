
  

##  My log สิ่งที่ต้องทำ

  
  

-  [x] ทำ หน้าดูคำสั่งซื้อ ของ ผู้ใช้

  

-  [x] ทำให้ cart สามารถเลือกสินค้าหลายชินเพื่อชำระสินค้าได้

  

-  [x] เพิ่ม Field สำหรับเก็บ รูป ของ Product ใน Schema Prisma

  

-  [x] ทำ Review rating ในหน้า รายละเอียดสินค้า

  

-  [x] ทำ หน้าแยก สำหรับ ปรับเปลี่ยน ทีอยู่ จัดส่ง

  

- [ ] ปุ่มเพิ่มลดจำนวนสินค้ายังบัคอยู่

  

-  [x] หน้า Checkout ต้องเช็คก่อนว่า user ได้เลือกที่อยู่จัดสี่งหรือยัง ก่อน กด สั่งซื้อ

  

-  [x] แก้ปัญหา ใน Product ลบข้อมูลสินค้าไม่ได้เนื่องจาก database server ป้องกันการลบข้อมูลที่มีการ Reference ที่อื่นอยู่ด้วย โดยเปลี่ยนเป็นการทำ soft deletion ใช้การใส่ Isdeleted

  

-  [x] ปรับโครงสร้าง Order tabe and OrderItems table

  

-  [x] Omise payment gateway การโอนเข้าไปในระบบ (พักเงินไว้ที่แพลตฟอร์ม)

  

-  [X] ใส่ field Cost เก็บข้อมูลราคาทุน ใน Product table สำหรับทำวิเคราะห์รายได้

  

-  [X] ใส่ช่อง input สำหรับใสราคาทุน(Cost)ในหน้าสร้างสินค้า ใน Dashboard ของผู้ขาย

  
***
**OMISE**

- [ ] Omise payment gateway ทำระบบการโอนเงินให้ผู้ขายหลังการส่งสำเร็จ(สถานะการส่ง ขึ้นสถานะ "Delivered")

- [ ] Omise สร้าง recipient เพื่อเก็บข้อมูลบัญชีธนาคารของผู้ขาย(Farmer) เก็บ recipientId ที่ omise สร้างมาให้

- [ ] Omise ทำ await omise.transfers.create เพื่อใช้ในการtransfer เงินที่อยู่ใน Omise ไปยัง ผู้ขาย โดยใช้ recipientId ที่เก็บไว้ใน database
***
- [ ] Analytic Dashboard แดชบอร์ดวิเคราะห์

- [ ] ปรับ table certificate และ farmer ให้ตรงกับของสรัล

-  [x] Farmer Product Filter & search bar & pagination

- [ ] Farmer Order Filter & search bar & pagination

-  [x] ทำให้ใส่รูปสินค้าหลายรูปได้

- [ ] ช่องทางการขอ Refund ?

- [ ] หน้าไว้ดูออเดอร์ของผู้ขาย (ระบบจัดการออเดอร์ )

- [ ] หน้าประวัติสินค้าที่เคยวางขาย

- [ ] ช่องทางรายงานปัญหา?

- [ ] แถบแจ้งเตือน ? สำหรับแจ้งเตือนการส่งสินค้า และเกี่ยวกับเว็บไซต์

-  [x] Filter สินค้าในหน้าหลัก(Filter ราคา, ใหม่สุด เก่าสุด ,ขายดีที่สุด)

-  [x] ทำ Component ดาวสำหรับรีวิว

-  [x] ใส่ดาว Review (คะแนนเฉลี่ย) ไว้ที่ Product Card หน้าหลัก

-  [x] ใส่ดาว Review (คะแนนเฉลี่ย) ไว้ที่หน้ารายละเอียดสินค้า

-  [x] UI ส่วน Review ข้างล่างหน้ารายละเอียดสินค้า

-  [x] UI หน้า Checkout

-  [x] UI หน้า Confirmed-Order
***
- หน้า Account
	- [ ] Profile

	- [x] My Purchases

	- [ ] Addresses
***
- Main page
	
	-  [x] ทำหน้าดูคำสั่งซื้อของลูกค้าให้ครบตามสถานะสินค้า การโชว์รายละเอียดสำคัญต่างๆ (Preparing, ShippedOutForDelivery, DeliveredCanceled, Returned, FailedDelivery, AwaitingPickup, RefundProcessed)

  
****
- Admin

	- [ ] Role management

	- [ ] ช่องทางแจ้งข่าวสารเว็บ สามารถเปลี่ยนslider รูป ที่หน้าหลักได้