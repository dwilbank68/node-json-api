const express = require("express");
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

// app.use((req, res, next)=> {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method} ${req.url}`;
//     console.log(log);
//     next();
// })

app.post('/todos', (req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save()
        .then(
            (doc)=>{
                res.send(doc);
            },
            (err)=>{
                res.status(400).send(err);
            }
        )
})

app.get('/todos', (req,res)=>{
    Todo.find()
        .then(
            (todos)=>{
                res.send({todos})
            },
            (err)=>{
                res.status(400).send(err);
            }
        )
})

app.get('/todos/:id', (req,res)=>{

    var id = req.params.id

    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id)
        .then((todo)=>{
            if (!todo) { return res.status(404).send(); }
            res.send({todo})
        })
        .catch((err)=>{
            res.status(400).send();
        })
})

if (!module.parent) {
    app.listen(port, ()=>{
        console.log('running on port ' + port);
    })
}



module.exports = {app};