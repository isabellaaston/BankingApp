const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const port = 3010;
const app = express();
var jsonParser = bodyParser.json();
const url = 'mongodb://localhost:27017';

var addCustomer = (db, dataToSend) => {
    let collection = db.collection('customers');
    collection.insertOne(dataToSend);
}

var updateBalance = (db, personName, changeAmount) => {
    let collection = db.collection('customers');
    collection.updateOne({name: personName}, {$inc:{balance: changeAmount}});
}

var transferMoney = (db, personName, personName2, changeAmount) => {
    let collection = db.collection('customers');
    collection.updateOne({name: personName}, {$inc:{balance: changeAmount}});
    collection.updateOne({name: personName2}, {$inc:{balance: ~changeAmount}});
}

app.put('/balancetransfer', jsonParser, (req, res) => {
    const personName = req.body.name;
    const addAmount = req.body.amount;
    const personName2 = req.body.name2;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('Connected');
        let db = client.db('bank');
        let result = transferMoney(db, personName, personName2, addAmount);
    });
})

app.put('/customers', jsonParser, (req, res) => {
    const personName = req.body.name;
    const addAmount = req.body.amount;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('Connected');
        let db = client.db('bank');
        let result = updateBalance(db, personName, addAmount);
    });
})

app.post('/customers',jsonParser, (req, res) => {
    const newPersonName = req.body.name;
    const newPersonBalance = req.body.balance;
    const dataToSend = {
        name: newPersonName,
        balance: newPersonBalance
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('Connected');
        let db = client.db('bank');
        let result = addCustomer(db, dataToSend);
    });
});

app.listen (port, () => {
    console.log('Go');
});