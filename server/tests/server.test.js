const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//beforeEach((done)=>{Todo.remove({}).then(()=>done())});
beforeEach(populateTodos);
beforeEach(populateUsers);

// describe("Post /todos",()=>{
//     it("should create a new todo",(done)=>{
//         var text = "Test todo text";
//         request(app)
//             .post('/todos')
//             .send({text})
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.text).toBe(text);
//             })
//             .end((err,res)=>{
//                 if(err)
//                     return done(err);
//                 Todo.find({text}).then((todos)=>{
//                     expect(todos.length).toBe(1);
//                     done();
//                 }).catch((err)=>done(err));
//             });
//     });    
//     it("should not create a todo with invalid body data",(done)=>{
//         request(app)
//             .post('/todos')
//             .send({})
//             .expect(400)
//             .end((err,res)=>{
//                 if(err)
//                     return done(err);
//                 Todo.find().then((todos)=>{
//                     expect(todos.length).toBe(2);
//                     done();
//                 }).catch((err)=>done(err));
//             });
//     })
// });

// describe("Get /todos",()=>{
//     it("should get all todos",(done)=>{
//         request(app)
//             .get('/todos')
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.todos.length).toBe(2);
//             })
//             .end(done);
//     });
// });

// describe("Get /todos/:id",()=>{
//     it("should get todo with given id",(done)=>{
//         request(app)
//             .get(`/todos/${todos[0]._id.toHexString()}`)    //.get(<string format>). Hence used toHexString()
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.docs.text).toBe(todos[0].text);
//             })
//             .end(done);
//     });
//     it("should return 404 if todo not found",(done)=>{
//         var hexId = new ObjectID().toHexString();
//         request(app)
//             .get(`/todos/${hexId}`)
//             .expect(404)
//             .expect((res)=>{
//                 expect(res.body.err).toBe("Id not found");
//             })
//             .end(done);
//     });
//     it("should return 400 for non-object id's",(done)=>{
//         request(app)
//             .get('/todos/12azc')
//             .expect(400)
//             .expect((res)=>{
//                 expect(res.body.err).toBe("Invalid ID via objectID");
//                 //expect(res.body.err).toBe("Invalid ID");
//             })
//             .end(done);
//     })
// });

// describe("Delete /todos/:id",()=>{
//     var hexId = todos[0]._id.toHexString();
//     it("should remove a todo",(done)=>{
//         request(app)
//             .delete(`/todos/${hexId}`)
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.docs.text).toBe(todos[0].text)
//             })
//             .end((err,res)=>{
//                 if(err)
//                     return done(err);
//                 Todo.findById(hexId).then((doc)=>{
//                     expect(doc).not.toBeTruthy();
//                     done();
//                 }).catch((err)=>done(err));
//             });
//     });
//     it("should return 404 if todo not found",(done)=>{
//         request(app)
//             .delete(`/todos/${new ObjectID().toHexString()}`)
//             .expect(404)
//             .expect((res)=>{
//                 expect(res.body.err).toBe("Id not found");
//             })
//             .end(done);
//     });
//     it("should return 400 for invalid todo object-id's",(done)=>{
//         request(app)
//         .delete("/todos/1323VSB")
//         .expect(400)
//         .expect((res)=>{
//             expect(res.body.err).toBe("Invalid ID via objectID");
//         })
//         .end(done);
//     });
// });

// describe("PATCH /todos/:id",()=>{
//     it("should update a todo",(done)=>{
//         var hexId = todos[0]._id.toHexString();
//         var text = "This should be the new text";
//         request(app)
//             .patch(`/todos/${hexId}`)
//             .send({completed:true,text})
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.docs.text).toBe(text);
//                 expect(res.body.docs.completed).toBe(true);
//                 expect(typeof(res.body.docs.completedAt)).toBe('number');
//             })
//             .end(done);
//     });
//     it("should clear completedAt when todo is not completed",(done)=>{
//         var hexId = todos[1]._id.toHexString();
//         var text = "This should be the second text";
//         request(app)
//             .patch(`/todos/${hexId}`)
//             .send({completed:false,text})
//             .expect(200)
//             .expect((res)=>{
//                 expect(res.body.docs.text).toBe(text);
//                 expect(res.body.docs.completed).toBe(false);
//                 expect(res.body.docs.completedAt).not.toBeTruthy();
//             })
//             .end(done);
//     });
// });

describe("GET /users/me",()=>{
    it("should return a user if authenticated",(done)=>{
        request(app)
            .get("/users/me")
            .set("x-auth",users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it("should return a 401 if not authenticated",(done)=>{
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("POST /users",()=>{
    it("should create a user",(done)=>{
        var email = "qwer@1234.com";
        var pwd = "password1";
        request(app)
            .post("/users")
            .send({email,password:pwd})
            .expect(200)
            .expect((res)=>{
                expect(res.body).toBeTruthy();
                expect(res.headers["x-auth"]).toBeTruthy();
                // expect(res.body._id).toBeTruthy();
                // expect(res.body.email).toBe(email);
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                User.findOne({email}).then((user)=>{
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(pwd);
                    done();
                }).catch((err)=>done(err));
            });
    });
    it("should return validation errors if request is invalid",(done)=>{
        request(app)
            .post("/users")
            .send({email:"ade",password:"123"})
            .expect(400)
            .end(done);
    });
    it("should not create user if email is already in use",(done)=>{
        request(app)
            .post("/users")
            .send({email:users[0].email, password:"123abcd"})
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login",()=>{
    it("should login user and return auth token",(done)=>{
        request(app)
            .post("/users/login")
            .send({email : users[1].email, password : users[1].password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res)=>{
                if(err)
                    return done(err);
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toMatchObject({
                        access : 'auth',
                        token : res.headers['x-auth']
                    });
                    done();
                }).catch((err)=>done(err));
            })
    });
    it("should reject invalid login",(done)=>{
        request(app)
            .post("/users/login")
            .send({email:users[1].email,password:users[1].password+"1"})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end((err,res)=>{
                if(err)
                    return done(err);
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err)=>done(err));
            });
    });
});

// describe("DELETE users/me/token",()=>{
//     it("should remove auth token on logout",(done)=>{

//     });
// });