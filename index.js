const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const dbConnect = require('./db/db');
const userModel = require('./models/user');
const regretsModel = require('./models/regrets');
const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());
dotenv.config();

app.get('/', async (req, res) => {
    res.send('Regrets Vault API. Check out the documentation at /docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = userModel.create({ username, email, password: hash });
                let token = jwt.sign({ email, username }, process.env.JWT_SECRET);
                return res.status(201).send({ message: "Registration Successful", token });
            })
        })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.send('User not found');
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email, username: user.username }, process.env.JWT_SECRET);
                return res.send({ message: "Login Successful", token });
            }
            else {
                return res.send("Invalid Credentials");
            }
        })
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.send('Internal Server Error');
    }
});

app.post('/regrets', isAuthenticated, async (req, res) => {
    const { title, message, regretLevel, isPublic } = req.body;
    const email = req.user.email;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const regret = await regretsModel.create({ user: user._id, title, message, regretLevel, isPublic });
        return res.status(201).send({
            success: true,
            message: "Regret created successfully",
            data: {
                user: regret.user,
                title: regret.title,
                message: regret.message,
                regretLevel: regret.regretLevel,
                isPublic: regret.isPublic
            }
        });
    }
    catch {
        return res.status(500).send('Internal Server Error');
    }
});

function isAuthenticated(req, res, next) {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).send('Unauthorized, Access Denied');
        }
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            return res.status(400).send('Invalid Token');
        }
    }
    else {
        res.status(401).send('Unauthorized, Access Denied');
    }
}

app.get('/regrets',async (req,res)=>{
    try {
        const regrets = await regretsModel.find();
        const public_regrets = regrets.filter(regret => {
            if (regret.isPublic) {
                return true;
            }
        });
        if (public_regrets.length === 0) {
            return res.status(404).send('No public regrets found');
        }
        return res.status(200).send({count: public_regrets.length, regrets: public_regrets});
    }
    catch{
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, async () => {
    try {
        await dbConnect();
        console.log('Database connected successfully');
    }
    catch (err) {
        console.error('Database connection failed:', err);
    }
    console.log('Server is running on port 3000');
});