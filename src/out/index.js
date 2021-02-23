import chalk from "chalk";

export const info = (txt) => {
    console.log(chalk`[*] {green ${txt}}`);
};

export const warn = (txt) => {
    console.log(chalk`[-] {orange ${txt}%`);
};

export const error = (txt) => {
    console.log(chalk`[!] {red ${txt}%`);
};
