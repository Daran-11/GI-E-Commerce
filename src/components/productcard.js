
import Link from 'next/link';
import AddToCartButton from './addToCartButton';
const ProductCard = ({products}) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-[30px] xl:gap-[30px] ">
        {products.map((product) => (
          
              <div key={product.ProductName} className="Card flex-col justify-center w-fit h-[350px] md:h-[380px] lg:h-[350px] xl:h-full rounded-2xl bg-[#FBFBFB] shadow-lg transition duration-500 ease-in-out transform hover:scale-105 ">
                  <Link key={product.ProductID} href={`/product/${product.ProductID}${product.ProductName}${product.ProductType}`}>

                  <div className="w-full h-[200px] justify-center">
                      <img className="w-full h-full object-cover rounded-t-2xl" src="/phulae.jpg" alt="Card Image" />
                  </div>

                  <div className="px-[18px] h-[70px]">
                      <div className="text-2xl text-[#535353] mt-3  ">
                          <p>{product.ProductName} {product.ProductType} </p>
                      </div>
                      <div className="mt-[5px] text-[#767676] text-xl ">
                          <p>ผู้ขาย {product.farmer.farmerName} </p>                    
                      </div>
                  </div>
                  </Link> 

                  <div className= 'xl:flex md:grid md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2  px-[18px] pt-[10px] text-[#4eac14] flex justify-between items-center border-t-[1px]'>
                      <p className=' sm:text-[19px]  md:text-[25px]  lg:text-[23px] xl:text-[28px]'> ฿{product.Price}/กิโล  </p>                             
                  <div >
                    <AddToCartButton product={product}/>  
                  </div>


                  </div>
                  <div className='px-[18px] mt-[10px]'>
                                     
                  </div>                 

              </div>
        )
      )
      }
      </div>
    );
  };
  
  export default ProductCard;