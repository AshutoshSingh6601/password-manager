import React, { useContext } from "react";
import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import credContext from "../context/credential/credContext";

/**
 * Safely format website URL for external navigation, preventing javascript: execution
 */
const getSafeUrl = (url) => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed)) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const CustTable = ({ allData }) => {
  const {
    setIsModal,
    setEncryptedCredId,
    handleDecrypedPass,
    handleDeleteCred,
    isLoading,
    isDeletingId
  } = useContext(credContext);

  const handleView = (credId) => {
    setEncryptedCredId(credId);
    setIsModal("viewCred");
  };

  const handleUpdate = async (credId) => {
    setEncryptedCredId(credId);
    await handleDecrypedPass(credId);
    setIsModal("updateCred");
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
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
        <p className="text-sm font-medium">Loading your encrypted credentials...</p>
      </div>
    );
  }

  if (!allData || allData.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        <p className="font-medium text-base">No credentials saved yet.</p>
        <p className="text-sm text-gray-400 mt-1">Add your first website credential using the form above.</p>
      </div>
    );
  }

  return (
    <table className="border-collapse border border-gray-300 w-full text-left">
      <thead>
        <tr>
          <th className="border border-gray-300 py-3 bg-gray-100 px-3 font-semibold text-gray-700">
            Website Name
          </th>
          <th className="border border-gray-300 py-3 bg-gray-100 px-3 font-semibold text-gray-700">
            Username / Identifier
          </th>
          <th className="border border-gray-300 py-3 bg-gray-100 px-3 font-semibold text-gray-700">
            Password
          </th>
          <th className="border border-gray-300 py-3 bg-gray-100 px-3 font-semibold text-gray-700 text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {allData.map((cred) => (
          <tr key={cred._id} className="hover:bg-gray-50 transition-colors">
            <td className="border border-gray-300 py-2 px-3">
              {cred.websiteURL ? (
                <a
                  href={getSafeUrl(cred.websiteURL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline underline-offset-2 break-all"
                >
                  {cred.websiteName || cred.websiteURL}
                </a>
              ) : (
                <span className="text-gray-800">{cred.websiteName || "—"}</span>
              )}
            </td>
            <td className="border border-gray-300 py-2 px-3 break-all">
              {cred.username}
            </td>
            <td className="border border-gray-300 py-2 px-3 font-mono text-gray-500 select-none">
              ••••••••
            </td>
            <td className="border border-gray-300 py-2 px-3">
              <div className="flex justify-center items-center gap-3 text-[19px]">
                <button
                  type="button"
                  aria-label="View Credential"
                  title="View and decrypt password"
                  onClick={() => handleView(cred._id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <IoEye />
                </button>
                <button
                  type="button"
                  aria-label="Edit Credential"
                  title="Edit credential"
                  onClick={() => handleUpdate(cred._id)}
                  className="text-amber-500 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <TbEdit />
                </button>
                <button
                  type="button"
                  aria-label="Delete Credential"
                  title="Delete credential"
                  disabled={isDeletingId === cred._id}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete credential for '${cred.websiteName || cred.username}'?`)) {
                      handleDeleteCred(cred._id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {isDeletingId === cred._id ? (
                    <span className="inline-block animate-spin text-xs">⏳</span>
                  ) : (
                    <MdDeleteForever />
                  )}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustTable;
