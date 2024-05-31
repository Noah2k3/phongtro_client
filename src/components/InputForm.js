import React, { memo } from 'react'

const InputForm = ({ label, value, setValue, keyPayload, invalidFields, setInvalidFields, type }) => {
    return (
        <div>
            <label htmlFor={keyPayload} className='text-xs' >{label}</label>
            <input
                type={type || 'text'}
                id = {keyPayload}
                className='outline-none bg-[#e8f0fe] p-2 rounded-md w-full'
                value={value}
                onChange={(e) => setValue(prev => ({ ...prev, [keyPayload]: e.target.value }))}
                // onFocus={() => setInvalidFields && setInvalidFields([])}
                onFocus={() => typeof setInvalidFields === 'function' && setInvalidFields([])}
                // onFocus={() => setInvalidFields([])}
            />
            {invalidFields?.some(i => i.name === keyPayload) && <small className='text-red-500 italic' >{invalidFields.find(i => i.name === keyPayload)?.message}</small>}
        </div>
    )
}

export default memo(InputForm)

// import React, {memo} from 'react'

// const InputForm = ({ label, value, setValue, type, invalidFields, setInvalidFields }) => {
//   return (
//     <div>
//       <label htmlFor={type} className='text-xs'>{label}</label>
//       {/* <label htmlFor='phone' text-xs>{label}</label> */}
//       <input
//         type={type === 'password' ? 'password' : 'text'} // Điều chỉnh type của input dựa trên prop `type`
//         id={type} // Dùng `type` để đảm bảo id duy nhất
//         // type='text'
//         // id='phone'
//         className='outline-none bg-[#e8f0fe] p-2 rounded-md w-full'
//         value={value}
//         onChange={(e) => setValue(prev => ({...prev, [type]: e.target.value}))}
//         onFocus={() => setInvalidFields([])}
//       />
//       {invalidFields.length > 0 && invalidFields.some(i => i.name === type) && <small className='text-red-500 italic'>{invalidFields.find(i => i.name === type)?.message}</small>}
//     </div>
//   )
// }

// export default InputForm

// import React, { memo } from 'react'

// const InputForm = ({ label, value, setValue, keyPayload, invalidFields, setInvalidFields, type }) => {
//     return (
//         <div>
//             <label htmlFor={keyPayload} className='text-xs' >{label}</label>
//             <input
//                 type={type || 'text'}
//                 id={keyPayload}
//                 className='outline-none bg-[#e8f0fe] p-2 rounded-md w-full'
//                 value={value}
//                 onChange={(e) => setValue(prev => ({ ...prev, [keyPayload]: e.target.value }))}
//                 onFocus={() => setInvalidFields([])}
//             />
//             {invalidFields.length > 0 && invalidFields.some(i => i.name === keyPayload) && <small className='text-red-500 italic' >{invalidFields.find(i => i.name === keyPayload)?.message}</small>}
//         </div>
//     )
// }

// export default memo(InputForm)