// server.js
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://trungtcgcs220288:abcd1234@cluster0.i8766dm.mongodb.net/'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        //CREATE: 
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs') 
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        //READ:
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', { quotes: results })
                })
                .catch(/* ... */)
        })

        //CREATE:
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })
        
        //UPDATE:
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => res.json('Success'))
            .catch(error => console.error(error))
        })

        //DELETE:
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                res.json(`Deleted Darth Vadar's quote`)
            })
            .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })



