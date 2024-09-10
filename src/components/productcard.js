

import Link from 'next/link';


const ProductCard = ({products}) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[30px] ">
        {products.map((product) => (
          <Link key={product.ProductID} href={`/product/${product.ProductID}`}>
              <div key={product.ProductName} className="Card flex-col justify-center w-full h-[390px] rounded-2xl bg-[#FBFBFB] shadow-lg transition duration-500 ease-in-out transform hover:scale-105">
                  
                  <div className="w-full h-[200px] justify-center">
                      <img className="w-full h-full object-cover rounded-t-2xl" src="/phulae.jpg" alt="Card Image" />
                  </div>

                  <div className="px-[18px]">

                      <div className="text-2xl mt-3">
                          <p>{product.ProductName} {product.ProductType} </p>
                      </div>

                      <div className="mt-[10px]">
                          <p>ผู้ขาย: สวนลุงพล</p>
                          <p>ราคา  {product.Price} B / KG </p>
                      </div>

                  </div>
              </div>
          </Link>
        )
      )
      }
      </div>
    );
  };
  
  export default ProductCard;