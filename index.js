const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnj3g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('err', err)
    const jobsCollection = client.db("jobHunting").collection("jobs");
    const applicantsCollection = client.db("jobHunting").collection("applicants");

    app.post('/addJob', (req, res) => {
        const newJob = req.body;
        jobsCollection.insertOne(newJob)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/jobs', (req, res) => {
        jobsCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    });

    app.get('/job/:id', (req, res) => {
        jobsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addApplicant', (req, res) => {
        const applicant = req.body;
        applicantsCollection.insertOne(applicant)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })


    app.get('/yourJobs', (req, res) => {
        applicantsCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/applicant/:id', (req, res) => {
        applicantsCollection.find({ jobId: req.query.id })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/', (req, res) => {
        res.send('Internship World!')
      })

});

app.listen(process.env.PORT || port)