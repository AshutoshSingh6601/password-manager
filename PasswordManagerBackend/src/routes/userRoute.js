import express from 'express'
import { createLogin, createRegister, getLogin } from '../controllers/userController.js'

const router = express.Router()

router.get('/', getLogin)

router.post('/register', createRegister)

router.post('/', createLogin)

export default router