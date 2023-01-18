require('dotenv').configure();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var db = require("./db");
const _ = require("lodash");
const PORT = process.env.PORT || 3000;

const app = express();

app.set( 'view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended : true})); 
app.use(express.static("public"))

const guide1 =  db.todolist({name : "Welcome to do lists"});
const guide2 =  db.todolist({name : "Hit + button to add new items"});
const guide3 =  db.todolist({name : "<<< hit this to delete items"});
const guidtodo = [guide1,guide2,guide3]

//var day = date.getDate();

app.get("/",function(req,res){
   db.todolist.find({},(err, foundItem)=>{
    if(foundItem.length ===0){
      db.todolist.insertMany(guidtodo,(err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default item to db");
        }
      })
    }
    res.render("index" , { kindofday : "Today" , newListItems : foundItem})
   })
   
});



app.post("/",function(req,res){
   
   
   const itemName  = req.body.newItem ;
   const itemlist  = req.body.list;
   const todo = new db.todolist({name : itemName});
   
          if( itemlist === "Today"){
            todo.save();
            res.redirect("/");
            console.log("Matches today");
          }else{
            db.customtodo.findOne({name : itemlist},(err, foundlist)=>{
               foundlist.items.push(todo);
               foundlist.save();
               res.redirect("/" + itemlist);
               console.log("Add list to custom list completed");
              
          });
        }
        
      
  
   });
  

app.post("/detele",(req,res)=>{


  const checkboxid = req.body.checkboxName ;
  const listCustom = req.body.listCustom;

      if( listCustom === "Today" ){
       db.todolist.findByIdAndDelete(checkboxid,(err)=>{
          if(err){
            console.log ("error deleting")
          }else{
            res.redirect("/");
          console.log("delete completed");
            
          }
        });
      }else{
         db.customtodo.findOneAndUpdate({name : listCustom},{$pull:{items:{_id:checkboxid}}},(err)=>{
          if(!err){
            res.redirect("/" + listCustom);
            console.log("delete completed");
          }else{
            console.log ("error deleting")
          }
            

         });

      }
  
});
//Custom list of items
app.get("/:customList",(req,res)=>{
  const customList = _.capitalize(req.params.customList) ;
  db.customtodo.findOne({name : customList},(err,foundcustom)=>{
      if(!err){
        if(!foundcustom){
          const customitem = new db.customtodo({
            name : customList,
            items: guidtodo
          });
          customitem.save();
          res.redirect("/"+customList);
          console.log("Created new path");
        }
        else{
         
          res.render("index" , { kindofday : foundcustom.name , newListItems : foundcustom.items });
          
          console.log("show path on database");
        }
       
      }
      console.log(customList);
  })
 
  
});

db.connectDB().then(()=>{
  app.listen(PORT,function(){
    console.log(`Server is running on port :${PORT}`);
  });
})
