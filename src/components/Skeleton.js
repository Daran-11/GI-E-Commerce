// components/Skeleton.js
export default function Skeleton() {
    const cardLoadCount = 5; // Number of times to duplicate the card load
    return (
        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5  lg:gap-[30px] xl:gap-[30px]  gap-[20px]">
            {Array.from({ length: cardLoadCount }).map((_, index) => (
                <div className="animate-pulse card-load h-[350px] bg-gray-100 w-full rounded-xl" key={index}>
                    <div className="h-[150px] w-full bg-gray-200 px-[18px] rounded-xl mb-4 text-center"></div>
                    <div className="pt-2">
                        <div className="h-7 w-[180px] bg-gray-200 rounded-xl mb-2"></div>
                        <div className="h-6 w-[130px] bg-gray-200 rounded-xl mb-2"></div>
                        <div className="h-5 w-[150px] bg-gray-200 rounded-xl mb-2"></div>
                        <div className="h-9 w-full bg-gray-200 rounded-xl mb-2"></div>
                    </div>
                </div>
            ))}           
        </div>

    );
}
