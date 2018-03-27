const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
    _id : new ObjectID(),
    text : "First todo"
},{
    _id : new ObjectID(),
    text : "Second todo"
}];

//beforeEach((done)=>{Todo.remove({}).then(()=>done())});
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
        done();
    });
})

describe("Post /todos",()=>{
    it("should create a new todo",(done)=>{
        var text = "Test todo text";
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err)=>done(err));
            });
    });    
    it("should not create a todo with invalid body data",(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err)
                    return done(err);
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err)=>done(err));
            });
    })
});

describe("Get /todos",()=>{
    it("should get all todos",(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("Get /todos/:id",()=>{
    it("should get todo with given id",(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)    //.get(<string format>). Hence used toHexString()
            .expect(200)
            .expect((res)=>{
                expect(res.body.docs.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it("should return 404 if todo not found",(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            // .expect((res)=>{
            //     expect(res.body.err).toBe("Id not found");
            // })
            .end(done);
    });
    it("should return 404 for non-object id's",(done)=>{
        request(app)
            .get('/todos/12azc')
            .expect(400)
            .expect((res)=>{
                expect(res.body.err).toBe("Invalid ID via objectID");
                //expect(res.body.err).toBe("Invalid ID");
            })
            .end(done);
    })
});