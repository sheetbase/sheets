import * as Sheets from './public_api';

// helpers
function describe_(description: string, handler: () => void) {
    Logger.log(description);
    return handler();
}
function it_(description: string, result: () => boolean) {
    if (result()) {
        Logger.log('   (OK) ' + description);
    } else {
        Logger.log('   [FAILED] ' + description);
    }
}
function load_() {
    return Sheets.sheets({
        databaseId: '1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI',
        keyFields: {
            // foo: '$key',
            bar: 'slug',
            // baz: '$key',
            // bax: '$key',
            // query: '$key',
            users: 'uid',
            // userData: '$key',
            // increasing: '$key',
        },
        security: {
            foo: { '.read': true, '.write': true },
            bar: { '.read': true },
            baz: { '.read': false, '.write': true },
            bax: {
                $key: {
                    '.read': '$key == "abc" || $key == "xyz"',
                },
            },
            query: { '.read': true },
            users: {
                $uid: {
                    '.read': '!!auth && auth.uid == $uid',
                },
            },
            userData: {
                $key: {
                    '.read': '!!auth && auth.uid == data.val().uid',
                },
            },
            increasing: {
                '.read': true,
                '.write': 'inputData.only([ "likeCount", "rating" ])',
            },
        },
    });
}

// test
function test() {
    const describe = describe_;
    const it = it_;

    // create sheets instance
    const Sheets = load_();

    describe('Root ref', () => {

        it('Generate auto key', () => {
            const key = Sheets.ref().key();
            return (typeof key === 'string');
        });

        it('Read (fail for no read permission)', () => {
            let error = null;
            try {
                Sheets.ref().toObject();
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Write (can not update root ref)', () => {
            let error = null;
            try {
                Sheets.ref().update({ a: 1, b: 2 });
            } catch (err) {
                error = err;
            }
            return !!error;
        });

    });

    describe('Foo table', () => {

        it('Get all foo', () => {
            const foo = Sheets.all('foo');
            return (foo.length === 3);
        });

        it('Get a foo', () => {
            const foo = Sheets.item<any>('foo', 'foo-3');
            return (foo.title === 'Foo 3');
        });

        it('Query foo', () => {
            const foo = Sheets.query<any>('foo', item => {
                return (!!item.content && item.content.indexOf('Hello') > -1);
            });
            return (foo.length === 2);
        });

        it('Add a foo', () => {
            Sheets.add('foo', 'foo-x', { title: 'Foo x', content: 'Foo x content.' });
            const foo = Sheets.item<any>('foo', 'foo-x');
            return (foo.title === 'Foo x');
        });

        it('Add a foo (auto key)', () => {
            Sheets.add('foo', null, { title: 'Foo auto', content: 'Foo auto content.' });
            // clean up
            const sheet = Sheets.spreadsheet.getSheetByName('foo');
            sheet.deleteRow(sheet.getLastRow());
            return true;
        });

        it('Update a foo', () => {
            Sheets.update('foo', 'foo-x', { content: 'Foo x new content!' });
            const foo = Sheets.item<any>('foo', 'foo-x');
            return (foo.content === 'Foo x new content!');
        });

        it('Delete a foo', () => {
            Sheets.remove('foo', 'foo-x');
            const foo = Sheets.item<any>('foo', 'foo-x');
            return (foo === null);
        });

    });

    describe('Bar table', () => {

        it('Get all bar', () => {
            const bar = Sheets.all('bar');
            return (bar.length === 3);
        });

        it('Get a bar', () => {
            const bar = Sheets.item<any>('bar', 'bar-2');
            return (bar.title === 'Bar 2');
        });

        it('Query bar', () => {
            const bar = Sheets.query<any>('bar', item => {
                return (!!item.content && item.content.indexOf('Hello') > -1);
            });
            return (bar.length === 1);
        });

        it('Add a bar (fail for no write permission)', () => {
            let error = null;
            try {
                Sheets.add('bar', 'bar-x', { title: 'Bar x', content: 'Bar x content.' });
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Update a bar (fail for no write permission)', () => {
            let error = null;
            try {
                Sheets.update('bar', 'bar-x', { content: 'Bar x new content!' });
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Delete a bar (fail for no write permission)', () => {
            let error = null;
            try {
                Sheets.remove('bar', 'bar-x');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

    });

    describe('Baz table', () => {

        it('Get all baz (fail for no read permission)', () => {
            let error = null;
            try {
                const baz = Sheets.all('baz');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get a baz (fail for no read permission)', () => {
            let error = null;
            try {
                const baz = Sheets.item<any>('baz', 'baz-2');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Query baz (fail for no read permission)', () => {
            let error = null;
            try {
                const baz = Sheets.query<any>('baz', item => {
                    return (!!item.content && item.content.indexOf('Baz') > -1);
                });
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Add a baz', () => {
            let error = null;
            try {
                Sheets.add('baz', 'baz-x', { title: 'Baz x', content: 'Baz x content.' });
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Update a baz', () => {
            let error = null;
            try {
                Sheets.update('baz', 'baz-x', { content: 'Baz x new content!' });
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Delete a baz', () => {
            let error = null;
            try {
                Sheets.remove('baz', 'baz-x');
            } catch (err) {
                error = err;
            }
            return !error;
        });

    });

    describe('Bax table', () => {

        it('Get all bax (fail for no permission)', () => {
            let error = null;
            try {
                const bax = Sheets.all('bax');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get a bax (has permission)', () => {
            const bax = Sheets.item('bax', 'abc');
            return !!bax;
        });

        it('Get a bax (fail for no permission)', () => {
            let error = null;
            try {
                const bax = Sheets.item('bax', 'def');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Query bax (has permission)', () => {
            const bax = Sheets.query<any>('bax', item => {
                return (item.$key === 'abc' || item.$key === 'xyz');
            });
            return (bax.length === 2);
        });

        it('Query bax (fail for no permission)', () => {
            let error = null;
            try {
                const bax = Sheets.query<any>('bax', item => {
                    return (!!item.content);
                });
            } catch (err) {
                error = err;
            }
            return !!error;
        });

    });

    // mock request data
    const uid = '1LXPDE2qW_2s6nE3eAihfu2rEkWs';
    const setFakeRequest = () => {
        Sheets.Security.setRequest({
            query: {
                idToken: 'xxx.xxx.xxx',
            },
            body: {},
        });
    };

    describe('Users table', () => {

        it('Get (no auth)', () => {
            let error = null;
            try {
                const user = Sheets.item('users', uid);
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get (has auth, invalid token)', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => null,
            });
            setFakeRequest();

            let error = null;
            try {
                const user = Sheets.item('users', uid);
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get (has auth, valid token, not the user)', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => ({ uid: 'xxx' }),
            });
            setFakeRequest();

            let error = null;
            try {
                const user = Sheets.item('users', uid);
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get (has auth, valid token)', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => ({ uid }),
            });
            setFakeRequest();

            let error = null;
            try {
                const user = Sheets.item('users', uid);
            } catch (err) {
                error = err;
            }
            return !error;
        });

    });

    describe('User data table', () => {

        it('Get (has auth, valid token, not owned item)', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => ({ uid }),
            });
            setFakeRequest();

            let error = null;
            try {
                const data = Sheets.item('userData', 'item-2');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Get (has auth, valid token, owned item)', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => ({ uid }),
            });
            setFakeRequest();

            let error = null;
            try {
                const data = Sheets.item('userData', 'item-1');
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Query', () => {

            Sheets.setIntegration('AuthToken', {
                decodeIdToken: idToken => ({ uid }),
            });
            setFakeRequest();

            let error = null;
            try {
                const data = Sheets.query('userData', { uid });
            } catch (err) {
                error = err;
            }
            return !error;
        });

    });

    describe('Query table', () => {

        it('equal', () => {
            const data = Sheets.query('query', { where: 'title', equal: 'Foo me' });
            return (data.length === 2);
        });

        it('equal (shorthand)', () => {
            const data = Sheets.query('query', { title: 'Foo me' });
            return (data.length === 2);
        });

        it('exists', () => {
            const data = Sheets.query('query', { where: 'content', exists: true });
            return (data.length === 3);
        });

        it('exists (not)', () => {
            const data = Sheets.query('query', { where: 'content', exists: false });
            return (data.length === 1);
        });

        it('contains', () => {
            const data = Sheets.query('query', { where: 'content', contains: 'me' });
            return (data.length === 1);
        });

        it('lt', () => {
            const data = Sheets.query('query', { where: 'age', lt: 18 });
            return (data.length === 1);
        });

        it('lte', () => {
            const data = Sheets.query('query', { where: 'age', lte: 18 });
            return (data.length === 2);
        });

        it('gt', () => {
            const data = Sheets.query('query', { where: 'age', gt: 18 });
            return (data.length === 2);
        });

        it('gte', () => {
            const data = Sheets.query('query', { where: 'age', gte: 18 });
            return (data.length === 3);
        });

        it('childExists (object)', () => {
            const data = Sheets.query('query', { where: 'categories', childExists: 'cat-1' });
            return (data.length === 2);
        });

        it('childExists (object, not)', () => {
            const data = Sheets.query('query', { where: 'categories', childExists: '!cat-1' });
            return (data.length === 2);
        });

        it('childExists (array)', () => {
            const data = Sheets.query('query', { where: 'list', childExists: 'abc' });
            return (data.length === 2);
        });

        it('childExists (array, not)', () => {
            const data = Sheets.query('query', { where: 'list', childExists: '!abc' });
            return (data.length === 2);
        });

        it('childEqual', () => {
            const data = Sheets.query('query', { where: 'categories', childEqual: 'cat-1=Cat 1' });
            return (data.length === 1);
        });

        it('childEqual (not)', () => {
            const data = Sheets.query('query', { where: 'categories', childEqual: 'cat-1!=Cat 1' });
            return (data.length === 3);
        });

    });

    describe('Increasing', () => {

        it('Fail (no permission)', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-1', 'notMe');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        // batch 1
        it('Fail for root ref', () => {
            let error = null;
            try {
                Sheets.ref('/').increase('likeCount');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Fail for items ref', () => {
            let error = null;
            try {
                Sheets.ref('/increasing').increase('likeCount');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        it('Fail for deep ref', () => {
            let error = null;
            try {
                Sheets.ref('/increasing/item-1/content').increase('likeCount');
            } catch (err) {
                error = err;
            }
            return !!error;
        });

        // batch 2 (likeCount = 1/1/2)
        it('Prop not exists', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-1', 'likeCount');
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Prop = 0', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-2', 'likeCount');
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Prop !== 0', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-3', 'likeCount');
            } catch (err) {
                error = err;
            }
            return !error;
        });

        // batch 3 (/rating/total = 5/5/10)
        it('Deep prop not exists', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-1', {
                    '/rating/total': 5,
                });
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Deep prop = 0', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-2', {
                    '/rating/total': 5,
                });
            } catch (err) {
                error = err;
            }
            return !error;
        });

        it('Deep prop !== 0', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-3', {
                    '/rating/total': 5,
                });
            } catch (err) {
                error = err;
            }
            return !error;
        });

        // batch 4 (likeCount = 1 | /rating/total = 1)
        it('Multiple paths (string[])', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-1', ['likeCount', '/rating/total']);
            } catch (err) {
                error = err;
            }
            return !error;
        });

        // batch 5 (/rating/count = 2 | /rating/total = 10)
        it('Multiple paths (deep)', () => {
            let error = null;
            try {
                Sheets.increase('increasing', 'item-3', {
                    '/rating/count': 1,
                    '/rating/total': 5,
                });
            } catch (err) {
                error = err;
            }
            return !error;
        });

    });

}