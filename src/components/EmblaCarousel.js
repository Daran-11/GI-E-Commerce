import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Thumb } from './EmblaCarouselThumbButton'

const EmblaCarousel = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="embla w-[500px]">
      {/* Embla Main Carousel */}
      <div className="embla__viewport w-full overflow-hidden " ref={emblaMainRef}>
        <div className="embla__container flex">
          {images.map((image, index) => (
            <div
              className="embla__slide  min-w-full h-[400px]   max-h-[200px] md:max-w-[200px]  md:max-h-[500px]  rounded-2xl px-2 "
              key={index}
            >
            <Image
            src={image.imageUrl}
            alt={`Product image ${index + 1}`}
            width={500}
            height={500}
            loading="lazy"
            className="  w-[500px] h-full bg-white  max-h-[200px] md:max-h-[500px] object-contain object-center  rounded-xl "
            />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="embla-thumbs mt-4">
        <div className="embla-thumbs__viewport overflow-hidden" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container flex space-x-2">
            {images.map((image, index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                image={image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
