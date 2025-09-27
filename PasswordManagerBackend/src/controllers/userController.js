import { createLoginService, createRegisterService, getLoginService } from "../services/userServices.js"
import ApiResponse from "../utils/apiResponse.js"

export const getLogin = (req, res) => {
    try {
        const loginData = getLoginService(req, res)
        res
    } catch (error) {
        return ApiResponse.error(res, 'error fetching login data', 500)
    }
}

export const createRegister = (req, res) => {
    const { username, email, password } = req.body
    if(!username || !email || !password){
        return res.status(400).json({ message: "Invalid Credential 😒" })
    }
    try {
        const registerData = createRegisterService(req.body, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}

export const createLogin = (req, res) => {
    const { username, password } = req.body
    if(!username || !password){
        return res.status(400).json({ message: "Invalid Credential 😒" })
    }
    try {
        const loginData = createLoginService(req.body, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}
