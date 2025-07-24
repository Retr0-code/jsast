/*
    Copyright (C) 2023 Nikita Retr0-code Korneev

    jsast.js is free software: you can redistribute, modify it
    under the terms of the MIT License.

    You should have received a copy of MIT License along with jsast.js.
    If not, see <https://opensource.org/license/MIT.
*/

import babelTypes from '@babel/types';
import babelTraverse from '@babel/traverse';
const traverse = babelTraverse.default || babelTraverse;

export function cleanupUnusedCode(ast) {
    traverse(ast, {
        "VariableDeclarator|FunctionDeclaration"(path) {
            const binding = path.scope.getBinding(path.node.id.name);

            if (!binding.constant)
                return;

            let removable = true;
            if (babelTypes.isArrayExpression(path.node.init)) {
                for (const referencePath of binding.referencePaths) {
                    const { parentPath: refParentPath } = referencePath;
                    const { object, computed, property } = refParentPath.node;
                    // Criteria to be a valid path for replacement:
                    // The refParent must be of type MemberExpression
                    // The "object" field of the refParent must be a reference to the array (the original referencePath)
                    // The "computed" field of the refParent must be true (indicating use of bracket notation)
                    // The "property" field of the refParent must be a numeric literal, so we can access the corresponding element of the array by index.
                    if (
                        !(
                            babelTypes.isMemberExpression(refParentPath.node) &&
                            object == referencePath.node &&
                            computed == true &&
                            babelTypes.isNumericLiteral(property)
                        )
                    )
                        removable = false;
                }
            } else
                removable = !binding.referenced;

            if (removable)
                path.remove();
        },
        EmptyStatement(path) {
            path.remove();
        }
    });
}
