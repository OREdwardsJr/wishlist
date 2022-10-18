const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const CONN = "mongodb+srv://oredwardsjr:9in4qM6GiDnyJUW9@cluster0.ua6g7as.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(CONN, (err, client) => {
    useUnifiedTopology: true;

    if (err) return console.error(err);

    console.log('Connected to Database');

    const db = client.db('wishlist-entries');
    const wishlistCollection = db.collection('wishlists');

    // express request handlers
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.sendFile(__dirname + "/index.html")
    });

    app.post('/', (req, res) => {
        wishlistCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/');
            })
            .catch(error => console.error(error));
    });

    app.listen(3000, () => {
        console.log('Listening on 3000')
    });
})

console.log("May the node be with you");