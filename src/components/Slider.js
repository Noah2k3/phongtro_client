import React, {memo} from 'react'
import Slider from 'react-slick'

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const SliderCustom = ({images}) => {


    return (
        <div classname='w-full'>
            <Slider {...settings}>
                {images?.length > 0 && images?.map((item, index) => {
                    return (
                        <div key={index} classname='bg-black flex justify-center h-[320px] px-12'>
                            <img 
                                src={item}
                                alt="slider"
                                classname='object-cotain m-auto h-full'
                            />
                        </div> 
                    )
                })}
            </Slider>    
        </div>
    )
}

export default memo(SliderCustom)