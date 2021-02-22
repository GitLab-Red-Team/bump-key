import * as init from './init'

describe('init', () => {

    let options, optionSpy, argParser, obj;

    beforeEach(() => {
        optionSpy = jest.fn(() => obj);
        argParser = jest.fn(() => obj);
        obj = {
            option: optionSpy,
            argv: []
        }
        options = init.setOptions(argParser);
    });
    afterEach(() => {
        options = undefined;
    });
    it('should call the argParser function once', () => {
        expect(argParser).toBeCalledTimes(1);
    });
    it('should construct the correct path option', () => {
        expect(optionSpy).toBeCalledWith("l",
            {
                alias: "lockfile",
                describe: "Path to the lock file",
                type: "string",
                demandOption: true
            }
        );
    });
    it('options should not be undefined', () => {
        expect(options).not.toBe(undefined);
    });
});