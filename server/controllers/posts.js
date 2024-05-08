const  mongoose  = require('mongoose');
const postMessage = require('../models/postMessage.js')

const getPost =async (req , res) => {
    const {id} = req.params ;
    try{

        const post = await postMessage.findById(id)
        res.status(200).json(post)
        

    }catch(e){
        res.status(404).json({message : e.message})
    }
}

const getPosts = async(req ,res) =>{
    const {page} = req.query ;
    try{
        const LIMIT = 6 ;
        const startIndex = (Number(page)-1) * LIMIT
       
        const total = await postMessage.countDocuments({});

        const posts =await postMessage.find().sort({_id : -1}).limit(LIMIT).skip(startIndex) ; // get the newest post first
        const numberOfPages = Math.ceil(total / LIMIT) ;
        res.status(200).json({ data : posts , currentPage : Number(page) , numberOfPages : numberOfPages }) ;

    }catch(e){
        res.status(404).json({message : e.message}) ;
    }
 } 

 // QUERY -> /posts?page=1 -> page = 1 
 //PARAMS -> /posts/123 -> id = 123

const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query ;
    console.log(searchQuery)

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await postMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data : posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}



const createPost = async(req ,res) =>{
    const post = req.body ;
    const newPost = new postMessage({  creator : req.userId , createdAt : new Date().toISOString() , ...post }) ;
    try{
        await newPost.save() ;
        res.status(201).json(newPost)
    }catch(e){
        res.status(409).json({message : e.message}) ;
    }
}



const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await postMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}



const deletePost = async (req ,res) => {
    const { id  } = req.params ;

    if(!mongoose.Types.ObjectId.isValid(id)) res.status(404).send('No post with that id');
    
    await postMessage.findByIdAndRemove( id ) ;
    console.log('delete')
    res.json({message : 'post deleted successfully'}) ;

}

const likePost = async( req, res) => {
    const { id } = req.params ;
    if(!req?.userId){
        return res.json({message : 'Unauthenticated'})
    }
    if(!mongoose.Types.ObjectId.isValid(id)) res.status(404).send('No post with that id');

    const post = await postMessage.findById(id) ;
    const index = post.likes.findIndex((id)=>id === String(req.userId))
    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id) => id != String(req.userId))
    }
    const updatedPost = await postMessage.findByIdAndUpdate(id ,post, {new : true} )
    
    res.json(updatedPost)
}


module.exports = {getPosts ,getPost , getPostsBySearch , createPost , updatePost , deletePost , likePost}