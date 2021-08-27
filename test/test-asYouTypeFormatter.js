'use strict';

const { assert, expect } = require('chai');
const loadMeta = require('../server').loadMeta;
const phoneClient = require('../client');

describe('AsYouTypeFormatter Tests', function () {

    it('Should format US number using AsYouTypeFormatter', function () {
        const meta = loadMeta(['BS']); // loading Bahamas also loads US
        const handler = phoneClient.createPhoneHandler(meta);

        const formatter = handler.getAsYouTypeFormatter('US');

        assert.equal(formatter.inputDigit('9'), '9');
        assert.equal(formatter.inputDigit('1'), '91');
        assert.equal(formatter.inputDigit('9'), '919');
        assert.equal(formatter.inputDigit('2'), '919-2');
        assert.equal(formatter.inputDigit('8'), '919-28');
        assert.equal(formatter.inputDigit('2'), '919-282');
        assert.equal(formatter.inputDigit('3'), '919-2823');
        assert.equal(formatter.inputDigit('4'), '(919) 282-34');
        assert.equal(formatter.inputDigit('5'), '(919) 282-345');
        assert.equal(formatter.inputDigit('6'), '(919) 282-3456');

        // test overrun
        assert.equal(formatter.inputDigit('7'), '91928234567');

        // test that clear works
        formatter.clear();
        assert.equal(formatter.inputDigit('9'), '9');
    });

    it('Should format GB number using AsYouTypeFormatter', function () {
        const meta = loadMeta(['KZ', 'AU', 'GG', 'GB']);
        const handler = phoneClient.createPhoneHandler(meta);
        const formatter = handler.getAsYouTypeFormatter('GB');

        assert.equal(formatter.inputDigit('0'), '0');
        assert.equal(formatter.inputDigit('1'), '01');
        assert.equal(formatter.inputDigit('2'), '012');
        assert.equal(formatter.inputDigit('1'), '0121');
        assert.equal(formatter.inputDigit('2'), '0121 2');
        assert.equal(formatter.inputDigit('3'), '0121 23');
        assert.equal(formatter.inputDigit('4'), '0121 234');
        assert.equal(formatter.inputDigit('5'), '0121 234 5');
        assert.equal(formatter.inputDigit('6'), '0121 234 56');
        assert.equal(formatter.inputDigit('7'), '0121 234 567');
        assert.equal(formatter.inputDigit('8'), '0121 234 5678');

        // test overrun
        assert.equal(formatter.inputDigit('9'), '012123456789');

        // test that clear works
        formatter.clear();
        assert.equal(formatter.inputDigit('0'), '0');
    });

    it('Test inputDigitAndRememberPosition and getRememberedPosition', function () {
        const meta = loadMeta(); // load metadata for all regions
        const h = phoneClient.createPhoneHandler(meta);

        const f = h.getAsYouTypeFormatter('US');

        expect(f.getRememberedPosition()).to.equal(0); // first position should be initialized to 0
        expect(f.inputDigit('5')).to.equal('5');
        expect(f.getRememberedPosition()).to.equal(0); // haven't called inputDigitAndRememberPosition yet, so remembered position is still 0
        expect(f.inputDigitAndRememberPosition('1')).to.equal('51');
        expect(f.getRememberedPosition()).to.equal(2); // after entering '1', cursor was at index 2
        expect(f.inputDigit('0')).to.equal('510');
        expect(f.inputDigit('5')).to.equal('510-5');
        expect(f.inputDigit('2')).to.equal('510-52');
        expect(f.inputDigit('3')).to.equal('510-523');
        expect(f.inputDigitAndRememberPosition('4')).to.equal('510-5234');
        expect(f.getRememberedPosition()).to.equal(8); // after entering '4', cursor was at index 8
        expect(f.inputDigit('5')).to.equal('(510) 523-45'); // entering another digit adds more formatting chars and shifts everything to the right
        expect(f.getRememberedPosition()).to.equal(11); // now the cursor position after the '4' is at index 11, since the '4' has now shifted to the right
        f.clear();
        expect(f.getRememberedPosition()).to.equal(0); // clear should set this back to 0
    });
});

/*
 ===================
 Debugging functions
 ===================
 */

/* jshint ignore:start */

// quick function to show output
function showMe(obj) {
    console.log(require('util').inspect(obj, false, null));
}

// quick function to show output as JSON
function showJSON(obj) {
    console.log(JSON.stringify(obj, null, 2));
}

/* jshint ignore:end */
