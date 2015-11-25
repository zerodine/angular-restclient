describe('mock', function() {
    beforeEach(module('restclient'));

    beforeEach(module('UsersMock'));


    it('_route', inject(function(UsersMock) {
        var usersMock = new UsersMock();

        expect(usersMock._routeMatcher['GET1']).toBeDefined();
        expect(usersMock._routeMatcher['GET0']).toBeDefined();
        expect(usersMock._routeMatcher['GET']).not.toBeDefined();
        expect(usersMock._routeMatcher['PUT1']).toBeDefined();
        expect(usersMock._routeMatcher['PUT2']).not.toBeDefined();
        expect(usersMock._routeMatcher['PUT']).not.toBeDefined();
    }));

    it('request', inject(function(UsersMock) {
        var usersMock = new UsersMock();

        var users = usersMock.request('GET');

        expect(users.users[0].id).toBe(1);
        expect(users.users[0].firstname).toBe('Jack');
        expect(users.users[0].lastname).toBe('Bauer');
        expect(users.users[1].id).toBe(2);
        expect(users.users[1].firstname).toBe('Sandra');
        expect(users.users[1].lastname).toBe('Bullock');

        var user = usersMock.request('GET', [1]);

        expect(user.id).toBe(1);
        expect(user.firstname).toBe('Jack');
        expect(user.lastname).toBe('Bauer');

        user = usersMock.request('GET', [2]);

        expect(user.id).toBe(2);
        expect(user.firstname).toBe('Sandra');
        expect(user.lastname).toBe('Bullock');

        user = usersMock.request('POST', [], {firstname: 'Bart', lastname: 'Simpson'});

        expect(user.id).toBe(1);
        expect(user.firstname).toBe('Bart');
        expect(user.lastname).toBe('Simpson');
        expect(user.id).not.toBe(2);

        var company = usersMock.request('POST', [10, 'company'], {name: 'ACME'});

        expect(company.id).toBe(10);
        expect(company.name).toBe('ACME');
    }));
});