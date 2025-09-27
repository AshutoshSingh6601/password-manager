import { useContext } from 'react'
import './Login.css'
import CustInput from '../../components/CustInput'
import CustButton from '../../components/CustButton'
import authContext from '../../context/auth/authContext'

function Login() {

  const { loginState, setLoginState, handleLogin } = useContext(authContext)

    const handleOnChange = (e) => {
        setLoginState({...loginState, [e.target.name]: e.target.value})
    }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add login logic here
    alert(`Username: ${loginState.username}\nPassword: ${loginState.password}`)
  }

  return (
    <div className="bg-linear-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center min-h-dvh">
      <form className="w-[350px] p-[2rem] rounded-[12px] flex flex-col shadow bg-blue-50 gap-5 " onSubmit={handleLogin}>
        {/* <h2 className="login-title bg-(--color-avocado-400)">Sign In</h2> */}
        <h2 className="text-center text-[#2575fc] text-[2rem] font-bold">Sign In</h2>
        <CustInput type='text' className='flex flex-col gap-1' label='Username' name='username' value={loginState.username} onChange={handleOnChange} />
        <CustInput type='password' className='flex flex-col gap-1' label='Password' name='password' value={loginState.password} onChange={handleOnChange} />
        <CustButton type='submit' label='Login' className='w-full' />
        
        {/* <button className="login-btn" type="submit">Login</button> */}
      </form>
    </div>
  )
}

export default Login