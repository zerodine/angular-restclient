describe('validator', function() {
    beforeEach(module('restclient'));


    it('string', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.string('abcd')).toBeTruthy();
        expect(validator.string('1')).toBeTruthy();
        expect(validator.string('{blubb: "blabb"}')).toBeTruthy();

        expect(validator.string(1)).toBeFalsy();
        expect(validator.string(1.0124)).toBeFalsy();
        expect(validator.string({blubb: 'blubb'})).toBeFalsy();
        expect(validator.string(['blubb', 'blabb'])).toBeFalsy();
    }));

    it('int', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.int(1)).toBeTruthy();
        expect(validator.int(01)).toBeTruthy();
        expect(validator.int(121346534)).toBeTruthy();
        expect(validator.int(1.0124)).toBeTruthy();

        expect(validator.int('1')).toBeFalsy();
        expect(validator.int('abc')).toBeFalsy();
        expect(validator.int({blubb: 'blubb'})).toBeFalsy();
        expect(validator.int(['blubb', 'blabb'])).toBeFalsy();
    }));

    it('email', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.email('jack.bauer@domain.tld')).toBeTruthy();
        expect(validator.email('sandra+test@bullock.tld')).toBeTruthy();
        expect(validator.email('bart_simpson@simpsons.springfield.tld')).toBeTruthy();
        expect(validator.email('jack-bauer@domain.tld')).toBeTruthy();

        expect(validator.email('jack*bauer@domain')).toBeFalsy();
        expect(validator.email('jackbauer@domain')).toBeFalsy();
        expect(validator.email('jackbauer@domain_blubb.tld')).toBeFalsy();
        expect(validator.email('abc')).toBeFalsy();
        expect(validator.email({blubb: 'blubb'})).toBeFalsy();
        expect(validator.email(['blubb', 'blabb'])).toBeFalsy();
    }));

    it('relation', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.relation({})).toBeTruthy();
        expect(validator.relation([])).toBeTruthy();

        expect(validator.relation(null)).toBeFalsy();
        expect(validator.relation('')).toBeFalsy();
        expect(validator.relation('relation')).toBeFalsy();
    }));

    it('boolean', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.boolean(true)).toBeTruthy();
        expect(validator.boolean(false)).toBeTruthy();

        expect(validator.boolean(null)).toBeFalsy();
        expect(validator.boolean('')).toBeFalsy();
        expect(validator.boolean('true')).toBeFalsy();
        expect(validator.boolean({})).toBeFalsy();
    }));

    it('date', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.date(new Date())).toBeTruthy();

        expect(validator.date('1986-02-20')).toBeFalsy();
        expect(validator.date('02/20/1986')).toBeFalsy();
        expect(validator.date('1986-02-20 10:00:00')).toBeFalsy();
        expect(validator.date(null)).toBeFalsy();
        expect(validator.date('')).toBeFalsy();
        expect(validator.date('true')).toBeFalsy();
        expect(validator.date({})).toBeFalsy();
    }));

    it('float', inject(function(Validator) {
        var validator = new Validator();

        expect(validator.float(1)).toBeTruthy();
        expect(validator.float(01)).toBeTruthy();
        expect(validator.float(121346534)).toBeTruthy();
        expect(validator.float(1.0124)).toBeTruthy();

        expect(validator.float('1')).toBeFalsy();
        expect(validator.float('abc')).toBeFalsy();
        expect(validator.float({blubb: 'blubb'})).toBeFalsy();
        expect(validator.float(['blubb', 'blabb'])).toBeFalsy();
    }));
});