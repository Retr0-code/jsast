/*
    Copyright (C) 2023 Nikita Retr0-code Korneev

    jsast.js is free software: you can redistribute, modify it
    under the terms of the MIT License.

    You should have received a copy of MIT License along with jsast.js.
    If not, see <https://opensource.org/license/MIT.
*/

import babelParser from '@babel/parser';
import babelGenerator from '@babel/generator';

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
