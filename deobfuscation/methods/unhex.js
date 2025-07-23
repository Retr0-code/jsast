/*
    Copyright (C) 2023 Nikita Retr0-code Korneev

    jsast.js is free software: you can redistribute, modify it
    under the terms of the MIT License.

    You should have received a copy of MIT License along with jsast.js.
    If not, see <https://opensource.org/license/MIT.
*/

import babelTraverse from '@babel/traverse';
const traverse = babelTraverse.default || babelTraverse;

export function unhexStrings(ast) {
    traverse(ast, {
        StringLiteral(path) {
            if (path.node.extra)
                delete path.node.extra;
        }
    });
}
