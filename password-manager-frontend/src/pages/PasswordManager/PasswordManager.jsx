import React, { useContext, useEffect } from "react";
import CustInput from "../../components/CustInput";
import credContext from "../../context/credential/credContext";
import CustButton from "../../components/CustButton";
import CustTable from "../../components/CustTable";
import CustViewModal from "../../components/CustViewModal";
import CustDecryptModal from "../../components/CustDecryptModal";

const PasswordManager = () => {
  const { credInput, setCredInput, allCredential, allCred, handleNewCred, isModal, setIsModal } = useContext(credContext);

  const handleChange = (e) => {
    setCredInput({ ...credInput, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    allCred()
  }, [])
  

  return (
    <>
    <div className="w-2/3 mx-auto mt-10 p-5 rounded shadow">
      <h2 className="text-center mb-3 text-2xl font-semibold font-sans">
        Password Manager
      </h2>

      {/* ==========Form======== */}
      <form onSubmit={handleNewCred}>
        <div className="grid grid-cols-2 gap-4">
          <CustInput
            label="URL"
            type="text"
            className="flex flex-col gap-1"
            value={credInput.url}
            onChange={handleChange}
            name="url"
          />
          <CustInput
            label="Email"
            type="email"
            className="flex flex-col gap-1"
            value={credInput.email}
            onChange={handleChange}
            name="email"
          />
          <CustInput
            label="Username"
            type="text"
            className="flex flex-col gap-1"
            value={credInput.username}
            onChange={handleChange}
            name="username"
          />
          <CustInput
            label="Password"
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
            className=" py-2 mt-5 max-w-[10%] min-w-[15%] "
          />
        </div>
      </form>

      {/* ========table========= */}
      <CustTable allData={allCredential} />

    </div>

    
      {/* ========modal========= */}
      {isModal === 'viewCred' && <CustViewModal />}
      {isModal === 'masterCred' && <CustDecryptModal />}
    </>
  );
};

export default PasswordManager;
