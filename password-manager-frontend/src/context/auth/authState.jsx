import { useState } from "react";
import AuthContext from "./authContext";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../utils/AlertMessage";

const authState = ({children}) => {

    const [loginState, setLoginState] = useState({
        username: '',
        password: ''
    })

    const navigator = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        const header = {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json'  
            },
            body: JSON.stringify(loginState)
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/login`,header)
            const data = await res.json()
            if(data.status==="success"){
                console.log(data.token)
                localStorage.setItem('authToken', data.token)
                navigator('/home')
            }else{
                errorMessage(data.message)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }

    return(
        <AuthContext.Provider value={{loginState, setLoginState, handleLogin}}>
            {children}
        </AuthContext.Provider>
    )
}

export default authState