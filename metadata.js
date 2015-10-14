#!/usr/bin/env node

/*
Ported from work by Marco Faustinelli (contacts@faustinelli.net)
https://gist.github.com/Muzietto/62c3fc5a1c285f091654
*/

var fs = require('fs');
var vm = require('vm');

var outpath = process.argv[3];
fs.mkdirSync(outpath);

var metadata = fs.readFileSync(process.argv[2]);
var context = { goog: { provide: function() {} }, i18n: { phonenumbers: { metadata: {} } } };
vm.runInNewContext(metadata, context);

function writeFile(regionCode, countryToMetadata, countryCodeToRegionCodeMap) {
  var output = ["goog.provide('i18n.phonenumbers.metadata')"];
  output.push("i18n.phonenumbers.metadata.countryCodeToRegionCodeMap = " + JSON.stringify(countryCodeToRegionCodeMap));
  output.push("i18n.phonenumbers.metadata.countryToMetadata = " + JSON.stringify(countryToMetadata));

  return fs.writeFileSync(outpath + 'metadata_'+regionCode+'.js', output.join(';\n'));
}

var regionCodeToCountryCodeMap = {};
for (var countryCode in context.i18n.phonenumbers.metadata.countryCodeToRegionCodeMap) {
  context.i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[countryCode].forEach(function(regionCode) {
    if (!regionCodeToCountryCodeMap[regionCode]) {
      regionCodeToCountryCodeMap[regionCode] = [];
    }
    regionCodeToCountryCodeMap[regionCode].push(countryCode);
  });
}

// Grab the appropriate data.
var countryToMetadata, countryCodeToRegionCodeMap;
for (var regionCode in context.i18n.phonenumbers.metadata.countryToMetadata) {
  if (!Number.isNaN(parseInt(regionCode))) { continue; }

  countryToMetadata = {};
  countryCodeToRegionCodeMap = {};

  countryToMetadata[regionCode] = context.i18n.phonenumbers.metadata.countryToMetadata[regionCode];
  countryCodeToRegionCodeMap[regionCodeToCountryCodeMap[regionCode]] = [regionCode];

  writeFile(regionCode, countryToMetadata, countryCodeToRegionCodeMap);
}

// Handle the global exchanges.
countryToMetadata = {};
countryCodeToRegionCodeMap = {};
regionCodeToCountryCodeMap['001'].forEach(function(countryCode) {
  countryToMetadata[countryCode] = context.i18n.phonenumbers.metadata.countryToMetadata[countryCode];
  countryCodeToRegionCodeMap[countryCode] = ['001'];
});

writeFile('001', countryToMetadata, countryCodeToRegionCodeMap);
