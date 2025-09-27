import jwt from "jsonwebtoken";

const authToken = (req, res, next) => {
    // const token = req.header('auth-token')?.split(' ')[1]; //Extract token from "Authorization: Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1]; //Extract token from "Authorization: Bearer <token>"

    if(!token){
        return res.status(403).json({ message: 'No token, authorization denied' });
    }

    // const tokenVerify = jwt.verify(token, process.env.JWT_SECRET)

    // console.log(tokenVerify)

    // req.body.user = user?.username

    // next()

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.MasterUsername = user?.username
        next()
    })
}

export default authToken

