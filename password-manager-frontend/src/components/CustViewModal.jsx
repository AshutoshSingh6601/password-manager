import React, { useContext, useEffect, useState } from "react";
import CustButton from "./CustButton";
import { FaXmark } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa6";
import credContext from "../context/credential/credContext";
import { successMessage } from "../utils/AlertMessage";

const CustViewModal = () => {
 
  const { setIsModal, handleDecrypedPass, encryptedCredId, viewModalData } = useContext(credContext);

   const { websiteURL, email, username, password } = viewModalData

  const handleClose = () => {
    // Logic to close the modal
    setIsModal('');
  }

  const handleCopy = (text) => {
    // Logic to copy to clipboard
    navigator.clipboard.writeText(text);
    successMessage("Copied to clipboard!");
  }

  useEffect(() => {
    handleDecrypedPass(encryptedCredId)
  }, [])
  

  return (
    <>
    <div className="bg-stone-00 w-dvw h-dvh absolute top-0 blur-xs backdrop-blur-xs ">
    </div>
      <div className="bg-indigo-50 p-3 sm:p-10 w-[93%] md:w-1/2 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold">View Credential</h2>
        <FaXmark className="text-2xl cursor-pointer" onClick={handleClose} />
      </div>
        <div className="grid sm:grid-cols-2 gap-4">
        <p className="border p-3 rounded-xl">website URL:
          <a href="https://tyger.in" target='_blank' className='text-blue-600 underline underline-offset-2 ms-1'>{websiteURL}</a>
        </p>
        <p className="border p-3 rounded-xl flex justify-between items-center">Email: {email} <FaRegCopy title="copy" className="cursor-pointer" onClick={()=>handleCopy(email)} /></p>
        <p className="border p-3 rounded-xl flex justify-between items-center">Username: {username} <FaRegCopy title="copy" className="cursor-pointer" onClick={()=>handleCopy(username)} /></p>
        <p className="border p-3 rounded-xl flex justify-between items-center">Password: {password} <FaRegCopy title="copy" className="cursor-pointer" onClick={()=>handleCopy(password)} /></p>
        </div>
        <div className="text-end mt-10">
        <CustButton className='bg-red-600 hover:bg-red-700 py-2' onClick={handleClose} label='Cancel' />
        </div>
      </div>
    </>
  );
};

export default CustViewModal;
