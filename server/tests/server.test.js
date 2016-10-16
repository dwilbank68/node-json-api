const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

const todos = [{text:'First test todo'},{text:'Second test todo'}];

beforeEach((done)=>{
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Eat a bug';
        request(app)
            .post('/todos')
            .send({text})                               // 1
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);       // 2
            })
            .end((err, res)=>{
                if (err) { return done(err); }
                Todo.find({text})
                    .then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(err => done(err));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=>{
                if (err) {return done(err);}
                Todo.find()
                    .then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            })
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

// 1 - supertest sends the ES6 object as JSON
// 2 - this expect is the imported library, not a method from supertest