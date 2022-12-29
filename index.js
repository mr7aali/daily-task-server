const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//pass      PSdKAilRDhdpvg3t
//user   dailyTask


const uri = "mongodb+srv://dailyTask:PSdKAilRDhdpvg3t@cluster0.lopokh6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const mytaskCollection = client.db('dailyTask').collection('myTASK');
        const confirmedCollection = client.db('dailyTask').collection('confirmedTASK');

        app.post('/addTask', async (req, res) => {
            const addTask = req.body;
            const result = await mytaskCollection.insertOne(addTask);
            res.send(result);

        })



        app.put('/editTask', async (req, res) => {
            const addTask = req.body;
            console.log(addTask)


            const filter = {
                _id: ObjectId(addTask.id)
            }

            const option = { upsert: false };
            const updateDoc = {
                $set: {

                    TaskTitle: addTask.TaskTitle,
                    TaskSubTitle: addTask.TaskSubTitle,
                    StartTime: addTask.StartTime,
                    EndTime: addTask.EndTime,
                    TaskDescription: addTask.TaskDescription

                }
            }
            const result = await mytaskCollection.updateOne(filter, updateDoc, option);
            res.send(result)
            console.log(result);
        })














        app.get('/mytask', async (req, res) => {
            const quary = {};
            const result = await mytaskCollection.find(quary).toArray();

            res.send(result)
        })

        app.get('/confirmTask', async (req, res) => {
            const quary = { confirm: true };
            const result = await mytaskCollection.find(quary).toArray();
            console.log(result)
            res.send(result)
        })



        app.delete('/deleteTask', async (req, res) => {
            const terget = req.query.id;
            const query = { _id: ObjectId(terget) };
            const result = await mytaskCollection.deleteOne(query);
            console.log('delete api called');
            console.log(result)
            res.send(result);
        })







        app.put('/addConfirm', async (req, res) => {
            const terget = req.query.id;


            const filter = {
                _id: ObjectId(terget)
            }

            const option = { upsert: false };
            const updateDoc = {
                $set: {
                    confirm: true,

                }
            }
            const result = await mytaskCollection.updateOne(filter, updateDoc, option);
            res.send(result)
            console.log(result);
        })



    }
    finally {

    }
}


run().catch(err => console.error(err));

app.get('/', async (req, res) => {
    res.send('add your task is running');
})

app.listen(port, () => console.log('Add you task'));