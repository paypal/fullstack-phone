'use strict';

var assert = require('assert'),
    loadMeta = require('../loadMeta');

describe('Metadata loader tests', function () {
    it('Should load metadata for US', function () {
        var meta = loadMeta(['US']);
        assert.deepEqual(meta, { regionCodes: ['US'], countryCodeToRegionCodeMap: { '1': ['US'] }, countryToMetadata: { US: [null, [null, null, '[2-9]\\d{9}', '\\d{7}(?:\\d{3})?'], [null, null, '(?:2(?:0[1-35-9]|1[02-9]|2[04589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[014678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}', '\\d{7}(?:\\d{3})?'], [null, null, '(?:2(?:0[1-35-9]|1[02-9]|2[04589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[014678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}', '\\d{7}(?:\\d{3})?'], [null, null, '8(?:00|44|55|66|77|88)[2-9]\\d{6}', '\\d{10}'], [null, null, '900[2-9]\\d{6}', '\\d{10}'], [null, null, 'NA', 'NA'], [null, null, '5(?:00|33|44|66|77|88)[2-9]\\d{6}', '\\d{10}'], [null, null, 'NA', 'NA'], 'US', 1, '011', '1', null, null, '1', null, null, 1, [[null, '(\\d{3})(\\d{4})', '$1-$2', null, null, null, 1], [null, '(\\d{3})(\\d{3})(\\d{4})', '($1) $2-$3', null, null, null, 1]], [[null, '(\\d{3})(\\d{3})(\\d{4})', '$1-$2-$3']], [null, null, 'NA', 'NA'], 1, null, [null, null, 'NA', 'NA'], [null, null, 'NA', 'NA'], null, null, [null, null, 'NA', 'NA']] } });
    });

    it('Should load metadata for US, GB, and RU', function () {
        var meta = loadMeta(['US', 'GB', 'RU']);
        assert.deepEqual(meta.regionCodes, ['US', 'GB', 'RU']); // note that order is not important
        assert.deepEqual(meta.countryCodeToRegionCodeMap, {
            '1': ['US'],
            '44': ['GB'],
            '7': ['RU']
        });
        assert.deepEqual(Object.keys(meta.countryToMetadata), ['US', 'GB', 'RU']); // order is not important
    });

    it('Should load metadata for US and CA when requesting just CA', function () {
        var meta = loadMeta(['CA']);
        assert.deepEqual(meta.regionCodes, ['CA', 'US']); // note that order is not important
        assert.deepEqual(meta.countryCodeToRegionCodeMap, {
            '1': ['US', 'CA'] // US must be first
        });
        assert.deepEqual(Object.keys(meta.countryToMetadata), ['CA', 'US']); // order is not important
    });

    it('Should load metadata for AU (only once) when requesting AU, CC, and CX', function () {
        var meta = loadMeta(['AU', 'CC', 'CX']);
        assert.deepEqual(meta.regionCodes, ['AU', 'CC', 'CX']); // note that order is not important
        assert.deepEqual(meta.countryCodeToRegionCodeMap, {
            '61': ['AU', 'CC', 'CX'] // AU must be first
        });
        assert.deepEqual(Object.keys(meta.countryToMetadata), ['AU', 'CC', 'CX']); // order is not important
    });

    it('Should load metadata for main countries when requesting dependent regions', function () {
        var meta = loadMeta([
            'GU', // depends on US
            'KZ', // depends on RU
            'VA', // depends on IT
            'GG', // depends on GB
            'SJ', // depends on NO
            'CX', // depends on AU
            'EH', // depends on MA
            'YT', // depends on RE
            'TA', // depends on SH
            'AX', // depends on FI
            'BL', // depends on GP
            'BQ', // depends on CW
        ]);
        assert.deepEqual(meta.regionCodes, [
            'GU', 'US',
            'KZ', 'RU',
            'VA', 'IT',
            'GG', 'GB',
            'SJ', 'NO',
            'CX', 'AU',
            'EH', 'MA',
            'YT', 'RE',
            'TA', 'SH',
            'AX', 'FI',
            'BL', 'GP',
            'BQ', 'CW'
        ]); // note that order is not important
        assert.deepEqual(meta.countryCodeToRegionCodeMap, {
            '1': ['US', 'GU'],
            '7': ['RU', 'KZ'],
            '39': ['IT', 'VA'],
            '44': ['GB', 'GG'],
            '47': ['NO', 'SJ'],
            '61': ['AU', 'CX'],
            '212': ['MA', 'EH'],
            '262': ['RE', 'YT'],
            '290': ['SH', 'TA'],
            '358': ['FI', 'AX'],
            '590': ['GP', 'BL'],
            '599': ['CW', 'BQ']
        });
        assert.deepEqual(Object.keys(meta.countryToMetadata), [
            'GU', 'US',
            'KZ', 'RU',
            'VA', 'IT',
            'GG', 'GB',
            'SJ', 'NO',
            'CX', 'AU',
            'EH', 'MA',
            'YT', 'RE',
            'TA', 'SH',
            'AX', 'FI',
            'BL', 'GP',
            'BQ', 'CW'
        ]); // order is not important

    });

    it('Should load metadata for global exchanges using region code 001', function () {
        var meta = loadMeta(['001']);
        assert.deepEqual(meta.regionCodes, ['001']);
        assert.deepEqual(meta.countryCodeToRegionCodeMap, {
            '800': ['001'],
            '808': ['001'],
            '870': ['001'],
            '878': ['001'],
            '881': ['001'],
            '882': ['001'],
            '883': ['001'],
            '888': ['001'],
            '979': ['001'],
        });

        // note that countryToMetadata for 001 has calling codes, not region codes:
        assert.deepEqual(Object.keys(meta.countryToMetadata), ['800', '808', '870', '878', '881', '882', '883', '888', '979']); // order is not important
    });
});

