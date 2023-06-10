const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

/*------MongoDB start----------*/

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const cartCollection = client.db('summerCampDB').collection('carts');
const usersCollection = client.db('summerCampDB').collection('users');

//users api
app.get('/users', async(req, res) =>{
    const result = await usersCollection.find().toArray();
    res.send(result);
})


app.post("/users", async(req, res) =>{
    const user = req.body;
    const query = {email: user.email}
    const existUser = await usersCollection.findOne(query);
    if(existUser){
        return res.send({message: 'user already exist'})
    }
    const result = await usersCollection.insertOne(user);
    res.send(result);
})

app.patch('/users/admin/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateDoc = {
        $set: {
            role: 'admin'
        },
    };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
})

app.delete('/users/:id', async(req, res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result);
})


//instructor api 
app.get('/instructors', async(req, res) => {
    const result = await instructorsCollection.find().toArray();
    res.send(result);
})

//classes api
app.get('/classes', async(req, res) => {
    const result = await classesCollection.find().toArray();
    res.send(result);
})

app.get('/whyShould', async(req, res) => {
    const result = await whyShouldCollection.find().toArray();
    res.send(result);
})


app.get('/instructors/:id', async (req, res) => {
    const id = req.params.id;  
    try {
      const instructor = await instructorsCollection.findOne({ _id: new ObjectId(id) });    
      res.send(instructor);
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  });

// add to cart  
app.get('/carts', async(req, res) => {
    const email = req.query.email;
    if(!email){
        res.send([]);
    }
    const query = {studentEmail: email};
    const result = await cartCollection.find(query).toArray();
    res.send(result);
});


app.post('/carts', async(req, res) => {
    const item = req.body;
    const result = await cartCollection.insertOne(item);
    res.send(result);
}) 

app.delete('/carts/:id', async(req, res) =>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await cartCollection.deleteOne(query);
    res.send(result);
})
// add to cart   
  
  







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