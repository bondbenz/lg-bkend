const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController.js');

router.get("/text", textController.getTexts);
router.post("/text", textController.insertText);
router.put("/text/:textId", textController.updateText);
router.get("/text/:textId/count", textController.fetchTotalWords);
router.get("/text/:textId/count/:language", textController.fetchTotalWordsLanguage);
router.get("/text/:textId/mostOccurrent", textController.fetchMostOccurent);
router.post("/text/search", textController.searchText);


module.exports = router;