import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
export const userRoute = exp.Router();

//Register user
userRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "USER" });
  //send res
  res.status(201).json({ message: "user created", payload: newUserObj });
});


//Read all articles protected route
userRoute.get('/articles',verifyToken,async(req,res)=>{
  try{
  // get all the articles
  const allArticles=await ArticleModel.find().populate("author","firstName")
  let allActiveArticles=[]
  for(let eachArticle of allArticles){
    if(eachArticle.isArticleActive){
      allActiveArticles.push(eachArticle)
    }
  }
  res.status(200).json({message:"all active articles",payload:allActiveArticles})
}catch(err){
  return res.status(400).json({message:err.message})
}
})

// Add comment to an article protected route
userRoute.put('/articles',async (req,res)=>{
  // read articleId & comment
  const articleId=req.body.articleId;
  const comment=req.body.comment;
  // get the article
  const article=await ArticleModel.findById(articleId);
  article.comments.push(comment);
  // update the article
  const updatedArticle=await ArticleModel.findByIdAndUpdate(
    {_id:articleId},
    {$push :{comments:comment}},
    {new:true},
  );
  // send response
  res.status(200).json({message:"new comment added ",payload:updatedArticle})

})

