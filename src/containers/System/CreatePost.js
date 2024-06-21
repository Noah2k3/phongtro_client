import React, { useEffect, useState } from "react";
import { Overview, Address, Loading, Button } from "../../components";
import { apiUploadImages, apiCreatePost, apiUpdatePost } from "../../services";
import icons from "../../ultils/icons";
import { getCodes, getCodesArea } from "../../ultils/Common/getCodes";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import validate from "../../ultils/Common/validateFields";
import { resetDataEdit } from "../../store/actions";
import { attention } from "../../ultils/constant";

const { BsCameraFill, ImBin } = icons;

const CreatePost = ({ isEdit }) => {
  const dispatch = useDispatch();
  const { dataEdit } = useSelector((state) => state.post);
  const { prices, areas, categories, provinces } = useSelector((state) => state.app);
  const { currentData } = useSelector((state) => state.user);
  const [payload, setPayload] = useState(() => {
    const initData = {
    // return {
      categoryCode: dataEdit?.categoryCode || "",
      title: dataEdit?.title || "",
      priceNumber: dataEdit?.priceNumber * 1000000 || 0,
      areaNumber: dataEdit?.areaNumber || 0,
      images: dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : [],
      address: dataEdit?.address || "",
      priceCode: dataEdit?.priceCode || "",
      areaCode: dataEdit?.areaCode || "",
      description: dataEdit?.description ? JSON.parse(dataEdit.description) : "",
      target: dataEdit?.overviews?.target || "",
      province: dataEdit?.province || "",
    };

    return initData;
  });
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    if (dataEdit) {
      setPayload({
        ...payload,
        categoryCode: dataEdit?.categoryCode || "",
        title: dataEdit?.title || "",
        priceNumber: dataEdit?.priceNumber * 1000000 || 0,
        areaNumber: dataEdit?.areaNumber || 0,
        images: dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : [],
        address: dataEdit?.address || "",
        priceCode: dataEdit?.priceCode || "",
        areaCode: dataEdit?.areaCode || "",
        description: dataEdit?.description ? JSON.parse(dataEdit.description) : "",
        target: dataEdit?.overviews?.target || "",
        province: dataEdit?.province || "",
      });
      setImagesPreview(dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : []);
    }
  }, [dataEdit]);

  const handleFiles = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    const files = e.target.files;
    const uploadedImages = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_UPLOAD_ASSETS_NAME
      );
      try {
        const response = await apiUploadImages(formData);
        if (response.status === 200) {
          uploadedImages.push(response.data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    setIsLoading(false);
    setImagesPreview((prevImages) => [...prevImages, ...uploadedImages]);
    setPayload((prevPayload) => ({
      ...prevPayload,
      images: [...prevPayload.images, ...uploadedImages],
    }));
  };

  const handleDeleteImage = (image) => {
    setImagesPreview((prevImages) => prevImages.filter((img) => img !== image));
    setPayload((prevPayload) => ({
      ...prevPayload,
      images: prevPayload.images.filter((img) => img !== image),
    }));
  };

  const handleSubmit = async () => {
    let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10,6), prices, 1, 15);
    let priceCode = priceCodeArr[0]?.code;
    let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90);
    let areaCode = areaCodeArr[0]?.code;

    let finalPayload = {
      ...payload,
      priceCode,
      areaCode,
      userId: currentData.id,
      priceNumber: +payload.priceNumber / Math.pow(10,6),
      target: payload.target || "Tất cả",
      label: `${categories.find((item) => item.code === payload.categoryCode)?.value} ${payload.address.split(",")[0]}`,
    };

    const validationResult = validate(finalPayload);
    if (validationResult === 0) {
      try {
        let response;
        if (isEdit) {
          finalPayload.postId = dataEdit?.id;
          finalPayload.attributesId = dataEdit?.attributesId;
          finalPayload.imagesId = dataEdit?.imagesId;
          finalPayload.overviewId = dataEdit?.overviewId;

          response = await apiUpdatePost(finalPayload);
          const successMessage = response?.data.err === 0 ? "Đã chỉnh sửa bài đăng thành công" : "Có lỗi khi chỉnh sửa bài đăng";
          Swal.fire(
            response?.data.err === 0 ? "Thành công" : "Oops!",
            successMessage,
            response?.data.err === 0 ? "success" : "error"
          );
          if (response?.data.err === 0) {
            resetPayload();
            dispatch(resetDataEdit());
          }
        } else {
          response = await apiCreatePost(finalPayload);
          const successMessage = response?.data.err === 0 ? "Đã thêm bài đăng mới" : "Có lỗi khi thêm bài đăng mới";
          Swal.fire(
            response?.data.err === 0 ? "Thành công" : "Oops!",
            successMessage,
            response?.data.err === 0 ? "success" : "error"
          );
          if (response?.data.err === 0) {
            resetPayload();
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const resetPayload = () => {
    setPayload({
      categoryCode: "",
      title: "",
      priceNumber: 0,
      areaNumber: 0,
      images: [],
      address: "",
      priceCode: "",
      areaCode: "",
      description: "",
      target: "",
      province: "",
    });
    setImagesPreview([]);
    setInvalidFields([]);
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-medium py-4 border-b border-gray-200">
        {isEdit ? "Chỉnh sửa tin đăng" : "Đăng tin mới"}
      </h1>
      <div className="flex gap-4">
        <div className="py-4 flex flex-col gap-8 flex-auto">
          <Address
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            payload={payload}
            setPayload={setPayload}
          />
          <Overview
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            payload={payload}
            setPayload={setPayload}
          />
          <div className="w-full mb-6">
            <h2 className="font-semibold text-xl py-4">Hình ảnh</h2>
            <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
            <div className="w-full">
              <label
                className="w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md"
                htmlFor="file"
              >
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <BsCameraFill color="blue" size={50} />
                    Thêm ảnh
                  </div>
                )}
              </label>
              <input
                onChange={handleFiles}
                hidden
                type="file"
                id="file"
                multiple
              />
              <small className="text-red-500 block w-full">
                {invalidFields?.some((item) => item.name === "images") &&
                  invalidFields?.find((item) => item.name === "images")
                    ?.message}
              </small>
              <div className="w-full">
                <h3 className="font-medium py-4">Ảnh đã chọn</h3>
                <div className="flex gap-4 items-center">
                  {imagesPreview?.map((item) => {
                    return (
                      <div key={item} className="relative w-1/3 h-1/3 ">
                        <img
                          src={item}
                          alt="preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <span
                          title="Xóa"
                          onClick={() => handleDeleteImage(item)}
                          className="absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full"
                        >
                          <ImBin />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            text={isEdit ? "Cập nhật" : "Tạo mới"}
            bgColor="bg-green-600"
            textColor="text-white"
          />
          <div className="h-[500px]"></div>
        </div>
        <div className="w-[30%] flex-none pt-12">
          {/* <Map address={payload.address} /> */}
          <div className="mt-8 bg-orange-100 text-orange-900 rounded-md p-4">
            <h4 className="texl-xl font-medium mb-4">Lưu ý tin đăng</h4>
            <ul className="text-sm list-disc pl-6 text-justify">
              {attention.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;


// import React, { useEffect, useState } from "react";
// import { Overview, Address, Loading, Button } from "../../components";
// import { apiUploadImages, apiCreatePost, apiUpdatePost } from "../../services";
// import icons from "../../ultils/icons";
// import { getCodes, getCodesArea } from "../../ultils/Common/getCodes";
// import { useSelector, useDispatch } from "react-redux";
// import Swal from "sweetalert2";
// import validate from "../../ultils/Common/validateFields";
// import { resetDataEdit } from "../../store/actions";
// import { attention } from "../../ultils/constant";

// const { BsCameraFill, ImBin } = icons;

// const CreatePost = ({ isEdit }) => {
//   const dispatch = useDispatch();
//   const { dataEdit } = useSelector((state) => state.post);
//   const { prices, areas, categories, provinces } = useSelector((state) => state.app);
//   const { currentData } = useSelector((state) => state.user);
//   const [payload, setPayload] = useState(() => {
//     const initData = {
//       categoryCode: dataEdit?.categoryCode || "",
//       title: dataEdit?.title ||"",
//       priceNumber: dataEdit?.priceNumber * 1000000 || 0,
//       areaNumber: dataEdit?.areaNumber || 0,
//       images: dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : "",
//       address: dataEdit?.address || "",
//       priceCode: dataEdit?.priceCode || "",
//       areaCode: dataEdit?.areaCode || "",
//       description: JSON.parse(dataEdit.description) || "",
//       target: dataEdit?.overviews?.target || "",
//       province: dataEdit?.province ||"",
//     }

//     return initData;
//   });
//   const [imagesPreview, setImagesPreview] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [invalidFields, setInvalidFields] = useState([]);

//   useEffect(() => {
//     if (dataEdit) {
//       setPayload({
//         ...payload,
//         categoryCode: dataEdit?.categoryCode || "",
//         title: dataEdit?.title || "",
//         priceNumber: dataEdit?.priceNumber * 1000000 || 0,
//         areaNumber: dataEdit?.areaNumber || 0,
//         images: dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : [],
//         address: dataEdit?.address || "",
//         priceCode: dataEdit?.priceCode || "",
//         areaCode: dataEdit?.areaCode || "",
//         description: dataEdit?.description
//           ? JSON.parse(dataEdit.description)
//           : "",
//         target: dataEdit?.overview?.target || "",
//         province: dataEdit?.province || "",
//       });
//       setImagesPreview(
//         dataEdit?.images?.image ? JSON.parse(dataEdit.images.image) : []
//       );
//     }
//   }, [dataEdit]);

//   const handleFiles = async (e) => {
//     e.stopPropagation();
//     setIsLoading(true);
//     const files = e.target.files;
//     const uploadedImages = [];
//     for (let file of files) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append(
//         "upload_preset",
//         process.env.REACT_APP_UPLOAD_ASSETS_NAME
//       );
//       try {
//         const response = await apiUploadImages(formData);
//         if (response.status === 200) {
//           uploadedImages.push(response.data.secure_url);
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }
//     setIsLoading(false);
//     setImagesPreview((prevImages) => [...prevImages, ...uploadedImages]);
//     setPayload((prevPayload) => ({
//       ...prevPayload,
//       images: [...prevPayload.images, ...uploadedImages],
//     }));
//   };

//   const handleDeleteImage = (image) => {
//     setImagesPreview((prevImages) => prevImages.filter((img) => img !== image));
//     setPayload((prevPayload) => ({
//       ...prevPayload,
//       images: prevPayload.images.filter((img) => img !== image),
//     }));
//   };

//   const handleSubmit = async () => {
//     let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10,6), prices, 1, 15)
//     let priceCode = priceCodeArr[0]?.code
//     let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90)
//     let areaCode = areaCodeArr[0]?.code

//     let finalPayload = {
//       ...payload,
//       priceCode,
//       areaCode,
//       userId: currentData.id,
//       priceNumber: +payload.priceNumber / Math.pow(10,6),
//       target: payload.target || "Tất cả",
//       label: `${
//         categories.find((item) => item.code === payload.categoryCode)?.value
//       } ${payload.address.split(",")[0]}`,
//     }

//     // console.log(finalPayload)

//     // const validationResult = validate(finalPayload, setInvalidFields);
//     const validationResult = validate(finalPayload);
//       if (validationResult === 0) {
//         try {
//           let response;
//           if (isEdit) {
//             finalPayload.postId = dataEdit?.id;
//             finalPayload.attributesId = dataEdit?.attributesId;
//             finalPayload.imagesId = dataEdit?.imagesId;
//             finalPayload.overviewId = dataEdit?.overviewId;

//             response = await apiUpdatePost(finalPayload);
//             const successMessage =
//               response?.data.err === 0
//                 ? "Đã chỉnh sửa bài đăng thành công"
//                 : "Có lỗi khi chỉnh sửa bài đăng";
//               Swal.fire(
//                 response?.data.err === 0 ? "Thành công" : "Oops!",
//                 successMessage,
//                 response?.data.err === 0 ? "success" : "error"
//               );
//               if (response?.data.err === 0) {
//                 resetPayload();
//                 dispatch(resetDataEdit());
//               }
//               } else {
//                 response = await apiCreatePost(finalPayload);
//                 const successMessage =
//                   response?.data.err === 0
//                     ? "Đã thêm bài đăng mới"
//                     : "Có lỗi khi thêm bài đăng mới";
//                   Swal.fire(
//                     response?.data.err === 0 ? "Thành công" : "Oops!",
//                     successMessage,
//                     response?.data.err === 0 ? "success" : "error"
//                   );
//                   if (response?.data.err === 0) {
//                     resetPayload();
//                   }
//               }
//         } catch (error) {
//           console.error("Error submitting form:", error);
//         }
//       }
//   }

//   const resetPayload = () => {
//     setPayload({
//       categoryCode: "",
//       title: "",
//       priceNumber: 0,
//       areaNumber: 0,
//       images: [],
//       address: "",
//       priceCode: "",
//       areaCode: "",
//       description: "",
//       target: "",
//       province: "",
//     });
//     setImagesPreview([]);
//     setInvalidFields([]);
//   };

//   return (
//     <div className="px-6">
//       <h1 className="text-3xl font-medium py-4 border-b border-gray-200">
//         {isEdit ? "Chỉnh sửa tin đăng" : "Đăng tin mới"}
//       </h1>
//       <div className="flex gap-4">
//         <div className="py-4 flex flex-col gap-8 flex-auto">
//           <Address
//             invalidFields={invalidFields}
//             setInvalidFields={setInvalidFields}
//             payload={payload}
//             setPayload={setPayload}
//           />
//           <Overview
//             invalidFields={invalidFields}
//             setInvalidFields={setInvalidFields}
//             payload={payload}
//             setPayload={setPayload}
//           />
//           <div className="w-full mb-6">
//             <h2 className="font-semibold text-xl py-4">Hình ảnh</h2>
//             <small>Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn</small>
//             <div className="w-full">
//               <label
//                 className="w-full border-2 h-[200px] my-4 gap-4 flex flex-col items-center justify-center border-gray-400 border-dashed rounded-md"
//                 htmlFor="file"
//               >
//                 {isLoading ? (
//                   <Loading />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center">
//                     <BsCameraFill color="blue" size={50} />
//                     Thêm ảnh
//                   </div>
//                 )}
//               </label>
//               <input
//                 onChange={handleFiles}
//                 hidden
//                 type="file"
//                 id="file"
//                 multiple
//               />
//               <small className="text-red-500 block w-full">
//                 {invalidFields?.some((item) => item.name === "images") &&
//                   invalidFields?.find((item) => item.name === "images")
//                     ?.message}
//               </small>
//               <div className="w-full">
//                 <h3 className="font-medium py-4">Ảnh đã chọn</h3>
//                 <div className="flex gap-4 items-center">
//                   {imagesPreview?.map((item) => {
//                     return (
//                       <div key={item} className="relative w-1/3 h-1/3 ">
//                         <img
//                           src={item}
//                           alt="preview"
//                           className="w-full h-full object-cover rounded-md"
//                         />
//                         <span
//                           title="Xóa"
//                           onClick={() => handleDeleteImage(item)}
//                           className="absolute top-0 right-0 p-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-full"
//                         >
//                           <ImBin />
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Button
//             onClick={handleSubmit}
//             text={isEdit ? "Cập nhật" : "Tạo mới"}
//             bgColor="bg-green-600"
//             textColor="text-white"
//           />
//           <div className="h-[500px]"></div>
//         </div>
//         <div className="w-[30%] flex-none pt-12">
//           {/* <Map address={payload.address} /> */}
//           <div className="mt-8 bg-orange-100 text-orange-900 rounded-md p-4">
//             <h4 className="texl-xl font-medium mb-4">Lưu ý tin đăng</h4>
//             <ul className="text-sm list-disc pl-6 text-justify">
//               {attention.map((item, index) => {
//                 return <li key={index}>{item}</li>;
//               })}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
