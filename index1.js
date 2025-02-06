const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");


const SECRET_KEY = "mayanktyagiji";
const users = [];

app.use(express.json());
app.use(cors());

// Serve static files (CSS, JS, etc.) from the "public" folder
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username: username,
        password: password,
        todo:[]
    });
    res.json({
        message: "Thank you for Signing Up"
    });
});

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find((user) =>user.username == username && user.password == password);
    if (user) {
        const token = jwt.sign({
            username: username
        }, SECRET_KEY);

        res.json({
            token: token
        });
    } else {
        res.status(401).json({
            message: "User does not Exist"
        });
    }
});

function auth(req, res, next) {
    const token = req.headers.token;
        try {
            const verifiedToken = jwt.verify(token, SECRET_KEY);
            if (verifiedToken) {
                req.username = verifiedToken.username;
                next();
            } else {
                res.status(403).json({ message: "Token does not match" });
                }
        } catch (e) {
            res.status(403).json({ message: "Token does not match" });
        }

}


app.get("/todo",auth,function (req, res) {
    res.sendFile(__dirname+"/Todo.html")
});

app.post("/add",auth,function(req,res){
    const title=req.body.title
    const checkbox_value=req.body.checkbox_value
    const username=req.username
    const user = users.find((user)=>user.username==username)
    if(user){
        user.todo.push({
            title:title,
            checkbox_value:checkbox_value
        })
        res.json({
            message:"Todo added successfully"});  
    } else {
        res.status(404).json({message:"User not found"}); 
    }
})

app.get("/todos",auth, function (req, res) {
    const username = req.username;
    const user = users.find((user) => user.username === username);
    if (user) {
        res.json(user.todo);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.put("/updatecheckbox",auth,function(req,res){
    const index = req.body.index
    const checkbox_value= req.body.checkbox_value
    const username = req.username
    const user = users.find((user)=>user.username==username)
    if(user){
        user.todo[index].checkbox_value=checkbox_value
        res.json({
            message: "updated success"
        })
    }else{
        res.json({
            message:"failed to update"
        })
    }
})
app.put("/updateTitle",auth,function(req,res){
    const index = req.body.index
    const title= req.body.title
    const username = req.username
    const user = users.find((user)=>user.username==username)
    if(user){
        user.todo[index].title=title
        res.json({
            message: "updated success"
        })
    }else{
        res.json({
            message:"failed to update"
        })
    }
})

app.delete("/deletetodo",auth,function(req,res){
    const index = req.body.index
    const username = req.username
    const user = users.find((user)=>user.username==username)
    if(user){
        user.todo.splice(index,1)
        res.json({
            message: "deleted success"
        })
    }else{
        res.json({
            message:"failed to delete"
        })
    }

})



app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

