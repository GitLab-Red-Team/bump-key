import chalk from "chalk";

export const info = (txt, prefix = '[*]') => {
    console.log(chalk`${prefix} {green ${txt}}`);
};

export const warn = (txt, prefix = '[-]') => {
    console.log(chalk`${prefix} {orange ${txt}}`);
};

export const error = (txt, prefix = '[!]') => {
    console.log(chalk`${prefix} {red ${txt}}`);
};
