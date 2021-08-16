const express = require('express')
const router = express.Router()
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check_auth')

// total get user
router.get('/', async (req, res) => {
    
    try{
        const users = await userModel.find()

        res.status(200).json({
            msg : "get users",
            count : users.length,
            userInfo : users.map(user => {
                return {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get user
router.get('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findById(id)

        if(!user){
            return rse.status(402).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "get user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// sign up
router.post('/signup', async (req, res) => {

    // 회원가입을 할 때 input에 작성하는 name, email, password 에 대한 data를 가지고 온 것 
    const { name, email, password } = req.body

    try{
        // email 중복 확인
        const user = await userModel.findOne({eamil})

        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password 
            })

            await user.save()

            res.status(200).json({
                msg : "success signup",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    // login 했을 때는 email, password만 input하기 때문에 
    const { email, password } = req.body
    
    try{
        // email 중복 확인
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            // 작성한 password가 곧 isInputPassword가 되고 그 password랑 db에 저장된 password를 비교해서 match 진행 여부를 확인한다.
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    // give token 
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn : '1h'}
                    )

                    res.status(200).json({
                        msg : "success login",
                        tokenInfo : token
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update user
router.patch('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    
    try{
        const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!user){
            return res.status(402).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "update user by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// total delete user
router.delete('/', async (req, res) => {

    try{
        await userModel.remove()
        
        res.status(200).json({
            msg : "delete users"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete user
router.delete('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove(id)

        if(!user){
            return res.status(402).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete user by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router