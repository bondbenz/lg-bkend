require('dotenv').config({ path: './src/configs/config.env' });

const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./src/configs/db.config.js');
const routes = require('./src/routes/router.js');

const PORT = process.env.PORT || 7000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ 'message': err.message });

    return;
});


// perform a database connection when the server starts
dbo.connectToServer(function (err) {
    if (err) {
        console.error(err);
        process.exit();
    }

    // start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
});
