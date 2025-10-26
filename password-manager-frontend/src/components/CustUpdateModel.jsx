import React, { useContext, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa6";
import CustButton from "./CustButton";
import CustInput from "./CustInput";
import credContext from "../context/credential/credContext";

const CustUpdateModel = () => {
  const {
    setIsModal,
    handleVerifyMasterPass,
    viewModalData,
    eCredInput,
    setECredInput,
    handleUpdateCred
  } = useContext(credContext);
  const {_id, websiteURL, websiteName, email, username, password } = viewModalData;

  const handleChange = (e) => {
    setECredInput({ ...eCredInput, [e.target.name]: e.target.value });
  };

  const handleCloseDecryptModal = () => {
    setIsModal("");
  };

  // const handleUpdate = (e) => {
  //   e.preventDefault()
  //   handleUpdateCred(_id)
  // }

  useEffect(() => {
    setECredInput({
      ewebsiteURL: websiteURL,
      ewebsiteName: websiteName,
      eemail: email,
      eusername: username,
      epassword: password,
    });
  }, []);

  return (
    <>
      <div className="bg-stone-00 w-dvw h-dvh absolute top-0 blur-xs backdrop-blur-xs "></div>
      <div className="bg-indigo-50 p-5 sm:p-10 w-[90%] md:w-1/2 rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-center mb-3 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Edit Credential
          </h2>
          <FaXmark
            className="text-xl sm:text-2xl cursor-pointer"
            onClick={handleCloseDecryptModal}
          />
        </div>
        <form onSubmit={(e)=>handleUpdateCred(e,_id)}>
          <div className="grid sm:grid-cols-2 gap-4">
            <CustInput
              label="Website URL"
              placeholder="Website URL"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.ewebsiteURL}
              onChange={handleChange}
              name="ewebsiteURL"
            />
            <CustInput
              label="Website Name"
              placeholder="Website Name"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.ewebsiteName}
              onChange={handleChange}
              name="ewebsiteName"
            />
            <CustInput
              label="Email"
              placeholder="Email"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.eemail}
              onChange={handleChange}
              name="eemail"
            />
            <CustInput
              label="Username"
              placeholder="Username"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.eusername}
              onChange={handleChange}
              name="eusername"
            />
            <CustInput
              label="Password"
              placeholder="Password"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.epassword}
              onChange={handleChange}
              name="epassword"
            />
          </div>
          <div className="text-end mt-10">
            <CustButton
              className="bg-green-600 hover:bg-green-700 py-2 me-3"
              type="submit"
              label="Edit"
            />
            <CustButton
              className="bg-red-600 hover:bg-red-700 py-2"
              label="Cancel"
              type="button"
              onClick={handleCloseDecryptModal}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CustUpdateModel;
