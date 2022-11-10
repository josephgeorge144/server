const express= require('express')
const app =express();
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const helmet =require('helmet')
const morgan=require('morgan')
const userRoute=require('./routes/users')
const authRoute=require('./routes/auth')
const postsRoute=require('./routes/posts')
const multer  = require('multer')
const path=require('path')
var cors = require('cors');


dotenv.config()
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology:true },(err)=>{
    if(err)console.log(err);
    else console.log(' database connected');
})
app.use('/images',express.static(path.join(__dirname,'public/images')))
app.use(express.json());
app.use(helmet());
app.use(morgan('common'))
app.use(cors());
let changedName;

//file Uploading : multer is used forx
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
 
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    changedName=Date.now()+'aha'+file.originalname 
    cb(null,changedName )
    console.log('hii down');
    
    }
  })

////
const upload = multer({ storage })// this is destination folder in your local storage/server
app.post('/upload',upload.single('file'), function (req, res, next) {
    console.log(req.body.name)

    try{
        return res.status(200).json({cn:changedName})
    }
    catch(err){console.log(err);}
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })
  

app.use('/user',userRoute)
app.use('/auth',authRoute)
app.use('/post',postsRoute)

app.listen(process.env.PORT || 8800,()=>{
    console.log('server is conneceted');
})

