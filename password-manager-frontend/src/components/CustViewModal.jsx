import React, { useContext, useEffect } from "react";
import CustButton from "./CustButton";
import { FaXmark, FaRegCopy } from "react-icons/fa6";
import credContext from "../context/credential/credContext";
import { successMessage, errorMessage } from "../utils/AlertMessage";

const CustViewModal = () => {
  const {
    setIsModal,
    handleDecrypedPass,
    encryptedCredId,
    viewModalData,
    setViewModalData,
    isDecrypting
  } = useContext(credContext);

  const { websiteURL, websiteName, email, username, password } = viewModalData || {};

  const handleClose = () => {
    setViewModalData({});
    setIsModal("");
  };

  const handleCopy = async (text, label) => {
    if (!text) {
      errorMessage(`No ${label} to copy`);
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / non-https environments
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      successMessage(`${label} copied to clipboard!`);
    } catch {
      errorMessage(`Failed to copy ${label}`);
    }
  };

  useEffect(() => {
    if (encryptedCredId) {
      handleDecrypedPass(encryptedCredId);
    }
  }, [encryptedCredId, handleDecrypedPass]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-50 p-5 sm:p-8 w-[92%] sm:w-[540px] rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {websiteName || "Credential Details"}
            </h2>
            <p className="text-xs text-gray-500">Decrypted securely with AES-256</p>
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

        {isDecrypting ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-sm font-medium">Decrypting password securely...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full text-sm">
            {websiteURL && (
              <div className="border border-indigo-100 bg-white p-3 rounded-xl flex justify-between items-center">
                <span className="font-medium text-gray-600">Website URL:</span>
                <a
                  href={websiteURL.startsWith("http") ? websiteURL : `https://${websiteURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline truncate max-w-[240px] ms-2"
                >
                  {websiteURL}
                </a>
              </div>
            )}

            <div className="border border-indigo-100 bg-white p-3 rounded-xl flex justify-between items-center">
              <span className="font-medium text-gray-600">Email:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-mono truncate max-w-[200px]">
                  {email || "—"}
                </span>
                {email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(email, "Email")}
                    title="Copy email"
                    className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  >
                    <FaRegCopy />
                  </button>
                )}
              </div>
            </div>

            <div className="border border-indigo-100 bg-white p-3 rounded-xl flex justify-between items-center">
              <span className="font-medium text-gray-600">Username:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-mono truncate max-w-[200px]">
                  {username || "—"}
                </span>
                {username && (
                  <button
                    type="button"
                    onClick={() => handleCopy(username, "Username")}
                    title="Copy username"
                    className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  >
                    <FaRegCopy />
                  </button>
                )}
              </div>
            </div>

            <div className="border border-indigo-200 bg-white p-3 rounded-xl flex justify-between items-center shadow-xs">
              <span className="font-semibold text-gray-800">Password:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {password || "••••••••"}
                </span>
                {password && (
                  <button
                    type="button"
                    onClick={() => handleCopy(password, "Password")}
                    title="Copy password"
                    className="text-gray-600 hover:text-blue-600 cursor-pointer p-1"
                  >
                    <FaRegCopy />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-end mt-6 pt-3 border-t border-indigo-200">
          <CustButton
            className="bg-gray-600 hover:bg-gray-700 py-2 px-5"
            onClick={handleClose}
            label="Close"
          />
        </div>
      </div>
    </>
  );
};

export default CustViewModal;
