var util = require('./dist/libphonenumberUtil.js');
var loadPhoneMeta = require('./dist/loadPhoneMeta');
var meta = loadPhoneMeta(['US']);
var handler = util.createHandler(meta);
