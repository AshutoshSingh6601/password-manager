import { createCredService, decryptCredService, deleteSpecificCredService, getAllCredsService, getCredService, updateSpecificCredService, verifyMasterPassService } from "../services/credentialServices.js"
import ApiResponse from "../utils/apiResponse.js"

export const createCred = (req, res) => {
    const { websiteURL, websiteName, email, username, password } = req.body
    const user = req.MasterUsername
    if(!user){
        ApiResponse.error(res, "User not found 😒", 400)
    }
    if(!username || !password){
        ApiResponse.error(res, "Please fill the required fields 😒", 400)
    }
    try {
        const credData = createCredService({user, websiteURL, websiteName, email, username, password}, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}


export const verifyMasterPass = (req, res) => {
    const { password } = req.body
    if(!password){
        ApiResponse.error(res, "Please fill the required fields", 400)
    }
    try {
        const credData = verifyMasterPassService({password, user: req.MasterUsername }, res)
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


export const updateSpecificCred = (req, res) => {
  const { credId } = req.query;
  const { websiteURL, websiteName, email, username, password } = req.body
    
    try {
        const credData = updateSpecificCredService({websiteURL, websiteName, email, username, password, credId}, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}


export const deleteSpecificCred = (req, res) => {    
    try {
        const credData = deleteSpecificCredService(req.query, res)
        res
    } catch (error) {
        return ApiResponse.error(res, error.message, 500)
    }
}


export const getAllCreds = (req, res) => {
    
    try {
        const credData = getAllCredsService(req.MasterUsername, res)
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