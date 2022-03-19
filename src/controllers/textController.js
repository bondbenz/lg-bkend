const dbo = require('../configs/db.config.js');

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
    dbConnect
        .collection("texts")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                return res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
}

module.exports = {
    getTexts,
    insertText,
}