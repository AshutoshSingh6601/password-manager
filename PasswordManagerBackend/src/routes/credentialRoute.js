import express from 'express'
import authToken from '../middlewares/authMiddleware.js'
import { createCred, decryptCred, getCred } from '../controllers/credentialController.js'

const router = express.Router()

router.post('/encryptPass' , authToken, createCred)

router.get('/credView' , authToken, decryptCred)

router.get('/' , authToken, getCred)


export default router