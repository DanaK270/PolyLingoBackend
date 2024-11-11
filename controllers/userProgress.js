const {User, UserProgress} = require('../models')


const createUserProgress = async (req, res) =>{
  try{
  const userProg = await UserProgress.create({...req.body}) 
  res.send(UserProgress)
}catch(error){
  throw(error)
}
}

const GetUserProgress = async (req, res) =>{
 try{
  const userProg = await UserProgress.find({}).populate('User')
  res.send(userProg)
 }
 catch(error){
  throw(error)
 }
}

module.exports = {
  createUserProgress,
  GetUserProgress
}