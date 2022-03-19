const res = require('express/lib/response');
const dbo = require('../configs/db.config.js');
var ObjectId = require('mongodb').ObjectId; 

async function getText(textId){
    const dbConnect = dbo.getDb();
    return await new Promise(resolve => {
        try {
            dbConnect.
                collection("texts").
                findOne({ _id: ObjectId(textId) }, function (err, result) {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(result);
                    }
                });
        } catch {
            resolve(false);
        }
        
    });
    
}

module.exports = {
    getText
}