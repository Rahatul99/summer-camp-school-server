const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

/*------MongoDB start----------*/

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jp6ok1r.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();


const instructorsCollection = client.db('summerCampDB').collection('instructors');
const classesCollection = client.db('summerCampDB').collection('classes');
const whyShouldCollection = client.db('summerCampDB').collection('whyShould');

app.get('/instructors', async(req, res) => {
    const result = await instructorsCollection.find().toArray();
    res.send(result);
})

app.get('/classes', async(req, res) => {
    const result = await classesCollection.find().toArray();
    res.send(result);
})

app.get('/whyShould', async(req, res) => {
    const result = await whyShouldCollection.find().toArray();
    res.send(result);
})









        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

/*------MongoDB end----------*/

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})