import * as init from './init'

describe('init', () => {
    let options;
    let optionSpy = jest.fn();
    let argParser = jest.fn(() => ({
        option: optionSpy
    }));
    beforeEach(() => {
        options = init.setOptions(argParser);
    });
    afterEach(() => {
        options = undefined;
    });
    it('should call the argParser function once', () => {
        expect(argParser).toBeCalledTimes(1);
    });
    it('should contruct the correct path option', () => {
        expect(optionSpy).toBeCalledWith("p", 
            { alias: "path", 
              describe: "Path to the lock file", 
              type: "string", 
              demandOption: true }
        );
    });
});