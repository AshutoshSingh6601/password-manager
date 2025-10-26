import express from 'express'
import authToken from '../middlewares/authMiddleware.js'
import { createCred, decryptCred, deleteSpecificCred, getAllCreds, getCred, updateSpecificCred, verifyMasterPass } from '../controllers/credentialController.js'

const router = express.Router()

router.post('/encryptPass' , authToken, createCred)

router.post('/verifyMasterPass' , authToken, verifyMasterPass)

router.get('/credView' , authToken, decryptCred)

router.get('/getAllCreds' , authToken, getAllCreds)

router.put('/credView' , authToken, updateSpecificCred)

router.delete('/credView' , authToken, deleteSpecificCred)

router.get('/' , authToken, getCred)


export default router