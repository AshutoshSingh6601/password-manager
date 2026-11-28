import React, { useContext } from "react";
import { FaXmark } from "react-icons/fa6";
import CustButton from "./CustButton";
import CustInput from "./CustInput";
import credContext from "../context/credential/credContext";

const CustDecryptModal = () => {
  const {
    masterPassword,
    setMasterPassword,
    setIsModal,
    handleVerifyMasterPass,
    allCredential
  } = useContext(credContext);

  const handleCloseDecryptModal = () => {
    setMasterPassword("");
    setIsModal("");
  };

  const username = allCredential?.masterUser || "Account Owner";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleCloseDecryptModal}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-5 sm:p-8 w-[90%] md:w-[480px] rounded-2xl shadow-2xl z-50">
        <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Master Credential Verification
          </h2>
          <button
            type="button"
            onClick={handleCloseDecryptModal}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full cursor-pointer"
            aria-label="Close"
          >
            <FaXmark className="text-xl sm:text-2xl" />
          </button>
        </div>
        <form onSubmit={handleVerifyMasterPass}>
          <div className="grid gap-4">
            <p className="border border-indigo-200 bg-white p-3 rounded-xl text-sm font-medium text-gray-700">
              User: <span className="font-semibold text-gray-900">{username}</span>
            </p>
            <p className="text-xs text-gray-600">
              Enter your account master password to verify identity and decrypt sensitive credentials.
            </p>

            <CustInput
              label="Master Password"
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              name="masterPassword"
              required
              className="flex flex-col gap-1"
            />
          </div>
          <div className="text-end mt-8 flex justify-end gap-3">
            <CustButton
              className="bg-gray-500 hover:bg-gray-600 py-2 px-4"
              label="Cancel"
              type="button"
              onClick={handleCloseDecryptModal}
            />
            <CustButton
              className="bg-emerald-600 hover:bg-emerald-700 py-2 px-5"
              type="submit"
              label="Verify & Continue"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CustDecryptModal;
