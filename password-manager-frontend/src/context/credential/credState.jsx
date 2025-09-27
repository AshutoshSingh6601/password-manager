import { useState } from "react";
import CredContext from "./credContext";
import { BASE_URL } from "../../config";
import { errorMessage, successMessage } from "../../utils/AlertMessage";

const credState = ({children})=> {

    const Token = localStorage.getItem('authToken')

    const authToken = `Bearer ${Token}`

    // for closing modal
    const [isModal, setIsModal] = useState('')

    const [credInput, setCredInput] = useState({
        url: '',
        email: '',
        username: '',
        password: ''
    })

    const [allCredential, setAllCredential] = useState([])

    const [viewModalData, setViewModalData] = useState({})

    const [masterPassword, setMasterPassword] = useState('')

    const allCred = async() => {
        const header={
            method: "GET",
            headers:{
                Authorization: authToken,
            },
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/credential`, header)
            const data = await res.json()
            console.log('fetch all cred', data)
            if(data.status === "success"){
                setAllCredential(data.data)
            }else{
                errorMessage(data.message)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }

    const handleNewCred = async(e) => {
        e.preventDefault()
        const header = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            body: JSON.stringify({...credInput, website: credInput.url} )
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/credential/encryptPass`, header)
            const data = await res.json()
            console.log("new cred", data)
            if(data.status === "success"){
                allCred()
                successMessage(data.message)
            }else{
                errorMessage(data.message)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }

    

    return(
        <CredContext.Provider value={{credInput, setCredInput, allCredential, allCred, handleNewCred, isModal, setIsModal, viewModalData, setViewModalData, masterPassword, setMasterPassword}}>
            {children}
        </CredContext.Provider>
    )
}

export default credState