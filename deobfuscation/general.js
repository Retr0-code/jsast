import babelParser from '@babel/parser';
import babelGenerator from '@babel/generator';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const methods = require("./methods")

export const deobfuscationMethods = {
    unhex: methods.unhex,
    concat: methods.concat,
    deref: methods.deref
};

export function astGenerate(script) {
    let ast = null;
    try {
        ast = babelParser.parse(script, {
            sourceType: 'module',
            plugins: ['jsx']
        });
        return ast;
    } catch (error) {
        console.error('Error: Unable to parse the script\'s AST.');
        return ast;
    }
}

export function astCompile(ast) {
    try {
        return babelGenerator.generate(ast, { comments: false }).code;
    } catch (error) {
        console.error('Error: Unable to generate JS code from the AST.');
        console.error(error.message);
        return '';
    }
}