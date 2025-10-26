import { useContext } from 'react'
import './Login.css'
import CustInput from '../../components/CustInput'
import CustButton from '../../components/CustButton'
import authContext from '../../context/auth/authContext'

function Login() {

  const { loginState, setLoginState, handleLogin, loginType, setLoginType, handleSignIn } = useContext(authContext)

  

    const handleOnChange = (e) => {
        setLoginState({...loginState, [e.target.name]: e.target.value})
    }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add login logic here
    alert(`Username: ${loginState.username}\nPassword: ${loginState.password}`)
  }

  return (
    // <div className="bg-linear-to-r from-[#6a11cb] to-[#2575fc] flex items-center justify-center min-h-dvh">
    <div className="flex items-center justify-center min-h-dvh bg-sky-50">
      <form className="w-[95%] mx-auto sm:w-[350px] p-4 sm:p-[2rem] flex flex-col rounded-xl inset-ring inset-ring-zinc-200 bg-zinc-50 gap-5 " onSubmit={loginType === 'signin' ? handleSignIn : handleLogin}>
        {/* <h2 className="login-title bg-(--color-avocado-400)">Sign In</h2> */}
        <h2 className="text-center text-[#2575fc] text-[2rem] font-bold">{loginType === 'signin' ? 'Sign In' : "Login"}</h2>
        {loginType === 'signin' &&
          <CustInput type='email' placeholder="Email" className='flex flex-col gap-1' label='Email' name='email' value={loginState.email} onChange={handleOnChange} />
        }
        <CustInput type='text' placeholder="Username" className='flex flex-col gap-1' label='Username' name='username' value={loginState.username} onChange={handleOnChange} />
        <CustInput type='password' placeholder="Password" className='flex flex-col gap-1' label='Password' name='password' value={loginState.password} onChange={handleOnChange} />
        <CustButton type='submit' label={loginType === 'signin' ? 'Sign in' : 'Login'} className='w-full' />
        
        {loginType === 'signin' ? <p>Already have an account? <span className='text-blue-500 cursor-pointer' onClick={()=>setLoginType('login')}>Login</span></p> : <p>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={()=>setLoginType('signin')}>Sign up</span></p>}
        {/* <button className="login-btn" type="submit">Login</button> */}
      </form>
    </div>
  )
}

export default Login