import React, { useContext, useEffect } from "react";
import CustInput from "../../components/CustInput";
import credContext from "../../context/credential/credContext";
import CustButton from "../../components/CustButton";
import CustTable from "../../components/CustTable";
import CustViewModal from "../../components/CustViewModal";
import CustDecryptModal from "../../components/CustDecryptModal";
import CustUpdateModel from "../../components/CustUpdateModel";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/auth/authContext";

const PasswordManager = () => {
  const { credInput, setCredInput, allCredential, allCred, handleNewCred, isModal, setIsModal } = useContext(credContext);
  const { authToken, setAuthToken } = useContext(authContext)

  const handleChange = (e) => {
    setCredInput({ ...credInput, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem("authToken")){
      allCred()
    }else{
      navigate('/')
    }
  }, [])
  

  return (
    <>
    <div className="min-h-dvh bg-sky-50 pt-2">
    <Navbar />
    <div className="w-[95%] sm:w-2/3 mx-auto mt-10 p-2 sm:p-5 rounded-xl inset-ring inset-ring-zinc-200 bg-zinc-50">
      <h2 className="text-center mb-3 text-2xl font-semibold font-sans">
        Password Manager
      </h2>

      {/* ==========Form======== */}
      <form onSubmit={handleNewCred}>
        <div className="grid grid-cols-2 gap-4">
          <CustInput
            label="Website URL"
            type="text"
            className="flex flex-col gap-1 col-span-2"
            value={credInput.websiteURL}
            onChange={handleChange}
            name="websiteURL"
            placeholder="Website URL"
          />
          <CustInput
            label="Website Name"
            placeholder="Website Name"
            type="text"
            className="flex flex-col gap-1"
            value={credInput.websiteName}
            onChange={handleChange}
            name="websiteName"
          />
          <CustInput
            label="Email"
            placeholder="Email"
            type="email"
            className="flex flex-col gap-1"
            value={credInput.email}
            onChange={handleChange}
            name="email"
          />
          <CustInput
            label="Username"
            placeholder="Username"
            type="text"
            className="flex flex-col gap-1"
            value={credInput.username}
            onChange={handleChange}
            name="username"
          />
          <CustInput
            label="Password"
            placeholder="Password"
            type="password"
            className="flex flex-col gap-1"
            value={credInput.password}
            onChange={handleChange}
            name="password"
          />
        </div>
        <div className="text-end">
          <CustButton
            type="submit"
            label="Save"
            className=" py-2 mt-5 w-20 "
          />
        </div>
      </form>
   </div>
      {/* ========table========= */}
      <div className="flex flex-nowrap inset-ring inset-ring-zinc-200 bg-zinc-50 overflow-x-auto my-10 rounded-xl p-3 w-[95%] sm:w-2/3 mx-auto">
        <CustTable allData={allCredential?.data} />
      </div>
    </div>

 

    
      {/* ========modal========= */}
      {isModal === 'viewCred' && <CustViewModal />}
      {isModal === 'updateCred' && <CustUpdateModel />}
      {/* {isModal === 'masterCred' && <CustDecryptModal />} */}
    </>
  );
};

export default PasswordManager;
