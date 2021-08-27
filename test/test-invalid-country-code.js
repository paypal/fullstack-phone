'use strict';

const { assert, expect } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

const metaGB = loadMeta(["GB"]);
const handlerGB = phoneClient.createPhoneHandler(metaGB);

const metaAll = loadMeta();
const handlerALL = phoneClient.createPhoneHandler(metaAll);

describe('PHONE_INVALID_COUNTRY_CODE Tests', function () {

    it('Explicit mismatch between phoneObj.countryCode and regionCode', function () {
        const phoneUS = {
            countryCode: '1',
            nationalNumber: '5105261565'
        };
        const methods = [
            handlerGB.validatePhoneNumber,
            handlerGB.validateLength,
            handlerALL.validatePhoneNumber,
            handlerALL.validateLength
        ];

        methods.forEach(method => {
            const result = method(phoneUS, "GB");
            expect(result instanceof Error).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });
    });

    it('Attempt to validate phone with countryCode for which metadata has not been loaded', function () {
        const phoneUS = {
            countryCode: '1',
            nationalNumber: '5105261565'
        };
        // use only limited handlers
        const methods = [
            handlerGB.validatePhoneNumber,
            handlerGB.validateLength
        ];

        methods.forEach(method => {
            const result = method(phoneUS);
            expect(result instanceof Error).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });
    });

    it('Completely invalid countryCode', function () {
        const phoneBad = {
            countryCode: '999999',
            nationalNumber: '5105261565'
        };

        const methods = [
            handlerGB.validatePhoneNumber,
            handlerGB.validateLength,
            handlerALL.validatePhoneNumber,
            handlerALL.validateLength
        ];

        methods.forEach(method => {
            const result = method(phoneBad, "GB");
            expect(result instanceof Error).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });

        // repeat without passing regionCode
        methods.forEach(method => {
            const result = method(phoneBad);
            expect(result instanceof Error).to.be.true;
            expect(result.message).to.equal('PHONE_INVALID_COUNTRY_CODE');
        });
    });

});
