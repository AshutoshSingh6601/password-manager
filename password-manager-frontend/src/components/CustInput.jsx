import React from 'react'

const CustInput = ({label, type, value, onChange, name, className, placeholder}) => {
  return (
    <div className={className}>
          <label htmlFor="username" className='font-[500] text-[#333]'>{label}</label>
          <input className='p-[0.6rem] rounded-[8px] border border-gray-300 focus:border-[#2575fc] outline-none transition-[border-color] duration-300'
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            placeholder={`Enter your ${placeholder}`}
          />
        </div>
  )
}

export default CustInput

