import { useEffect, useState } from "react";
import AuthContext from "./authContext";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../utils/AlertMessage";

const authState = ({children}) => {

    const [loginState, setLoginState] = useState({
        email: '',
        username: '',
        password: ''
    })

    const [authToken, setAuthToken] = useState(()=>`Bearer ${localStorage.getItem("authToken")}` || '')
    
    useEffect(() => {
      const token = localStorage.getItem("authToken");
      setAuthToken(`Bearer ${token}`)
    }, [authToken]);
    

    const [loginType, setLoginType] = useState('login')

    const navigator = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        const header = {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json'  
            },
            body: JSON.stringify({username: loginState.username, password: loginState.password })
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/login`,header)
            const data = await res.json()
            if(data.status==="success"){
                console.log(data.token)
                setLoginState({
                    username: '',
                    password: ''
                })
                setAuthToken(`Bearer ${localStorage.setItem('authToken', data?.token)}`)
                // localStorage.setItem('authToken', `Bearer ${data.token}`)
                navigator('/home')
            }else{
                errorMessage(data.message)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }

    const handleSignIn = async(e) => {
        e.preventDefault()
        const header = {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json'  
            },
            body: JSON.stringify(loginState)
        }
        try {
            const res = await fetch(`${BASE_URL}/api/v1/login/register`,header)
            const data = await res.json()
            if(data.status==="success"){
                successMessage(data.message)
                setLoginState({
                    email: '',
                    username: '',
                    password: ''
                })
                setLoginType('login')
            }else{
                errorMessage(data.message)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }

    const handleLogout = async(e)=> {
        localStorage.removeItem("authToken")
        navigator('/')
    }

    return(
        <AuthContext.Provider value={{loginState, setLoginState, handleLogin, handleSignIn, loginType, setLoginType, handleLogout, authToken, setAuthToken, }}>
            {children}
        </AuthContext.Provider>
    )
}

export default authState