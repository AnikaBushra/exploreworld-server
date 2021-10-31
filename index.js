const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;



// middleWare 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z11va.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel-places');
        const placeCollection = database.collection('places');
        const clientCollection = database.collection('user');
        const tripCollection = database.collection('addtrip');

        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });
        // post api 
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await clientCollection.insertOne(newUser);
            console.log('hitting the post', req.body);
            res.json(result);
        });

        // get api add trip 
        app.get('/addtrip', async (req, res) => {
            const cursor = tripCollection.find({});
            const trips = await cursor.toArray(cursor);
            res.send(trips);
        })

        // post api add trip 
        app.post('/addtrip', async (req, res) => {
            const trip = req.body;
            const result = await tripCollection.insertOne(trip);
            console.log(trip);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
})