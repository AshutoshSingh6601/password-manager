import { Slide, toast } from "react-toastify";

/**
 * Format message string safely from strings, errors, or objects
 */
const formatMessage = (msg, defaultText) => {
  if (!msg) return defaultText;
  if (typeof msg === "string") return msg;
  if (msg.message && typeof msg.message === "string") return msg.message;
  if (Array.isArray(msg) && msg.length > 0) {
    return msg.map((m) => (typeof m === "string" ? m : m.message || JSON.stringify(m))).join(", ");
  }
  return defaultText;
};

export const successMessage = (message) => {
  return toast.success(formatMessage(message, "Operation completed successfully"), {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide
  });
};

export const errorMessage = (message) => {
  return toast.error(formatMessage(message, "An unexpected error occurred"), {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide
  });
};

export const infoMessage = (message) => {
  return toast.info(formatMessage(message, "Information"), {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide
  });
};
