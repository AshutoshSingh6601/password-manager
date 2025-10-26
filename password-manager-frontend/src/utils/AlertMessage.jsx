import { Bounce, Slide, toast } from "react-toastify";

export const successMessage = (message) => {
    return(
        toast.success(message || 'saved successfully', {
            position: "top-center", //top-right
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide, //Bounce
        })
    )
}

export const errorMessage = (message) => {
    return(
        toast.error(message || 'Not Saved', {
            position: "top-center", //top-right
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide, //Bounce
        })
    )
}