const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true,
    },
    category:[
        {
            type:mongoose.Types.ObjectId,
            ref:'BlogCategory'
        }
    ],
    numberViews:{
        type:Number,
       default:0
    },
    likes:[
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes:[
        {
            type: mongoose.Types.ObjectId,
            ref:'User'
        }
    ],
    author:{
        type:String,
        default:'admin'
    },
    image:{
        type:String,
        default:'https://img.freepik.com/free-photo/blue-surface-with-study-tools_23-2147864592.jpg?semt=ais_hybrid'
    }
},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
//Export the model
module.exports = mongoose.model('Blog', blogSchema);