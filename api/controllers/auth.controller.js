import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if(!email || !password || !name){
      throw new Error('All fields are required');
    }
    const userAlreadyexist = await User.findOne({email});
    if(userAlreadyexist){
      return res.status(400).json({success: false, message: 'User Already exists'});
    }
  } catch (error) {
    return res.status(400).json({success: false, message: error.message});
  }
}
export const login = async (req, res) => {
    res.send('signin-route');
  }
export const logout = async (req, res) => {
    res.send('signout-route');
  }