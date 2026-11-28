import React, { useContext, useEffect } from "react";
import CustInput from "../../components/CustInput";
import credContext from "../../context/credential/credContext";
import CustButton from "../../components/CustButton";
import CustTable from "../../components/CustTable";
import CustViewModal from "../../components/CustViewModal";
import CustUpdateModel from "../../components/CustUpdateModel";
import CustDecryptModal from "../../components/CustDecryptModal";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/auth/authContext";

const PasswordManager = () => {
  const {
    credInput,
    setCredInput,
    allCredential,
    allCred,
    handleNewCred,
    isModal,
    isSubmitting
  } = useContext(credContext);

  const { authToken } = useContext(authContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const token = authToken || localStorage.getItem("authToken");
    if (!token || token === "undefined" || token === "null") {
      navigate("/", { replace: true });
    } else {
      allCred();
    }
  }, [authToken, allCred, navigate]);

  return (
    <>
      <div className="min-h-dvh bg-sky-50 pt-4 pb-12">
        <Navbar />

        {/* ========== Add Credential Form ======== */}
        <div className="w-[95%] sm:w-2/3 mx-auto mt-6 p-4 sm:p-6 rounded-2xl inset-ring inset-ring-zinc-200 bg-zinc-50 shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-sans text-gray-800">
              Add New Password
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Encrypted end-to-end with military-grade AES-256-GCM
            </p>
          </div>

          <form onSubmit={handleNewCred}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustInput
                label="Website URL"
                type="text"
                className="flex flex-col gap-1 sm:col-span-2"
                value={credInput.websiteURL}
                onChange={handleChange}
                name="websiteURL"
                placeholder="e.g. https://github.com"
                disabled={isSubmitting}
              />
              <CustInput
                label="Website Name"
                placeholder="e.g. GitHub"
                type="text"
                className="flex flex-col gap-1"
                value={credInput.websiteName}
                onChange={handleChange}
                name="websiteName"
                disabled={isSubmitting}
              />
              <CustInput
                label="Email"
                placeholder="e.g. user@example.com"
                type="email"
                className="flex flex-col gap-1"
                value={credInput.email}
                onChange={handleChange}
                name="email"
                disabled={isSubmitting}
              />
              <CustInput
                label="Username / Login ID"
                placeholder="Username or Handle"
                type="text"
                required
                className="flex flex-col gap-1"
                value={credInput.username}
                onChange={handleChange}
                name="username"
                disabled={isSubmitting}
              />
              <CustInput
                label="Password"
                placeholder="Site password"
                type="password"
                required
                className="flex flex-col gap-1"
                value={credInput.password}
                onChange={handleChange}
                name="password"
                disabled={isSubmitting}
              />
            </div>
            <div className="text-end mt-6">
              <CustButton
                type="submit"
                label="Save"
                className="py-2.5 px-6 min-w-28"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        {/* ======== Vault Table ========= */}
        <div className="flex flex-nowrap inset-ring inset-ring-zinc-200 bg-zinc-50 overflow-x-auto my-8 rounded-2xl p-4 w-[95%] sm:w-2/3 mx-auto shadow-md">
          <CustTable allData={allCredential?.data} />
        </div>
      </div>

      {/* ======== Modals ========= */}
      {isModal === "viewCred" && <CustViewModal />}
      {isModal === "updateCred" && <CustUpdateModel />}
      {isModal === "masterCred" && <CustDecryptModal />}
    </>
  );
};

export default PasswordManager;
