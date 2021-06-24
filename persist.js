
// where all the DATA base connection is
const mongoose = require("mongoose");
const db = mongoose.connection;

function connect() {
    // password for cluster myCoolPassword
    let connectionString = (`mongodb+srv://todo_2021:myCoolPassword@raider144.ia1un.mongodb.net/todo_2021_DB?retryWrites=true&w=majority`)

    console.log("connecting to raider144...")
    mongoose
        .connect(connectionString,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err)=>{
            console.log("there was an error connecting to mongo: ", err)
        });
}

// on this db connection, once open, run the 'callback'
// a wrapper method
function onConnect(callback){
    db.once("open", callback);
}

// export as an object
module.exports = {
    "connect": connect,
    "onConnect": onConnect
}