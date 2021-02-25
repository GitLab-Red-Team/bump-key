import npmCheck from 'npm-check';

export const recon = async (options) => {
    return npmCheck(options).then(results => {
        return results.get('packages');
    });
};