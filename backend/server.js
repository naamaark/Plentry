const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')
const {queryRecipes}= require('./services/search.recipe.service')


const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
app.use(express.json())
app.use(session)
app.use(express.static('public'));

app.get('/puki', (req, res) => res.send('Hello Puki'))
app.get('/api/recipe', async (req, res) => {
    const recipes = await queryRecipes(['tomato', 'cucumbar'])
    res.send(recipes)
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}


// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })


// const logger = require('./services/logger.service')
const port = process.env.PORT || 8080
http.listen(port, () => {
    console.log('Server is running on port: ' + port)
})