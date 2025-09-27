import { createCredService, decryptCredService, getCredService } from "../services/credentialServices.js"
import ApiResponse from "../utils/apiResponse.js"

export const createCred = (req, res) => {
    const { website, email, username, password } = req.body
    const user = req.MasterUsername
    if(!user){
        ApiResponse.error(res, "User not found 😒", 400)
    }
    if(!username || !password){
        ApiResponse.error(res, "Invalid Credential 😒", 400)
    }
    try {
        const credData = createCredService({user, website, email, username, password}, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}


export const decryptCred = (req, res) => {
    
    try {
        const credData = decryptCredService(req.query, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}


export const getCred = (req, res) => {
    
    try {
        const credData = getCredService(req.MasterUsername, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}