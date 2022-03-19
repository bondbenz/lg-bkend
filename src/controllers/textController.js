const dbo = require('../configs/db.config.js');
const helper = require('../services/text.service.js');
var ObjectId = require('mongodb').ObjectId; 

async function insertText(req, res, next) {
    const dbConnect = dbo.getDb();
    const textDocument = {
        text_ar: req.body.text_ar || 'None',
        text_fr: req.body.text_fr || 'None',
        text_en: req.body.text_en || 'None',
        state: 'draft'
    }
    dbConnect
        .collection("texts")
        .insertOne(textDocument, function (err, result) {
            if (err) {
                res.status(400).send("Error inserting text!");
            } else {
                console.log(`Added a new text with id ${result.insertedId}`);
                res.status(204).send(`Added a new text with id ${result.insertedId}`);
            }
        });
}

async function getTexts(req, res, next) {
    const dbConnect = dbo.getDb();
    const limit = parseInt(req.query.limit) || 1;
    const page = (parseInt(req.query.page) - 1) * limit || 0;
    dbConnect
        .collection("texts")
        .find({})
        .skip(page)
        .limit(limit)
        .toArray(function (err, result) {
            if (err) {
                return res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
}


async function updateText(req, res, next) {
    const dbConnect = dbo.getDb();
    let textDocument = false;
    await helper.getText(req.params.textId).then(result => {
        textDocument = result;
    });
    if (!textDocument) return res.status(400).send('Text not found.');

    // Check if new state arrives
    if (req.body.state) {
        // Draft state
        switch (textDocument.state) {
            case 'draft':
                if (req.body.state !== 'submitted') return res.status(400).send('Bad state provided.');
                break;
            case 'submitted':
                if (req.body.state !== 'rejected' || req.body.state !== 'approved') return res.status(400).send('Bad state provided.');
            case 'rejected':
                if (req.body.state !== 'submitted') return res.status(400).send('Bad state provided.');
                break;
            default:
                return res.status(400).send('Invalid state provided.')
        }
    }

    const textQuery = { _id: ObjectId(req.params.textId) };
    const updates = {
        $set: {
            state: req.body.state
        }
    };

    dbConnect
        .collection("listingsAndReviews")
        .updateOne(textQuery, updates, function (err, _result) {
            if (err) {
                res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                res.status(204).send('ok');
            }
        });
    
}

module.exports = {
    getTexts,
    insertText,
    updateText,
}