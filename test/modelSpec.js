describe('model', function() {
    beforeEach(module('restclient'));

    beforeEach(module('UserModel'));
    beforeEach(module('CompanyModel'));
    beforeEach(module('LocationModel'));
    beforeEach(module('RoleModel'));

    it('clean', inject(function(UserModel) {
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: null,
            company: {
                id: 1,
                name: 'ACME'
            },
            computed_name: 'JackACME'
        });

        // Before clean
        expect(user._annotation).toBeDefined();
        expect(user.company._annotation).toBeDefined();
        expect(user.lastname).toBeNull();
        expect(user.fullname).toBe('Jack null');
        expect(user.computed_name).toBe('JackACME');
        expect(user.id).toBe(1);

        user.clean();

        // After clean
        expect(user._annotation).not.toBeDefined();
        expect(user.company._annotation).not.toBeDefined();
        expect(user.lastname).not.toBeDefined();
        expect(user.fullname).not.toBeDefined();
        expect(user.computed_name).not.toBeDefined();
        expect(user.id).not.toBeDefined();

        var user2 = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: null,
            company: {
                id: 1,
                name: 'ACME',
                computed_name: 'ACME',
                location: {
                    id: 1,
                    city: 'Springfield',
                    computed_name: 'Springfield'
                }
            }
        });

        // Change save type
        user2._annotation.company.save = true;

        // Before clean
        expect(user2._annotation).toBeDefined();
        expect(user2.company._annotation).toBeDefined();
        expect(user2.lastname).toBeNull();
        expect(user2.fullname).toBe('Jack null');
        expect(user2.id).toBe(1);
        expect(user2.company.id).toBe(1);
        expect(user2.company.location.id).toBe(1);
        expect(user2.company.location.city).toBe('Springfield');
        expect(user2.company.location.computed_name).toBe('Springfield');
        expect(user2.company.computed_name).toBe('ACME');

        user2.clean();

        // After clean
        expect(user2._annotation).not.toBeDefined();
        expect(user2.company._annotation).not.toBeDefined();
        expect(user2.lastname).not.toBeDefined();
        expect(user2.fullname).not.toBeDefined();
        expect(user2.id).not.toBeDefined();
        expect(user2.company.id).not.toBeDefined();
        expect(user2.company.location.city).toBe('Springfield');
        expect(user2.company.location.computed_name).not.toBeDefined();
        expect(user2.company.location.id).not.toBeDefined();
        expect(user2.company.location._annotation).not.toBeDefined();
        expect(user2.company.computed_name).not.toBeDefined();
    }));

    it('_afterLoad', inject(function(UserModel) {
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer'
        });

        expect(user.fullname).toBe('Jack Bauer');
    }));

    it('_afterLoad(foreignData)', inject(function(UserModel) {
        var user = new UserModel({});
        user._afterLoad = function(foreignData) {
            expect(foreignData.foreign_test).toBe('blubb');
            expect(user.foreign_test).not.toBe('blubb');
        };

        user._init({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            foreign_test: 'blubb'
        });
    }));

    it('_beforeSave', inject(function(UserModel) {
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer'
        });

        // Before _beforeSave gets called
        expect(user.firstname).toBe('Jack');

        user._beforeSave();

        // After _beforeSave gets called
        expect(user.firstname).toBe('Jack_');
    }));

    it('_beforeSave(method)', inject(function(UserModel) {

        // One to one relation
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        user._beforeSave = function(method) {
            expect(method).toBe(user.METHOD_UPDATE);
            expect(method).not.toBe(user.METHOD_SAVE);
        };

        user.company._beforeSave = function(method) {
            expect(method).toBe(user.METHOD_UPDATE);
            expect(method).not.toBe(user.METHOD_SAVE);
        };

        user.clean();

    }));

    it('_beforeSave(method, parent)', inject(function(UserModel) {

        // One to one relation
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        user._beforeSave = function(method, parent) {
            expect(parent).toBeFalsy();
            expect(parent).not.toBeTruthy();
        };

        user.company._beforeSave = function(method, parent) {
            expect(parent).toBeTruthy();
            expect(parent).not.toBeFalsy();
        };

        user.clean();

    }));

    it('_init', inject(function(UserModel) {

        // Simple mapping
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: null
        });

        expect(user.firstname).toBe('Jack');
        expect(user.lastname).toBeNull();
        expect(user.company).toBeNull();

        // One to one relation
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        expect(user.firstname).toBe('Jack');
        expect(user.id).toBe(1);
        expect(user.company.id).toBe(1);
        expect(user.company.name).toBe('ACME');

        // One to many relation
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            roles: [
                {
                    id: 1,
                    name: 'user'
                },
                {
                    id: 2,
                    name: 'admin'
                }
            ]
        });

        expect(user.firstname).toBe('Jack');
        expect(user.id).toBe(1);
        expect(user.roles[0].id).toBe(1);
        expect(user.roles[0].name).toBe('user');
        expect(user.roles[1].id).toBe(2);
        expect(user.roles[1].name).toBe('admin');

        // Annotation
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: null
        });

        expect(user._annotation.id.type).toBe('int');
        expect(user._annotation.id.save).toBeFalsy();

        expect(user._annotation.company.type).toBe('relation');
        expect(user._annotation.company.relation.type).toBe('one');
        expect(user._annotation.company.save).toBe('reference');

        // _foreignData
        // Annotation
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: null
        });

        expect(user._foreignData).not.toBeDefined();
    }));

    it('_mapArray', inject(function(UserModel) {
        // One to many relation
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            roles: [
                {
                    id: 1,
                    name: 'user'
                },
                {
                    id: 2,
                    name: 'admin'
                }
            ]
        });

        expect(user.firstname).toBe('Jack');
        expect(user.id).toBe(1);
        expect(user.roles[0].id).toBe(1);
        expect(user.roles[0].name).toBe('user');
        expect(user.roles[1].id).toBe(2);
        expect(user.roles[1].name).toBe('admin');
    }));

    it('_mapProperty', inject(function(UserModel) {
        // One to one relation
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        expect(user.firstname).toBe('Jack');
        expect(user.id).toBe(1);
        expect(user.company.id).toBe(1);
        expect(user.company.name).toBe('ACME');
    }));

    it('_referenceOnly', inject(function(UserModel) {

        // One to one relation
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        expect(user.company.name).toBe('ACME');
        expect(user.company.id).toBe(1);

        user._referenceOnly(user.company);

        expect(user.company.name).not.toBeDefined();
        expect(user.company.id).toBe(1);

        // One to many relation
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            roles: [
                {
                    id: 1,
                    name: 'user'
                },
                {
                    id: 2,
                    name: 'admin'
                }
            ]
        });

        expect(user.roles[0].name).toBe('user');
        expect(user.roles[0].id).toBe(1);
        expect(user.roles[1].name).toBe('admin');
        expect(user.roles[1].id).toBe(2);

        user._referenceOnly(user.roles);

        expect(user.roles[0].name).not.toBeDefined();
        expect(user.roles[0].id).toBe(1);
        expect(user.roles[1].name).not.toBeDefined();
        expect(user.roles[1].id).toBe(2);
    }));

    it('validate', inject(function(UserModel) {

        // Email required and false format
        var user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            email: '',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        expect(user.validate().valid).toBeFalsy();
        expect(user.validate().errors.email).toBe('required');
        expect(user.validate().errors.email).not.toBe('format_error_email');

        // Email required
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: 'ACME'
            }
        });

        expect(user.validate().valid).toBeFalsy();
        expect(user.validate().errors.email).toBe('required');
        expect(user.validate().errors.email).not.toBe('format_error_email');

        // valid
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            email: 'jack@bauer.tld'
        });

        expect(user.validate().valid).toBeTruthy();
        console.log(user.validate().errors);

        // Relation company is not valid
        user = new UserModel({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            company: {
                id: 1,
                name: ''
            }
        });

        expect(user.validate().valid).toBeFalsy();
        expect(user.validate().errors.email).toBe('required');
        expect(user.validate().errors.email).not.toBe('format_error_email');
        expect(user.validate().errors.company.name).toBe('required');
        expect(user.validate().errors.company.id).not.toBeDefined();
    }));
});