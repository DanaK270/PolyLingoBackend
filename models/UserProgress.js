const mongoose =  require('mongoose')

const userProgressSchema = new mongoose.SchemaType(
  {
    user_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
    // },
    // languages_id:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Language',
    //   required: true,
     },
    total_points:{ type: Number, required:true, default:0,},

    streaks:{ type: Number, required:true, default:0,},
  }
)

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
module.exports = UserProgress 