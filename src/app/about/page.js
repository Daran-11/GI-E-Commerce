
import Image from 'next/image';
import styles from './page.module.css';

const teamMembers = [
  {
    name: 'นายดรัณภพ สมุทรเก่า',
    nameEng: 'Daranphop Samutkao',
    role: ['UX&UI design' , 'Frontend development' , 'Backend development' , 'Documentations'],
    year: 'ชั้นปีที่ 4'
  },
  {
    name: 'นายธนธร เต็มสิริมงคล',
    nameEng: 'Tanatorn Termsirimongkol',
    role: ['Backend development' , 'Documentations' , 'Research'],
    year: 'ชั้นปีที่ 4'
  },

  {
    name: 'นายธนภัทร กันจินะ ',
    nameEng: 'Thanapat Kanjina',
    role: ['Testing' , 'Documentations' , 'Research'],
    year: 'ชั้นปีที่ 4'
  },

  {
    name: 'นายณัฐพงศ์ แววศรี ',
    nameEng: 'Natthaphong Waewsri',
    role: ['Frontend development' , 'Documentations' , 'Testing' , 'Research'],
    year: 'ชั้นปีที่ 4'
  },

  {
    name: 'นายสรัล ปรีชากรรม  ',
    nameEng: 'Saran Preechakarm',
    role: ['Frontend development' , 'Backend development' , 'Research'],
    year: 'ชั้นปีที่ 4'
  },
  // เพิ่มสมาชิกทีมอื่น ๆ ที่นี่
];

export default function page() {
  return (
    <div className="ml-auto mr-auto mt-[150px] max-w-[65%] flex justify-center ">


    <div className="space-y-10 "> 
    <div className=' w-full h-[500px] p-6 rounded-xl flex justify-center items-center'>
      <div className=' w-[500px] text-xl text-center text-gray-600  animate-slideFadeIn'>
      &quot;GI Pineapple E-commerce ก่อตั้งขึ้นด้วยความตั้งใจที่จะสนับสนุนเกษตรกรท้องถิ่น 
      พร้อมส่งมอบสับปะรดคุณภาพสูงจากสวนถึงมือคุณ ด้วยการรับรองมาตรฐาน GI 
      ที่สะท้อนถึงเอกลักษณ์และความภูมิใจของไทย 
      เราเชื่อมั่นว่าการสนับสนุนเกษตรกรคือการสร้างความยั่งยืนให้กับชุมชนในระยะยาว&quot;
      </div>


      </div>
      <div className='w-full h-[600px] space-x-14 flex items-center justify-end'>
        <div className='flex justify-start w-max'>
                <Image
                    src="/uploads/GI.png" // เส้นทางของไฟล์ในโฟลเดอร์ public
                    alt="ตัวอย่างรูปภาพ"
                
                    width={400}
                    height={400}
                    className="  w-[400px] h-full max-h-[400px] md:max-h-[400px] object-contain object-center  rounded-xl "
                />           
        </div>
         
    
   

          <div className='w-fit lg:w-[600px]'>
                          <h1 className="text-2xl mb-2 text-gray-700"> สิ่งบ่งชี้ทางภูมิศาสตร์ (GI)</h1>
                          <p className="text-lg text-gray-600 animate-slideFadeInRight"  style={{ animationDelay: '1s' }}>
                                คือเครื่องหมายที่ใช้กับสินค้าที่มาจากแหล่งผลิตที่เฉพาะเจาะจง ซึ่งคุณภาพหรือชื่อเสียงของสินค้านั้นๆ เป็นผลมาจากการผลิตในพื้นที่ดังกล่าว GI 
                                จึงเปรียบเสมือนเป็นแบรนด์ของท้องถิ่นที่บ่งบอกถึงคุณภาพและแหล่งที่มาของสินค้า ตราสัญลักษณ์สิ่งบ่งชี้ทางภูมิศาสตร์ (GI) 
                                ไทย คือ ตราของกรมทรัพย์สินทางปัญญาที่ออกให้แก่ผู้ผลิตสินค้าเพื่อรับรองว่าเป็นสินค้าที่มาจากแหล่งภูมิศาสตร์ที่ได้รับขึ้นทะเบียนไว้โดยต้องปฏิบัติตามคู่มือและแผนการควบคุมนั้นแล้ว                            
                          </p>

          </div>

      </div>
     <div>
     <p className="text-xl text-gray-700 mb-4">เว็บไซต์นี้เป็นโครงงานนักศึกษา สาขา วิศวกรรมซอฟต์แวร์ มหาวิทยาลัย แม่ฟ้าหลวง</p>
      <div className='grid grid-cols-2 lg:grid-cols-5   gap-4 '>
        
      {teamMembers.map((member, index) => (
          <div key={index} className={styles.devcard}>
            <h1 className="text-lg">{member.name}</h1>
            
            <p className='text-sm border-b border-gray-300 mb-1'>{member.year}</p> 
            <p className="text-sm mb-1 text-gray-600">({member.nameEng}) </p>

            <ul className="list-disc pl-5">
              {member.role.map((role, roleIndex) => (
                <li key={roleIndex} className="text-sm text-gray-500">{role}</li>
              ))}
            </ul>
            
          </div>
        ))}        
      </div>     
     </div>


  

    </div>      
    </div>

  )
}
