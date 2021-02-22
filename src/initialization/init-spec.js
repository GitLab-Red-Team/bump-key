import * as init from './init'

describe('init', () => {

    let options, optionSpy, argParser, obj;

    beforeEach(() => {
        optionSpy = jest.fn(() => obj);
        argParser = jest.fn(() => obj);
        obj = {
            options: optionSpy,
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
        expect(optionSpy).toBeCalledWith({
            "root": {
                "alias": "r",
                "description": "The root directory of the targeted project",
                "required": true,
                "requiresArg": true
            }
        });
    });
    it('should not have undefined options', () => {
        expect(options).not.toBe(undefined);
    });
});