import React, { useContext } from 'react'
import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import credContext from '../context/credential/credContext';

const CustTable = ({ allData }) => {

  const { setIsModal, setEncryptedCredId, handleDecrypedPass, handleDeleteCred } = useContext(credContext);

  const handleView = (credId) => {
    console.log("view clicked")
    // setIsModal('masterCred')
    setIsModal('viewCred')
    setEncryptedCredId(credId)
  }

  const handleUpdate = async (credId) => {
    await handleDecrypedPass(credId)
    setIsModal('updateCred')
  }

  
  return (
    <>
    <table className=" border-collapse border border-gray-400 w-full">
  <thead>
    <tr>
      <th className='border border-gray-300 py-3 bg-gray-100 px-2'>Website Name</th>
      {/* <th className='border border-gray-300 py-3 bg-gray-100 px-2'>Email</th> */}
      <th className='border border-gray-300 py-3 bg-gray-100 px-2'>Username</th>
      <th className='border border-gray-300 py-3 bg-gray-100 px-2'>Password</th>
      <th className='border border-gray-300 py-3 bg-gray-100 px-2'>Action</th>
    </tr>
  </thead>
  <tbody>
    {
    allData?.map((cred)=>(
    <tr key={cred._id}>
      <td className='border border-gray-300 py-1 px-2'>
        <a href={cred.websiteURL} target='_blank' className='text-blue-600 underline underline-offset-2'>{cred.websiteName}</a>
        </td>
      {/* <td className='border border-gray-300 py-1 px-2'>{cred.email}</td> */}
      <td className='border border-gray-300 py-1 px-2'>{cred.username}</td>
      <td className='border border-gray-300 py-1 px-2'>********</td>
      <td className='border border-gray-300 py-1 px-2'>
        <div className="text-center flex gap-1 text-[19px]">
        <IoEye className='cursor-pointer text-blue-400 hover:text-blue-500' title='view' onClick={()=>handleView(cred._id)} />
        <TbEdit className='cursor-pointer text-yellow-400 hover:text-yellow-500' title='edit' onClick={()=>handleUpdate(cred._id)} />
        <MdDeleteForever className='text-red-500 cursor-pointer hover:text-red-600' title='delete' onClick={()=>handleDeleteCred(cred._id)} />
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