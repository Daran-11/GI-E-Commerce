
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
                  <Link key={product.ProductID} href={`/product/${product.ProductID}`}>
                  

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
                      <div className="text-lg md:mt-2 sm:text-xl xl:text-2xl text-[#535353]  ">
                          <p className=''>{product.ProductName}{product.ProductType} </p>
                      </div>
                      
                      <div className="md:mt-[2px] text-[#767676] text-base xl:text-lg ">
                          <p className='leading-tight '>ผู้ขาย {product.farmer.farmerName} </p> 
                          {/* Star Rating Component */}
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