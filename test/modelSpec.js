describe('Model', function() {
    beforeEach(module('TestModel'));
    beforeEach(module('restclient'));

    it('tests the clean method', inject(function(TestModel) {
        var testModel = new TestModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer'
        });

        expect(testModel.firstname).toBe('Jack');
        expect(testModel.lastname).toBe('Bauer');
        expect(testModel.id).toEqual(1);

        testModel._clean();

        expect(testModel.firstname).toBe('Jack_');
        expect(testModel.lastname).toBe('Bauer');
        expect(testModel.id).toBeUndefined();
    }));

    it('tests the foreignData var', inject(function(TestModel) {
        var testModel = new TestModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            noMatch: 'secret'
        });

        expect(testModel.firstname).toBe('Jack');
        expect(testModel.lastname).toBe('Bauer');
        expect(testModel.id).toEqual(1);
        expect(testModel.__foreignData).toBeUndefined();
    }));
});