import mongoose from "mongoose";

interface Post extends mongoose.Document{
  content: string;
  photos?: string[];
  creator: mongoose.Types.ObjectId;
  createdAt? : Date; 
}

export default Post;