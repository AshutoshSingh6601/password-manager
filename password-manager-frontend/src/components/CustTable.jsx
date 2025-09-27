import React, { useContext } from 'react'
import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import credContext from '../context/credential/credContext';

const CustTable = ({ allData }) => {

  const { setCloseModal } = useContext(credContext);

  const handleView = () => {
    console.log("view clicked")
    setCloseModal(false)
  }

  return (
    <>
    <table className=" border-collapse border border-gray-400 w-full mt-5">
  <thead>
    <tr>
      <th className='border border-gray-300 py-3 bg-gray-100'>URL</th>
      <th className='border border-gray-300 py-3 bg-gray-100'>Email</th>
      <th className='border border-gray-300 py-3 bg-gray-100'>Username</th>
      <th className='border border-gray-300 py-3 bg-gray-100'>Password</th>
      <th className='border border-gray-300 py-3 bg-gray-100'>Action</th>
    </tr>
  </thead>
  <tbody>
    {
    allData.map((cred)=>(
    <tr key={cred._id}>
      <td className='border border-gray-300 py-1 ps-1'>
        <a href="https://tyger.in" target='_blank' className='text-blue-600 underline underline-offset-2'>{cred.website}</a>
        </td>
      <td className='border border-gray-300 py-1 ps-1'>{cred.email}</td>
      <td className='border border-gray-300 py-1 ps-1'>{cred.username}</td>
      <td className='border border-gray-300 py-1 ps-1'>********</td>
      <td className='border border-gray-300 py-1 ps-1'>
        <div className="text-center flex gap-1 text-[19px]">
        <IoEye className='cursor-pointer text-blue-400 hover:text-blue-500' title='view' onClick={handleView} />
        <TbEdit className='cursor-pointer text-yellow-400 hover:text-yellow-500' title='edit' />
        <MdDeleteForever className='text-red-500 cursor-pointer hover:text-red-600' title='delete' />
        </div>
      </td>
    </tr>
    ))
    }
  </tbody>
</table>
    </>
  )
}

export default CustTable