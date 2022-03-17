const express = require('express');
const router = express.Router();
const dbo = require('../configs/db.config.js');

router.route("/grades").get(async function (req, res) {
    const dbConnect = dbo.getDb();
    dbConnect
        .collection("grades")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });

});

router.get('/test', (req, res) => {
    res.send('Birds home page')
})

module.exports = router;