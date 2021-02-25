import * as dependencies from './index';

describe('dependencies', () => {
    let outdated;
    beforeEach(async () => {
        outdated = await dependencies.showOutdated()
            .then((result) => outdated = result.all())
            .catch((e) => {throw e});
    });
    test('shows no unused dependencies', () => {
        outdated.packages.forEach((x) => {
            expect(x).not.toEqual(undefined);
        });
    });
})