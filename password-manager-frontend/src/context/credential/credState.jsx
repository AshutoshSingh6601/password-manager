import { useContext, useEffect, useState } from "react";
import CredContext from "./credContext";
import { BASE_URL } from "../../config";
import { errorMessage, successMessage } from "../../utils/AlertMessage";
import authContext from "../auth/authContext";

const credState = ({ children }) => {

  const { authToken, setAuthToken } = useContext(authContext)

  // for closing modal
  const [isModal, setIsModal] = useState("");

  const [credInput, setCredInput] = useState({
    websiteURL: "",
    websiteName: "",
    email: "",
    username: "",
    password: "",
  });

  const [eCredInput, setECredInput] = useState({
    ewebsiteURL: "",
    ewebsiteName: "",
    eemail: "",
    eusername: "",
    epassword: "",
  });

  const [allCredential, setAllCredential] = useState([]);

  const [viewModalData, setViewModalData] = useState({});

  const [encryptedCredId, setEncryptedCredId] = useState({});

  const [masterPassword, setMasterPassword] = useState("");

  const autoLogout = () => {
    window.alert("Session expired. Logging out.");
    if(true){
        localStorage.removeItem("authToken");
        window.location.replace("/");
    }
  }

  const allCred = async () => {
    const header = {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
    };
    try {
      const res = await fetch(`${BASE_URL}/api/v1/credential`, header);
      const data = await res.json();
      
    // ✅ Manually handle HTTP errors
    //     if (!res.ok) {
    //   const errData = await res.json();
    //   throw new Error( `HTTP Error: ${res.status}`);
    // }

      if (data?.status === "success") {
        setAllCredential(data);
      }
      if (res.status === 401 || res.status === 403) {
        autoLogout();
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleNewCred = async (e) => {
    e.preventDefault();
    const header = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    //   body: JSON.stringify({ ...credInput, website: credInput.url }),
      body: JSON.stringify(credInput),
    };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/encryptPass`,
        header
      );
      const data = await res.json();
      console.log("new cred", data);
      if (data.status === "success") {
        allCred();
        successMessage(data.message);
        setCredInput({
            websiteURL: "",
            websiteName: "",
            email: "",
            username: "",
            password: "",
        });
      }else if (res.status === 401 || res.status === 403) {
        autoLogout();
      }
       else {
        errorMessage(data.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleVerifyMasterPass = async (e) => {
    e.preventDefault();
    const header = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({ password: masterPassword }),
    };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/verifyMasterPass`,
        header
      );
      const data = await res.json();
      console.log(data);
      if (data.isVerified) {
        setIsModal("viewCred");
      } else {
        errorMessage(data.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleDecrypedPass = async (credId) => {
    // e.preventDefault()
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      // body: JSON.stringify({password: masterPassword})
    };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${credId}`,
        header
      );
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        setViewModalData(data.data);
        successMessage("decrypted successfully");
      } else {
        errorMessage(data.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleUpdateCred = async (e,credId) => {
    e.preventDefault()
    const header = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
      body: JSON.stringify({ websiteURL: eCredInput.ewebsiteURL, websiteName: eCredInput.ewebsiteName, email: eCredInput.eemail, username: eCredInput.eusername, password: eCredInput.epassword })
    };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${credId}`,
        header
      );
      const data = await res.json();
      console.log("new cred", data);
      if (data.status === "success") {
        setIsModal('')
        allCred();
        successMessage(data.message);
        setECredInput({
            ewebsiteURL: "",
            ewebsiteName: "",
            eemail: "",
            eusername: "",
            epassword: "",
        });
      } else {
        errorMessage(data.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleDeleteCred = async (credId) => {
    // e.preventDefault()
    const header = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    };
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/credential/credView?credId=${credId}`,
        header
      );
      const data = await res.json();
      if (data.status === "success") {
        // setIsModal('')
        successMessage(data.message)
        allCred();
      } else {
        errorMessage(data.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  }


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
      }}
    >
      {children}
    </CredContext.Provider>
  );
};

export default credState;
