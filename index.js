const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const dbConnect=require('./db/db');
const userModel = require('./models/user');
const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());
dotenv.config();

app.get('/', async (req, res) => {
    res.send('Hello, World!');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if(user){
            return res.status(400).send('User already exists');
        }
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                let user=userModel.create({username, email, password: hash});
                let token=jwt.sign({email,username},process.env.JWT_SECRET);
                res.send({message: "Registration Successful",token});
            })
        })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    try{
        let user = await userModel.findOne({ email });
        if(!user){
            return res.send('User not found');
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token = jwt.sign({ email, username: user.username }, process.env.JWT_SECRET);
                res.send({ message: "Login Successful", token });
            }
            else{
                res.send("Invalid Credentials");
            }
        })
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.send('Internal Server Error');
    }
});

app.listen(3000, async () => {
    try{
        await dbConnect();
        console.log('Database connected successfully');
    }
    catch(err){
        console.error('Database connection failed:', err);
    }
    console.log('Server is running on port 3000');
});