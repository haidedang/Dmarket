const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config = require('./utils/config'); 
import DMarketService from './utils/dMarketService';
import App from './routes/app.routes'; 

let server = require('http').createServer(app);
let dMarket = new DMarketService(); 

// MongoDB Connection
mongoose.connect(config.mongoURL, error => {
    if (error) {
        console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
        throw error;
    }
});

mongoose.set('debug', true);

app.use('/api', App); 

server.listen(config.port, async function () {
    console.log(`Server started on port ${config.port}`)
    // create Dummy Data on the Blockchain, several Dummy Apps and Apis. 

    await dMarket.init();
    
})

