const express = require('express')
const router = express.Router()
const boardModel = require('../model/board')
const multer = require('multer')
const checkAuth = require('../middleware/check_auth')

const storage = multer.diskStorage({

    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer({
    storage : storage,
    limit : {
        filesize : 1024*1024*5
    },
    fileFilter : fileFilter
})

// total get board
router.get('/', async (req, res) => {
    
    try{
        const boards = await boardModel.find()
                        .populate('user', ['email'])

        res.status(200).json({
            msg : "get boards",
            count : boards.length,
            boardInfo : boards.map(board => {
                return {
                    id : board._id,
                    user : board.user,
                    board: board.board,
                    boardImage : board.boardImage
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

// detail get board
router.get('/:boardId', checkAuth, async (req, res) => {

    try{

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// register board
router.post('/', checkAuth, upload.single('boardImage'), async (req, res) => {

    const { user, board } = req.body

    const newBoard = new boardModel({
        user,
        board,
        boardImage : req.file.path
    })

    try{
        const board = await newBoard.save()

        res.status(200).json({
            msg : "register board",
            boardInfo : {
                id : board._id,
                user : board.user,
                board : board.board,
                boardImage : board.boardImage
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update board
router.patch('/:boardId', checkAuth, async (req, res) => {

    const id = req.params.boardId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const board = await boardModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!board){
            return res.status(402).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "update board by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// total delete board4
router.delete('/', async (req, res) => {
    
    try{
        await boardModel.remove()

        res.status(200).json({
            msg : "delete boards"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete board
router.delete('/:boardId', checkAuth, async (req, res) => {

    const id = req.params.boardId

    try{
        const board = await boardModel.findOneAndRemove(id)

        if(!board){
            return res.status(402).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete board by id: " + id
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