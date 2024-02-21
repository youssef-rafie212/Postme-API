import mongoose from "mongoose";

interface Token {
  id: mongoose.Types.ObjectId;
  expiresIn: number;
}

export default Token;
