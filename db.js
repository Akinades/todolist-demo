const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://admin-carbon:Apisit25421@cluster0.ioc3qa5.mongodb.net/todolistDB", {useNewUrlParser: true,});
console.log("database connection established"); 

const todoSchema = new mongoose.Schema({
    name : String
})
module.exports.todolist = mongoose.model("Todolist", todoSchema);


const customtodoSchema = new mongoose.Schema({
    name : String,
    items: [todoSchema]
   
});
module.exports.customtodo = mongoose.model("CustomTodolist", customtodoSchema);