// this file contains all connections to server
// res.setHeader("Content-Type","application/json"); converts info to json
//import express so u can use it
const express = require("express");
const {store, Todo} = require("./model"); // importing both objects 'store' and 'Todo'
const cors = require("cors");

// initialize your app/server
const app = express();

app.use(cors());
app.use(express.static("static"));

// tell our app to use json
app.use(express.json({}));

app.use((req, res, next)=>{
    console.log("Time", Date.now(), "- Method", req.method, "- Path", req.originalUrl, "- Body", req.body);
    next();
});

// gets all information under /todo
app.get("/todo",(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("getting all todos")

    // could implement this for better validation
    // /todo?name='isaac'
    let findQuery = {};
    console.log(req.query)
    // name query /todo?name=
    if(req.query.name !== null && req.query.name !== undefined){
        // use RegExp?
        // for loop? 
        findQuery.name = req.query.name;
    }
    // description query /todo?description=
    if(req.query.description !== null && req.query.description !== undefined){
        findQuery.description = req.query.description;
    }
    console.log(findQuery.description)
    // deadline(date) query
    if(req.query.deadline !== null && req.query.deadline !== undefined){
        findQuery.deadline = req.query.deadline;
    }
    // done query
    if(req.query.done !== null && req.query.done !== undefined){
        // .done is a boolean. need to stop the conversion from bool to str when requesting
        findQuery.description = req.query.done;
    }
    

    // find{} means find everything
    Todo.find(findQuery, function(err,todos){
        if(err){
            console.log("there was an error finding a todo object")
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find todo ${req.params.id}`,
                    error: err,
                })
            );
            return;
        }

        res.status(200).send(JSON.stringify(todos));
    });
});

// get - gets the todo with the given id
app.get("/todo/:id", (req,res)=>{
    res.setHeader("Content-Type","application/json");
    Todo.findById(req.params.id, (err, todo)=>{
        if(err) { // is error true?
            console.log("there was an error finding a todo with id")
            res.status(500).send(
                JSON.stringify({
                    message: `unable to find todo with id ${req.params.id}`,
                    error: err,
                })
            );
            return;
        } else if (todo === null){
            res.status(404).send(
                JSON.stringify({
                    message: `todo = null`,
                    error: err,
                })
            )
            return;
        }
        // can also do res.send(200).json(todo) {helper function} 
        res.status(200).send(JSON.stringify(todo));
    });
});

// get the entire boyd
app.get("/body", (req,res)=>{

})



//post - creates one todo (does not have a URL param)
app.post('/todo', function(req,res){
    res.setHeader("Content-Type","application/json");
    console.log(`creating a todo:`, req.body);

    // test cases
    // 1. struct posts [empty] when given an undefined field ex: "hello": "hi"
    // 2. want to NOT be able to post an empty struct
    // 3. request entity too large error, whats the limit?
    // 4. inputs for fields can be "x = 18;" etc... don't want this no characters like: $%#^!*(#()#)+_= and so on


    //require a name attribute
    if(req.body.name === null || req.body.name === "" || req.body.name === undefined){
        console.log("unable to create todo no info given")
            res.status(500).send(
                JSON.stringify({
                    message: `unable to create todo no info given`,
                    error: err,
                })
            );
            return;
    }
    

    
    let creatingTodo = { // when user 'posts' info thru a field, this is the variable it will be stored in.
        name: req.body.name || "", // 'or' placeholder: empty string
        description: req.body.description || "",
        done: req.body.done || false,
        deadline: req.body.deadline || new Date(), // default for a deadline is Date.now() if user doesnt send info
    }

    Todo.create(creatingTodo, (err, todo)=>{
        if (err) {
            console.log("unable to create todo")
            res.status(500).send(
                JSON.stringify({
                    message: `unable to create todo`,
                    error: err,
                })
            );
            return;
        }
        res.status(201).send(JSON.stringify(todo))
    })
});

//delete by id
app.delete('/todo/:id', function(req,res){
    res.setHeader("Content-Type","application/json");
    console.log("deleting:", req.params.id, "by id")

    //test cases:
    // 1. delete request on dir /todo doesnt delete all, i want to throw error when this is done
    
    Todo.findByIdAndDelete(req.params.id, function(err,todo){
        if (err) {
            console.log("unable to delete todo")
            res.status(500).send(
                JSON.stringify({
                    message: `unable to delete todo`,
                    error: err,
                })
            );
            return;
        } else if (todo === null || todo === undefined){
            console.log("unable to delete todo with id", req.params.id)
            res.status(404).send(
                JSON.stringify({
                    message: `unable to find todo`,
                    error:err,
                })
            )
            return;
        }
        res.status(200).send(`todo is deleted ${todo}`); // send back the obj attribute that was deleted
    })
});

//patch by id
app.patch('/todo/:id', function(req,res){
    console.log(`updating todo with id: ${req.params.id} with body`, req.body);

    //test cases:
    // 1. struct posts [empty] when given an undefined field ex: "hello": "hi"
    // 2. patch with no new info for fields, i need to throw an error specifically for that case


    let updateTodo = {}; // empty object
    //name
    if(req.body.name !== null && req.body.name !== undefined){
        updateTodo.name = req.body.name; // this is where i am setting the name to the empty updateTodo obj
    }
    //description
    if(req.body.description !== null && req.body.description !== undefined){
        updateTodo.description = req.body.description;
    }
    //done
    if(req.body.done !== null && req.body.done !== undefined){
        updateTodo.done = req.body.done;
    }
    //deadline
    if(req.body.deadline !== null && req.body.deadline !== undefined){
        updateTodo.deadline = req.body.deadline;
    }
    
    Todo.updateOne(
        { _id: req.params.id }, //filter for the object by id
        {$set: updateTodo}, // update the object but only the thing i want updated not the whole obj
        function(err, updateResult){
            if (err) {
                console.log("unable to patch todo")
                res.status(500).send(
                    JSON.stringify({
                        message: `unable to patch todo`,
                        error: err,
                    })
                );
                return;
            } else if(updateResult.n === 0){
                res.status(404).send(
                    JSON.stringify({
                        message: `unable to find todo`,
                        error: err,
                    })
                );
                return;
            }
            console.log(updateResult)
            // did it exist?
            //what happens when success
            res.status(200).send(`todo is updated ${updateResult}`);
        });
});

//put by id
app.put('/todo/:id', function(req,res){
    console.log(`replacing todo with id ${req.params.id}`)

    // test cases:
    // 1. using PUT on an empty struct shouldn't work
    // 2. i want to be able to PUT a new struct same as post as long as its not empty {must have an _id when generated}

    let updateTodo = {
        name: req.body.name || "", // 'or' placeholder: empty string
        description: req.body.description || "",
        done: req.body.done || false,
        deadline: req.body.deadline || new Date(), // default for a deadline is Date.now() if user doesnt send info
    }

    Todo.updateOne({ _id: req.params.id }, updateTodo, function(err, updateResult){
            if (err) {
                console.log("unable to put todo")
                res.status(500).send(
                    JSON.stringify({
                        message: `unable to put todo`,
                        error: err,
                    })
                );
                return;
            } else if(updateResult.n === 0){
                res.status(404).send(
                    JSON.stringify({
                        message: `unable to find todo`,
                        error: err,
                    })
                );
                return;
            }
            console.log(updateResult)
            // did it exist?
            //what happens when success
            res.status(200).send(`todo is updated`);
        });
});

module.exports = app; // export app variables