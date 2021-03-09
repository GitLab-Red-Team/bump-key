import chalk from "chalk";

const info = (txt, prefix = '[*]') => {
    console.log(chalk`${prefix} {green ${txt}}`);
};

const warn = (txt, prefix = '[-]') => {
    console.log(chalk`${prefix} {orange ${txt}}`);
};

const error = (txt, prefix = '[!]') => {
    console.log(chalk`${prefix} {red ${txt}}`);
};

export default {
    info,
    warn,
    error,
}