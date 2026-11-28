import React, { useContext, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import CustButton from "./CustButton";
import CustInput from "./CustInput";
import credContext from "../context/credential/credContext";

const CustUpdateModel = () => {
  const {
    setIsModal,
    viewModalData,
    setViewModalData,
    eCredInput,
    setECredInput,
    handleUpdateCred,
    isUpdating
  } = useContext(credContext);

  const { _id, websiteURL, websiteName, email, username, password } = viewModalData || {};

  const handleChange = (e) => {
    setECredInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setViewModalData({});
    setIsModal("");
  };

  useEffect(() => {
    if (viewModalData && _id) {
      setECredInput({
        ewebsiteURL: websiteURL || "",
        ewebsiteName: websiteName || "",
        eemail: email || "",
        eusername: username || "",
        epassword: password || ""
      });
    }
  }, [viewModalData, _id, websiteURL, websiteName, email, username, password, setECredInput]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-5 sm:p-8 w-[92%] sm:w-[560px] rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Edit Credential
            </h2>
            <p className="text-xs text-gray-500">Update and re-encrypt credential</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaXmark className="text-2xl" />
          </button>
        </div>

        <form onSubmit={(e) => handleUpdateCred(e, _id)}>
          <div className="grid sm:grid-cols-2 gap-4">
            <CustInput
              label="Website URL"
              placeholder="e.g. https://google.com"
              type="text"
              className="flex flex-col gap-1 sm:col-span-2"
              value={eCredInput.ewebsiteURL}
              onChange={handleChange}
              name="ewebsiteURL"
            />
            <CustInput
              label="Website Name"
              placeholder="e.g. Google"
              type="text"
              className="flex flex-col gap-1"
              value={eCredInput.ewebsiteName}
              onChange={handleChange}
              name="ewebsiteName"
            />
            <CustInput
              label="Email"
              placeholder="Account email"
              type="email"
              className="flex flex-col gap-1"
              value={eCredInput.eemail}
              onChange={handleChange}
              name="eemail"
            />
            <CustInput
              label="Username"
              placeholder="Username / Login ID"
              type="text"
              required
              className="flex flex-col gap-1"
              value={eCredInput.eusername}
              onChange={handleChange}
              name="eusername"
            />
            <CustInput
              label="Password"
              placeholder="New password"
              type="text"
              required
              className="flex flex-col gap-1"
              value={eCredInput.epassword}
              onChange={handleChange}
              name="epassword"
            />
          </div>

          <div className="text-end mt-8 pt-4 border-t border-indigo-200 flex justify-end gap-3">
            <CustButton
              className="bg-gray-500 hover:bg-gray-600 py-2 px-4"
              label="Cancel"
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
            />
            <CustButton
              className="bg-emerald-600 hover:bg-emerald-700 py-2 px-6"
              type="submit"
              label="Save Changes"
              loading={isUpdating}
              disabled={isUpdating}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CustUpdateModel;
