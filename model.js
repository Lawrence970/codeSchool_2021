// this file is where all the data[types] go
const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({ // this is a schema. it contains all datatypes
    name: String,
    description: String,
    done: Boolean,
    deadline: Date,
});

const Todo = mongoose.model("Todo", todoSchema); // setting the variable Todo to the todoSchema and naming it "Todo"

let store = {};

module.exports = {
    Todo,   // can export specific functions of the object ex: Todo.findbyid,
    store,  // i am exporting the ENTIRE object when doing it this way.
}
