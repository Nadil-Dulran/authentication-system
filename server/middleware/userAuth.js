import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Unauthorized access. Login required.'});
    }

    try{
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecoded.id){
            req.body.userId = tokenDecoded.id;
        } else {
            return res.json({success: false, message: 'Unauthorized access. Login required.'});
        }
        next();
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export default userAuth;