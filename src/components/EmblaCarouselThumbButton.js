import Image from 'next/image'

export const Thumb = ({ selected, onClick, image }) => {
  return (
    <div
      className={`cursor-pointer p-1 transition-transform ${
        selected ? 'scale-110 border-2 border-[#4eac14]' : 'opacity-60 hover:opacity-100'
      }`}
    >
      <button onClick={onClick} type="button" className="focus:outline-none">
        <Image
          src={image.imageUrl}
          alt="Thumbnail"
          width={100}
          height={100}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </button>
    </div>
  )
}
