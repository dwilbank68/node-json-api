const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

const todos = [
    {_id:ObjectID(), text:'First test todo', completed: false, completedAt: null},
    {_id:ObjectID(), text:'Second test todo', completed: true, completedAt: 333}
];

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const users = [
    {
        _id: user1Id,
        email:'user1@example.com',
        password:'password',
        tokens: [{
            access:'auth',
            token: jwt.sign({_id:user1Id, access:'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: user2Id,
        email:'user2@example.com',
        password:'password2 '
    }
]

const populateTodos = (done) => {
    Todo
        .remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
}

const populateUsers = (done) => {
    User
        .remove({})
        .then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo])
        })
        .then(() => {
            done();
        })

}

module.exports = {
    todos, populateTodos, users, populateUsers
};