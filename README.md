libphonenumber
==============

Google's libphonenumber as an easily included JavaScript library.

Exports
-------

This library adds the global `phoneUtils` with the following methods:

```js
phoneUtils.countryCodeToRegionCodeMap();
phoneUtils.isPossibleNumber(phoneNumber, regionCode);
phoneUtils.isPossibleNumberWithReason(phoneNumber, regionCode);
phoneUtils.isValidNumber(phoneNumber, regionCode);
phoneUtils.isValidNumberForRegion(phoneNumber, regionCode);
phoneUtils.getCountryCodeForRegion(regionCode);
phoneUtils.getRegionCodeForNumber(phoneNumber, regionCode);
phoneUtils.getNumberType(phoneNumber, regionCode);
phoneUtils.getSupportedRegions();
phoneUtils.formatE164(phoneNumber, regionCode);
phoneUtils.formatNational(phoneNumber, regionCode);
phoneUtils.formatInternational(phoneNumber, regionCode);
phoneUtils.formatInOriginalFormat(phoneNumber, regionCode);
phoneUtils.formatOutOfCountryCallingNumber(phoneNumber, regionCode, target);
```

How it works
------------

I've extracted/ported/written code based on `vendor/libphonenumber/javascript/i18n/phonenumbers/demo.js` and turned that into `libphonenumber.js` at the root of this project.

I've modified `vendor/libphonenumber/javascript/build.xml` and turned that into `build.xml` at the root of this project. Diff those files to see changes.

The `./build.sh` command uses those two pieces together in order to generate a new version of libphonenumber.js in the `/dist` folder.

Before you run the build script, ensure you have [ant-contrib](http://ant-contrib.sourceforge.net/) installed, and present on your system's PATH.

Contributing
------------

I only semi-actively maintain this code. Fortunately it's very little more than a build system on top of the public project. If you're interested in a feature I've not included I'll be glad to help you as I can, but I'm not terribly familiar with Closure Compiler and won't necessarily be the best help. Your goal would be to port something that's working inside of `vendor/libphonenumber/javascript/i18n/phonenumbers/demo.js` to be runnable as a series of methods inside of `libphonenumber.js`. I will review PRs!
