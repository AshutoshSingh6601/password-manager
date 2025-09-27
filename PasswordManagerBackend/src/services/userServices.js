import Users from "../models/Users.js"
import ApiResponse from "../utils/apiResponse.js"
import jwt from "jsonwebtoken";
import { hashMasterPassword, verifyMasterPassword } from "../utils/common.js"


export const getLoginService = async (req, res) => {
    try {
        // const getLoginServiceData = await Users.find().select('-_id')
        const getLoginServiceData = await Users.find({}, {username: 1, email: 1, password: 1, _id: 0})
        return ApiResponse.success(res, getLoginServiceData, 'successful fetching login data')
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}

export const createRegisterService = async(registerData, res) => {
    try {
        const hashedPassword = await hashMasterPassword(registerData.password)
        // const payload = {
        //     username: registerData.username
        // }
        // const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30m'})

        const createRegisterServiceData = await Users.create({...registerData, password: hashedPassword})
        return ApiResponse.success(res, 'User Register successfully 🤗', 200)
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}

export const createLoginService = async(loginData, res) => {
    try {
        const hashedPassword = await Users.findOne({username: loginData.username})
        if(hashedPassword){
            const payload = {
                username: loginData.username
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30m'})
            const VerifyPassword = await verifyMasterPassword(loginData.password, hashedPassword.password)
            if(VerifyPassword){
                return res.status(200).json({status: "success", message: 'User Login successfully 🤗', token: token })
                // return ApiResponse.success(res, {token: token}, 'User Login successfully 🤗', 200)
            }
        }
        return ApiResponse.error(res, "Invalid Credential 😒", 400) 
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)   
    }

}


