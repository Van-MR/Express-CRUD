const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const path = require('path')

const db = require('./db')
const collection = 'todo'

app.use(express.static('public'))

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'))
})

app.post('/',(req,res) => {
   const userInput = req.body
   console.log(userInput)

   db.getDB().collection(collection).insertOne(userInput,(err,result) => {
      if(err){
        console.log(err);
      }else{
         res.json({result:result,document:result.ops[0]})
      }
   })

})

app.delete('/:id',(req,res) => {
  const todoID =  req.params.id
  db.getDB().collection(collection).findOneAndDelete({_id:db.getPrimaryKey(todoID)},(err,result) => {
      if(err){
        console.log(err);
      }else{
        res.json(result);
      }
  })
})

app.get('/getTodos',(req,res) => {
    db.getDB().collection(collection).find({}).toArray((error,documents) => {
        if(error) {
          console.log(error);
        }else{
           console.log(documents);
           res.json(documents)
        }
    })
})

app.put('/:id',(req,res) => {
  // Primary Key of Todo Document we wish to update
  const todoID = req.params.id;
  // Document used to update
  const userInput = req.body;
  // Find Document By ID and Update
  db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {todo : userInput.todo}},{returnOriginal : false},(err,result)=>{
      if(err)
          console.log(err);
      else{
          res.json(result);
      }
  });
})

//error hanle middleware
app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error : {
            message : err.message
        }
    });
})


db.connect((err) => {
   if(err){
     console.log('unable to connect database')
     process.exit(-1)
    }else{
        app.listen(3000,() => {
  	    console.log('connect to database, app listenning at port 3000')
      })
    }
})
