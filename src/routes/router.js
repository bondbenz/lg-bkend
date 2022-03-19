const express = require('express');
const router = express.Router();
const dbo = require('../configs/db.config.js');
const textController = require('../controllers/textController.js');

router.get("/text", textController.getTexts);
router.post("/text", textController.insertText);
router.put("/text/:textId", textController.updateText);
router.get("/text/:textId/count", textController.fetchTotalWords);
router.get("/text/:textId/count/:language", textController.fetchTotalWordsLanguage);

router.get('/test', (req, res) => {
    res.send('Birds home page')
})

module.exports = router;