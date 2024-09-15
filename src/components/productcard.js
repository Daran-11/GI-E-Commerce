
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './addToCartButton';
const ProductCard = ({products}) => {
    return (
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  lg:gap-[30px] xl:gap-[30px]  gap-[20px]">
        {products.map((product) => (
          
              <div key={product.ProductName} className="Card flex-col justify-center w-full h-fit lg:h-[350px] xl:h-full rounded-2xl pb-4 bg-[#FBFBFB] shadow-lg transition duration-500 ease-in-out transform hover:scale-105 ">
                  <Link key={product.ProductID} href={`/product/${product.ProductID}${product.ProductName}${product.ProductType}`}>

                  <div className="w-full h-[125px] xl:h-[200px] justify-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.ProductName}
                      width={0} // Adjust width as needed
                      height={0} // Adjust height as needed
                      sizes="100vw"
                      className='w-full h-full object-cover rounded-t-2xl'
                    />
                  ) : (
                    <img className="w-full h-full object-cover rounded-t-2xl" src="/phulae.jpg" alt="Card Image" />
                  )}
                      
                  </div>

                  <div className="px-[18px] h-[70px]">
                      <div className="text-lg sm:text-xl xl:text-2xl text-[#535353] lg:mt-3  ">
                          <p>{product.ProductName}{product.ProductType} </p>
                      </div>
                      <div className="mt-[2px] text-[#767676] text-base xl:text-lg ">
                          <p>ผู้ขาย {product.farmer.farmerName} </p>                    
                      </div>
                  </div>
                  </Link> 

                  <div className= 'flex md:grid  grid-cols-2 xl:grid-cols-2  px-[18px] lg:pt-[10px] text-[#4eac14] justify-between items-center border-t-[1px]'>
                      <p className=' text-[18px]  sm:text-[19px]  md:text-[25px]  lg:text-[23px] xl:text-[25px]'> ฿{Number(product.Price).toLocaleString()}</p>     
                      <p className=' text-end'>/กิโลกรัม</p>      



                  </div>
                  <div className='px-[18px] mt-[2px] lg:mt-[5px] lg:mb-[10px]'>

                  <AddToCartButton product={product}/>  

                  </div>                 

              </div>
        )
      )
      }
      </div>
    );
  };
  
  export default ProductCard;