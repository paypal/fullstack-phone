var meta = require('./server').loadMeta(['US']);
var handler = require('./client').createPhoneHandler(meta);
