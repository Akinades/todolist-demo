const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

module.exports.connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connect: ${conn,connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
        
    }

const todoSchema = new mongoose.Schema({
    name : String
})
module.exports.todolist = mongoose.model("Todolist", todoSchema);


const customtodoSchema = new mongoose.Schema({
    name : String,
    items: [todoSchema]
   
});
module.exports.customtodo = mongoose.model("CustomTodolist", customtodoSchema);