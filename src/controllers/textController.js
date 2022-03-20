const dbo = require('../configs/db.config.js');
const helper = require('../services/text.service.js');
const utils = require('../utils/helper.js');
var ObjectId = require('mongodb').ObjectId;

async function insertText(req, res, next) {
    const dbConnect = dbo.getDb();
    const textDocument = {
        text_ar: req.body.text_ar || '',
        text_fr: req.body.text_fr || '',
        text_en: req.body.text_en || '',
        state: 'draft'
    }
    dbConnect
        .collection("texts")
        .insertOne(textDocument, function (err, result) {
            if (err) {
                res.status(400).send("Error inserting text!");
            } else {
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
                return;
        }
    }


    const textQuery = { _id: ObjectId(req.params.textId) };
    let updates = {
        text_ar: req.body.text_ar,
        text_fr: req.body.text_fr,
        text_en: req.body.text_en,
        state: req.body.state,
    };

    // Clean body from undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    dbConnect
        .collection("texts")
        .updateOne(textQuery, { $set: updates }, function (err, _result) {
            if (err) {
                res.status(400).send(`Error updating text with id ${textQuery._id}!`);
            } else {
                res.status(204).send('ok');
            }
        });

}

async function fetchTotalWords(req, res, next) {
    let textDocument = false;
    await helper.getText(req.params.textId).then(result => {
        textDocument = result;
    });
    if (!textDocument) return res.status(400).send('Text not found.');
    const totalWords = {
        totalWordsAr: textDocument.text_ar.split(' ').length,
        totalWordsEn: textDocument.text_en.split(' ').length,
        totalWordsFr: textDocument.text_fr.split(' ').length,
    }
    res.json(totalWords);
}

async function fetchTotalWordsLanguage(req, res, next) {
    let textDocument = false;
    let totalWords = 0;
    await helper.getText(req.params.textId).then(result => {
        textDocument = result;
    });
    if (!textDocument) return res.status(400).send('Text not found.');
    switch (req.params.language) {
        case 'ar':
            totalWords = textDocument.text_ar.split(' ').length;
            break;
        case 'en':
            totalWords = textDocument.text_en.split(' ').length;
            break
        case 'fr':
            totalWords = textDocument.text_fr.split(' ').length;
            break;
        default:
            return;
    }
    res.json({ totalWords: totalWords });
}

async function fetchMostOccurent(req, res, next) {
    let textDocument = false;
    await helper.getText(req.params.textId).then(result => {
        textDocument = result;
    });
    if (!textDocument) return res.status(400).send('Text not found.');

    const mostOccurrent = {
        mostOccurrentAr: utils.mostOccurrentWord(textDocument.text_ar),
        mostOccurrentEn: utils.mostOccurrentWord(textDocument.text_en),
        mostOccurrentFr: utils.mostOccurrentWord(textDocument.text_fr),
    }
    res.json(mostOccurrent);
}


async function searchText(req, res, next) {
    const dbConnect = dbo.getDb();
    const query = req.query.q;
    if (!query) return res.status(400).send('Please specify your query paramater.');

    dbConnect.
        collection('texts').
        aggregate([
            {
                $search: {
                    "text": {
                        "query": query,
                        "path": ["text_ar", "text_fr", "text_en"],
                        "fuzzy": {}
                    }

                }

            }
        ]).
        toArray(function (err, result) {
            if (err) res.status(400).send(err);
            else res.json(result);
        })
}

module.exports = {
    getTexts,
    insertText,
    updateText,
    fetchTotalWords,
    fetchTotalWordsLanguage,
    fetchMostOccurent,
    searchText
}