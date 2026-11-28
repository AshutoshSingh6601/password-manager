import { useContext, useState, useCallback } from "react";
import CredContext from "./credContext";
import { BASE_URL } from "../../config";
import { errorMessage, successMessage } from "../../utils/AlertMessage";
import authContext from "../auth/authContext";

const CredState = ({ children }) => {
  const { authToken, handleLogout } = useContext(authContext);

  // Modal control: '' | 'viewCred' | 'updateCred' | 'masterCred'
  const [isModal, setIsModal] = useState("");

  const [credInput, setCredInput] = useState({
    websiteURL: "",
    websiteName: "",
    email: "",
    username: "",
    password: ""
  });

  const [eCredInput, setECredInput] = useState({
    ewebsiteURL: "",
    ewebsiteName: "",
    eemail: "",
    eusername: "",
    epassword: ""
  });

  const [allCredential, setAllCredential] = useState({ data: [], masterUser: "" });
  const [viewModalData, setViewModalData] = useState({});
  const [encryptedCredId, setEncryptedCredId] = useState("");
  const [masterPassword, setMasterPassword] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  /**
   * Helper to build authorization headers safely
   */
  const getAuthHeaders = useCallback(() => {
    const token = authToken || localStorage.getItem("authToken") || "";
    const cleanToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return {
      "Content-Type": "application/json",
      Authorization: cleanToken
    };
  }, [authToken]);

  /**
   * Safe Session Expiration Handler
   */
  const handleSessionExpired = useCallback(() => {
    errorMessage("Session expired. Please log in again.");
    handleLogout();
  }, [handleLogout]);

  /**
   * Fetch all credentials for current user
   */
  const allCred = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/credential`, {
        method: "GET",
        headers: getAuthHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && (data.success || data.status === "success")) {
        setAllCredential(data);
      } else {
        errorMessage(data.message || "Failed to load credentials");
      }
    } catch (error) {
      errorMessage(error.message || "Network error loading credentials");
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, handleSessionExpired]);

  /**
   * Create and encrypt a new credential
   */
  const handleNewCred = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    if (!credInput.username.trim() || !credInput.password) {
      errorMessage("Username and Password are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/credential/encryptPass`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(credInput)
      });

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && (data.success || data.status === "success")) {
        successMessage(data.message || "Credential saved successfully!");
        setCredInput({
          websiteURL: "",
          websiteName: "",
          email: "",
          username: "",
          password: ""
        });
        await allCred();
      } else {
        errorMessage(data.message || "Failed to save credential");
      }
    } catch (error) {
      errorMessage(error.message || "Network error saving credential");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Verify master password
   */
  const handleVerifyMasterPass = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!masterPassword) {
      errorMessage("Please enter your master password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/credential/verifyMasterPass`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: masterPassword })
      });

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && data.isVerified) {
        setIsModal("viewCred");
        setMasterPassword("");
      } else {
        errorMessage(data.message || "Invalid master password");
      }
    } catch (error) {
      errorMessage(error.message || "Error verifying master password");
    }
  };

  /**
   * Decrypt password for a specific credential
   */
  const handleDecrypedPass = useCallback(async (credId) => {
    if (!credId) return null;

    setIsDecrypting(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${encodeURIComponent(credId)}`,
        {
          method: "GET",
          headers: getAuthHeaders()
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return null;
      }

      const data = await res.json();
      if (res.ok && (data.success || data.status === "success")) {
        setViewModalData(data.data);
        return data.data;
      } else {
        errorMessage(data.message || "Failed to decrypt credential");
        return null;
      }
    } catch (error) {
      errorMessage(error.message || "Network error during decryption");
      return null;
    } finally {
      setIsDecrypting(false);
    }
  }, [getAuthHeaders, handleSessionExpired]);

  /**
   * Update an existing credential
   */
  const handleUpdateCred = async (e, credId) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isUpdating) return;

    if (!credId) {
      errorMessage("Missing credential identifier");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${encodeURIComponent(credId)}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            websiteURL: eCredInput.ewebsiteURL,
            websiteName: eCredInput.ewebsiteName,
            email: eCredInput.eemail,
            username: eCredInput.eusername,
            password: eCredInput.epassword
          })
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && (data.success || data.status === "success")) {
        setIsModal("");
        successMessage(data.message || "Credential updated successfully!");
        setECredInput({
          ewebsiteURL: "",
          ewebsiteName: "",
          eemail: "",
          eusername: "",
          epassword: ""
        });
        await allCred();
      } else {
        errorMessage(data.message || "Failed to update credential");
      }
    } catch (error) {
      errorMessage(error.message || "Network error updating credential");
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Delete a credential
   */
  const handleDeleteCred = async (credId) => {
    if (!credId || isDeletingId) return;

    setIsDeletingId(credId);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${encodeURIComponent(credId)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && (data.success || data.status === "success")) {
        successMessage(data.message || "Credential deleted successfully!");
        await allCred();
      } else {
        errorMessage(data.message || "Failed to delete credential");
      }
    } catch (error) {
      errorMessage(error.message || "Network error deleting credential");
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <CredContext.Provider
      value={{
        credInput,
        setCredInput,
        allCredential,
        allCred,
        handleNewCred,
        isModal,
        setIsModal,
        viewModalData,
        setViewModalData,
        masterPassword,
        setMasterPassword,
        handleVerifyMasterPass,
        handleDecrypedPass,
        encryptedCredId,
        setEncryptedCredId,
        eCredInput,
        setECredInput,
        handleUpdateCred,
        handleDeleteCred,
        isLoading,
        isSubmitting,
        isUpdating,
        isDeletingId,
        isDecrypting
      }}
    >
      {children}
    </CredContext.Provider>
  );
};

export default CredState;
