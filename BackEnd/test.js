const assert = require('assert');
const {validateNumbers2} = require('./main.js');

describe('testvalidateNumbers2 for statement coverage', function() {
	it('does not throw an error when values are 354115.1037628726', function() {
		try {
			validateNumbers2(354115.1037628726);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});

describe('testvalidateNumbers2 for branch coverage', function() {
	it('does not throw an error when values are 5', function() {
		try {
			validateNumbers2(5);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('does not throw an error when values are 98', function() {
		try {
			validateNumbers2(98);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});

describe('testvalidateNumbers2 for condition coverage', function() {
	it('does not throw an error when values are 3', function() {
		try {
			validateNumbers2(3);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
	it('does not throw an error when values are 8', function() {
		try {
			validateNumbers2(8);
		} catch (error) {
			expect(false).toBe(true);
		}
	});
});
