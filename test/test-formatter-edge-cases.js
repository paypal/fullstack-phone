/* Edge case tests for AsYouTypeFormatter with real-time input scenarios and various international formatting patterns */

'use strict';

const { assert } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('AsYouTypeFormatter Edge Cases (International Formats)', function () {

    describe('US AsYouTypeFormatter Edge Cases', function () {
        const meta = loadMeta(['US']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format US number typing with various characters', function () {
            const formatter = handler.getAsYouTypeFormatter('US');

            assert.equal(formatter.inputDigit('5'), '5');
            assert.equal(formatter.inputDigit('1'), '51');
            assert.equal(formatter.inputDigit('0'), '510');
            assert.equal(formatter.inputDigit('5'), '510-5');
            assert.equal(formatter.inputDigit('2'), '510-52');
            assert.equal(formatter.inputDigit('6'), '510-526');
            assert.equal(formatter.inputDigit('1'), '510-5261');
            assert.equal(formatter.inputDigit('5'), '510-526-15');
            assert.equal(formatter.inputDigit('6'), '510-526-156');
            assert.equal(formatter.inputDigit('8'), '510-526-1568');
        });

        it('Should format US toll-free number typing', function () {
            const formatter = handler.getAsYouTypeFormatter('US');

            assert.equal(formatter.inputDigit('8'), '8');
            assert.equal(formatter.inputDigit('0'), '80');
            assert.equal(formatter.inputDigit('0'), '800');
            assert.equal(formatter.inputDigit('5'), '800-5');
            assert.equal(formatter.inputDigit('2'), '800-52');
            assert.equal(formatter.inputDigit('6'), '800-526');
            assert.equal(formatter.inputDigit('1'), '800-5261');
            assert.equal(formatter.inputDigit('5'), '800-526-15');
            assert.equal(formatter.inputDigit('6'), '800-526-156');
            assert.equal(formatter.inputDigit('8'), '1-800-526-1568');
        });
    });

    describe('GB AsYouTypeFormatter Edge Cases', function () {
        const meta = loadMeta(['GB']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format UK mobile number typing', function () {
            const formatter = handler.getAsYouTypeFormatter('GB');

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('7'), '07');
            assert.equal(formatter.inputDigit('7'), '077');
            assert.equal(formatter.inputDigit('0'), '0770');
            assert.equal(formatter.inputDigit('0'), '0770 0');
            assert.equal(formatter.inputDigit('9'), '0770 09');
            assert.equal(formatter.inputDigit('0'), '0770 090');
            assert.equal(formatter.inputDigit('0'), '0770 090 0');
            assert.equal(formatter.inputDigit('1'), '0770 090 01');
            assert.equal(formatter.inputDigit('2'), '0770 090 012');
            assert.equal(formatter.inputDigit('3'), '0770 090 0123');
        });

        it('Should format UK landline typing', function () {
            const formatter = handler.getAsYouTypeFormatter('GB');

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('2'), '02');
            assert.equal(formatter.inputDigit('0'), '020');
            assert.equal(formatter.inputDigit('7'), '020 7');
            assert.equal(formatter.inputDigit('1'), '020 71');
            assert.equal(formatter.inputDigit('2'), '020 712');
            assert.equal(formatter.inputDigit('3'), '020 7123');
            assert.equal(formatter.inputDigit('4'), '020 7123 4');
            assert.equal(formatter.inputDigit('5'), '020 7123 45');
            assert.equal(formatter.inputDigit('6'), '020 7123 456');
            assert.equal(formatter.inputDigit('7'), '020 7123 4567');
        });

        it('Should format UK number starting with 1', function () {
            const formatter = handler.getAsYouTypeFormatter('GB');

            assert.equal(formatter.inputDigit('1'), '1');
            assert.equal(formatter.inputDigit('2'), '12');
            assert.equal(formatter.inputDigit('1'), '121');
            assert.equal(formatter.inputDigit('2'), '1212');
            assert.equal(formatter.inputDigit('3'), '1212 3');
            assert.equal(formatter.inputDigit('4'), '1212 34');
            assert.equal(formatter.inputDigit('5'), '1212 345');
            assert.equal(formatter.inputDigit('6'), '1212 3456');
            assert.equal(formatter.inputDigit('7'), '1212 3456 7');
            assert.equal(formatter.inputDigit('8'), '1212 3456 78');
        });
    });

    describe('DE AsYouTypeFormatter Edge Cases', function () {
        const meta = loadMeta(['DE']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format German mobile typing', function () {
            const formatter = handler.getAsYouTypeFormatter('DE');

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('1'), '01');
            assert.equal(formatter.inputDigit('7'), '017');
            assert.equal(formatter.inputDigit('0'), '0170');
            assert.equal(formatter.inputDigit('1'), '0170 1');
            assert.equal(formatter.inputDigit('2'), '0170 12');
            assert.equal(formatter.inputDigit('3'), '0170 123');
            assert.equal(formatter.inputDigit('4'), '0170 1234');
            assert.equal(formatter.inputDigit('5'), '0170 12345');
            assert.equal(formatter.inputDigit('6'), '0170 123456');
            assert.equal(formatter.inputDigit('7'), '0170 1234567');
        });

        it('Should format German landline typing', function () {
            const formatter = handler.getAsYouTypeFormatter('DE');

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('3'), '03');
            assert.equal(formatter.inputDigit('0'), '030');
            assert.equal(formatter.inputDigit('1'), '030 1');
            assert.equal(formatter.inputDigit('2'), '030 12');
            assert.equal(formatter.inputDigit('3'), '030 123');
            assert.equal(formatter.inputDigit('4'), '030 1234');
            assert.equal(formatter.inputDigit('5'), '030 12345');
            assert.equal(formatter.inputDigit('6'), '030 123456');
            assert.equal(formatter.inputDigit('7'), '030 1234567');
            assert.equal(formatter.inputDigit('8'), '030 12345678');
        });
    });

    describe('IN AsYouTypeFormatter Edge Cases', function () {
        const meta = loadMeta(['IN']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format Indian mobile typing', function () {
            const formatter = handler.getAsYouTypeFormatter('IN');

            assert.equal(formatter.inputDigit('9'), '9');
            assert.equal(formatter.inputDigit('8'), '98');
            assert.equal(formatter.inputDigit('7'), '987');
            assert.equal(formatter.inputDigit('6'), '9876');
            assert.equal(formatter.inputDigit('5'), '9876 5');
            assert.equal(formatter.inputDigit('4'), '9876 54');
            assert.equal(formatter.inputDigit('3'), '9876 543');
            assert.equal(formatter.inputDigit('2'), '9876 5432');
            assert.equal(formatter.inputDigit('1'), '9876 5432 1');
            assert.equal(formatter.inputDigit('0'), '098765 43210');
        });

        it('Should format Indian landline typing', function () {
            const formatter = handler.getAsYouTypeFormatter('IN');

            assert.equal(formatter.inputDigit('0'), '0');
            assert.equal(formatter.inputDigit('1'), '01');
            assert.equal(formatter.inputDigit('1'), '011');
            assert.equal(formatter.inputDigit('1'), '011 1');
            assert.equal(formatter.inputDigit('2'), '011 12');
            assert.equal(formatter.inputDigit('3'), '011 123');
            assert.equal(formatter.inputDigit('4'), '011 1234');
            assert.equal(formatter.inputDigit('5'), '011 1234 5');
            assert.equal(formatter.inputDigit('6'), '011 1234 56');
            assert.equal(formatter.inputDigit('7'), '011 1234 567');
            assert.equal(formatter.inputDigit('8'), '011 1234 5678');
        });
    });

    describe('BR AsYouTypeFormatter Edge Cases', function () {
        const meta = loadMeta(['BR']);
        const handler = phoneClient.createPhoneHandler(meta);

        it('Should format Brazilian mobile typing', function () {
            const formatter = handler.getAsYouTypeFormatter('BR');

            assert.equal(formatter.inputDigit('1'), '1');
            assert.equal(formatter.inputDigit('1'), '11');
            assert.equal(formatter.inputDigit('9'), '11 9');
            assert.equal(formatter.inputDigit('9'), '11 99');
            assert.equal(formatter.inputDigit('9'), '11 999');
            assert.equal(formatter.inputDigit('9'), '11 9999');
            assert.equal(formatter.inputDigit('9'), '11 99999');
            assert.equal(formatter.inputDigit('9'), '11 99999-9');
            assert.equal(formatter.inputDigit('9'), '11 99999-99');
            assert.equal(formatter.inputDigit('9'), '11 99999-999');
            assert.equal(formatter.inputDigit('9'), '11 99999-9999');
        });

        it('Should format Brazilian landline typing', function () {
            const formatter = handler.getAsYouTypeFormatter('BR');

            assert.equal(formatter.inputDigit('1'), '1');
            assert.equal(formatter.inputDigit('1'), '11');
            assert.equal(formatter.inputDigit('2'), '11 2');
            assert.equal(formatter.inputDigit('2'), '11 22');
            assert.equal(formatter.inputDigit('2'), '11 222');
            assert.equal(formatter.inputDigit('2'), '11 2222');
            assert.equal(formatter.inputDigit('3'), '11 2222-3');
            assert.equal(formatter.inputDigit('3'), '11 2222-33');
            assert.equal(formatter.inputDigit('3'), '11 2222-333');
            assert.equal(formatter.inputDigit('3'), '11 2222-3333');
        });
    });
});
