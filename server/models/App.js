const mongoose = require('mongoose'); 
 
var Schema = mongoose.Schema;

const appSchema = new Schema({
    appID: { type: 'String' },
    author: { type: 'String' },
    name: {type: 'String'},
    description: {type: 'String'},
    downloadLink : {type: 'String'}, 
    appReleases : [{type: 'String'}]
}, {timestamps: true});

let App = mongoose.model('App', appSchema);

export default App; 

