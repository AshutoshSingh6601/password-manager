import '../pages/Login/Login.css'

const CustButton = ({type, label, className, onClick}) => {
  return (
    <>
      <button className={`bg-[#2575fc] hover:bg-[#6a11cb] p-[0.75rem] rounded-[6px] font-[600] text-[1rem] border-none text-amber-50  transition-[background] cursor-pointer duration-300 ${className}`} onClick={onClick} type={type}>{label}</button>
    </>
  )
}

export default CustButton

