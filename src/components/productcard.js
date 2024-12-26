
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({products}) => {
  const [starSize, setStarSize] = useState(15); // Default star size


  useEffect(() => {
    // Function to update star size based on screen width
    const updateStarSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1280) { // xl screen
        setStarSize(20);
      } else if (screenWidth >= 1024) { // lg screen
        setStarSize(15);
      } else if (screenWidth >= 768) { // md screen
        setStarSize(15);
      } else { // sm screen
        setStarSize(15);
      }
    };

    // Call it once on mount
    updateStarSize();

    // Add event listener to resize
    window.addEventListener('resize', updateStarSize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', updateStarSize);
  }, []); // Empty array ensures this runs only on mount/unmount


    return (
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5  lg:gap-[30px] xl:gap-[30px]  gap-[20px]">
        {products.map((product) => (
          
              <div key={product.ProductID} className="Card flex-col w-full justify-center h-fit lg:h-[350px] xl:h-full rounded-2xl pb-2 bg-[#FBFBFB] shadow-lg transition duration-500 ease-in-out transform hover:scale-105 ">
                  <Link key={product.ProductID} href={`/product/${product.ProductID}${product.ProductName}${product.ProductType}${product.farmer.farmerName}`}>
                  

                  <div className="w-full h-[120px] md:h-[120px] xl:h-[160px] flex justify-center items-center ">
                  {product.images?.[0]?.imageUrl ? (
                    <Image
                      src={product.images[0].imageUrl} 
                      alt={product.ProductName}
                      width={100}
                      height={100}
                      sizes="50vw"
                      loading="lazy"
                      className="h-full min-w-full object-cover object-center rounded-t-2xl"

                    />
                  ) : (
                    <Image
                      className="w-full h-full object-cover object-center rounded-t-2xl"
                      src="/phulae.jpg"
                      width={100}
                      height={100}
                      sizes="50vw"
                      loading="lazy"
                      alt="Card Image"
                    />// Fallback if image fails to load
                  )}
                </div>
      

                  <div className="px-[12px] md:px-[18px] h-fit pb-2 -space-y-1 md:space-y-0">

                  <div className='flex justify-start items-center w-full '>
                            {product.certificates.map((cert) => {
                              // Ensure certificate exists and has the 'certificate' property
                              if (cert.certificate && cert.certificate.standards) {
                                const standards = cert.certificate.standards; // This is the JSON field

                                try {
                                  // Assuming standards is a JSON string, parse it if necessary
                                  const standardsObj = JSON.parse(standards);
                                  console.log("standardsObj :",standardsObj)

                                  return (
             
                                      <div className='flex  mt-1 ' key={cert.certificate.id} >
                                        <div className='hidden lg:flex space-x-3 justify-center items-center'>
                                        {standardsObj.map((standard, index) => (
                                          <div className="" key={index}>
                                            <Tooltip title={`มาตรฐานการรับรอง ${standard.name} รหัส ${standard.certNumber}`} arrow>
                                            <div>
                                            <Image
                                            key={index}
                                            src={standard.logo}
                                            alt={standard.name}
                                            width={40}
                                            height={40}
                                          />
                                                                    
                                            </div>
                                                                                 
                                            </Tooltip> 

                                          </div>
                                        ))}
                                        </div>
                                        <div className='lg:hidden flex justify-start items-center pb-1'>
                                        {standardsObj.map((standard, index) => (
                                          <div className="" key={index}>
                                            <Tooltip title={`มาตรฐานการรับรอง ${standard.name} รหัส ${standard.certNumber}`} arrow>
                                            <div>
                                            <Image
                                            key={index}
                                            src={standard.logo}
                                            alt={standard.name}
                                            width={30}
                                            height={30}
                                          />
                                                                    
                                            </div>
                                                                                 
                                            </Tooltip> 

                                          </div>
                                        ))}
                                        </div>

                                      </div>
                                      
                               
                                  );
                                } catch (error) {
                                  console.error('Error parsing standards:', error);
                                  return <div>Invalid standards data</div>;
                                }
                              } else {
                                // If no standards found for the certificate
                                return (
                                  <div key={cert.certificate ? cert.certificate.id : 'no-id'}>
                                    ไม่พบมาตรฐาน
                                  </div>
                                );
                              }
                            })}                            
                          </div>                    
   

                      <div className="flex justify-between items-center text-lg md:mt-2 sm:text-xl xl:text-2xl text-[#535353]  ">
                          <p className=''>{product.ProductName}{product.ProductType} </p>
                          
                      </div>
                      
                      <div className="flex justify-between md:mt-[2px] text-[#767676] text-base xl:text-lg ">
                          <p className='leading-tight '>ผู้ขาย {product.farmer.farmerName} </p> 
                         
                      </div>

                      <div className='flex items-center'>
                        
                      <Rating
                            readonly
                            initialValue={product.averageRating} // Pass the average rating value
                            size={starSize} // Set star size
                            iconsCount={5}
                            allowFraction='true'
                            
                        />
                        <div className="ml-2 text-sm text-center text-gray-600">{product.averageRating} ({product.reviews.length})</div> {/* Number of reviews */}

                      </div>

                  </div>
                  
                  </Link> 

                  <div className= 'flex md:grid  grid-cols-2 xl:grid-cols-2  px-[12px] md:px-[18px] pt-1  text-[#4eac14] justify-between items-center border-t-[1px]'>
                      <p className=' text-[18px]  sm:text-[19px]  md:text-[25px]  lg:text-[23px] xl:text-[25px]'> ฿{Number(product.Price).toLocaleString()}</p>     
                      <p className=' text-end'>/กิโลกรัม</p>      



                  </div>
                  <div className='px-[12px] md:px-[18px] md:mt-[2px] lg:mt-[5px] lg:mb-[10px] plausible-event-name=Addcart'>

                  <AddToCartButton  product={product} 
                  ProductID ={product.ProductID}
                  />  

                  </div>                 


              </div>
        )
      )
      }
      </div>
    );
  };
  
  export default ProductCard;