const Blog = require('../models/blog')
const asynHandler = require('express-async-handler')


const viewBlog = asynHandler(async(req,res)=>{
    const {bid} = req.params

    const response = await Blog.findByIdAndUpdate(bid,{$inc: {numberViews: 1}},{new:true})

    return res.status(200).json({
        success: response? true : false,
        mess:response? response: 'Some thing went wrong!'
    })
})

const createBlog = asynHandler(async(req,res)=>{
    const {title, description} = req.body

    if(!title || !description) throw new Error('Missing Input!')

    const response = await Blog.create(req.body)

    return res.status(200).json({
        success: response? true : false,
        mess:response? response: 'Some thing went wrong!'
    })
})

const updateBlog = asynHandler(async(req,res)=>{
    if(Object.keys(req.body).length==0) throw new Error('Missing Input!')
    const {bid} = req.params
    const response = await Blog.findByIdAndUpdate(bid,req.body,{new: true})

    return res.status(200).json({
        success: response? true : false,
        mess:response? response: 'Some thing went wrong!'
    })
})

//dislike
const dislikeBlog = asynHandler(async(req,res)=>{
    const {_id} = req.user

    const {bid} = req.params
    if(!bid) throw new Error('Missing input')
    const blog = await Blog.findById(bid)
    
    const isLiked = blog.likes.find((el)=>el.toString() === _id)
    if(isLiked){
        await Blog.findByIdAndUpdate(bid,{$pull: {likes: _id}},{new:true})
    }

    const dislikedBlog = blog.dislikes.find((el)=>el.toString()=== _id)
    if(dislikedBlog){
        const response = await Blog.findByIdAndUpdate(bid,{$pull: {dislikes: _id}},{new:true})
        return res.status(200).json({
            success: response? true : false,
            mess: response? response: 'Some thing went wrong!'
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{$push: {dislikes: _id}},{new:true})
        return res.status(200).json({
            success: response? true : false,
            mess: response? response: 'Some thing went wrong!'
        })
    }
})

//like
const likeBlog = asynHandler(async(req,res)=>{
    const {_id} = req.user

    const {bid} = req.params
    if(!bid) throw new Error('Missing input')
    const blog = await Blog.findById(bid)
    
    const isDisliked = blog.dislikes.find((el)=>el.toString() === _id)
    if(isDisliked){
        await Blog.findByIdAndUpdate(bid,{$pull: {dislikes: _id}},{new:true})
    }
    
    const likedBlog = blog.likes.find((el)=>el.toString()=== _id)
    if(likedBlog){
        const response = await Blog.findByIdAndUpdate(bid,{$pull: {likes: _id}},{new:true})
        return res.status(200).json({
            success: response? true : false,
            mess: response? response: 'Some thing went wrong!'
        })
    }else{
        const response = await Blog.findByIdAndUpdate(bid,{$push: {likes: _id}},{new:true})
        return res.status(200).json({
            success: response? true : false,
            mess: response? response: 'Some thing went wrong!'
        })
    }
})
module.exports={
    viewBlog,
    createBlog,
    updateBlog,
    dislikeBlog,
    likeBlog
}
