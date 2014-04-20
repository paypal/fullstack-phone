libphonenumber
==============

Google's libphonenumber as an easily included JavaScript library.

Exports
-------

This library adds the global `phoneUtils` with the following methods:

```js
phoneUtils.isPossibleNumber(phoneNumber, regionCode);
phoneUtils.isPossibleNumberWithReason(phoneNumber, regionCode);
phoneUtils.isValidNumber(phoneNumber, regionCode);
phoneUtils.isValidNumberForRegion(phoneNumber, regionCode);
phoneUtils.getRegionCodeForNumber(phoneNumber, regionCode);
phoneUtils.getNumberType(phoneNumber, regionCode);
phoneUtils.formatE164(phoneNumber, regionCode);
phoneUtils.formatNational(phoneNumber, regionCode);
phoneUtils.formatInternational(phoneNumber, regionCode);
phoneUtils.formatInOriginalFormat(phoneNumber, regionCode);
phoneUtils.formatOutOfCountryCallingNumber(phoneNumber, regionCode, target);
```
