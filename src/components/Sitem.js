import React, { memo } from 'react';
import moment from 'moment';
import 'moment/locale/vi';

const Sitem = ({ title, price, image, createdAt }) => {
    // Định dạng thời gian
    const formatTime = (createdAt) => {
        moment.locale('vi'); // Sửa lại locale từ 'vn' thành 'vi'
        return moment(createdAt).fromNow();
    }

    // Hàm kiểm tra và trả về ảnh
    const getImageSrc = (image) => {
        // Kiểm tra nếu image không null và có ít nhất một phần tử
        if (image && image.length > 0) {
            return image[0];
        }
        return 'path_to_default_image.jpg'; // Đường dẫn đến ảnh mặc định nếu image không có dữ liệu
    };

    return (
        <div className='w-full flex items-center gap-2 py-2 border-b border-gray-300'>
            <img
                src={getImageSrc(image)}
                alt="Ảnh"
                className='w-[65px] h-[65px] object-cover flex-none rounded-md'
            />
            <div className='w-full flex-auto flex flex-col justify-between gap-1'>
                <h4 className='text-blue-600 text-[14px]'>{`${title?.slice(0, 45)}...`}</h4>
                <div className='flex items-center justify-between w-full'>
                    <span className='text-sm font-medium text-green-500'>{price}</span>
                    <span className='text-sm text-gray-300'>{formatTime(createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(Sitem);


// import React, { memo } from 'react'
// import moment from 'moment'
// import 'moment/locale/vi'

// const Sitem = ({ title, price, image, createdAt }) => {

//     const formatTime = (createdAt) => {
//         moment.locale('vi')
//         return moment(createdAt).fromNow()
//     }

//     return (
//         <div className='w-full flex items-center gap-2 py-2 border-b border-gray-300'>
//             <img
//                 src={image[0]}
//                 alt="anh"
//                 className='w-[65px] h-[65px] object-cover flex-none rounded-md'
//             />
//             <div className='w-full flex-auto flex flex-col justify-between gap-1'>
//                 <h4 className='text-blue-600 text-[14px]'>{`${title?.slice(0, 45)}...`}</h4>
//                 <div className=' flex items-center justify-between w-full'>
//                     <span className='text-sm font-medium text-green-500'>{price}</span>
//                     <span className='text-sm text-gray-300'>{formatTime(createdAt)}</span>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default memo(Sitem)