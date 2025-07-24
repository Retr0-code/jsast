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


function derefArrays(path, declaration) {
    const stringArrayElements = [];
    for (const elementNode of declaration.init.elements) {
        if (!babelTypes.isStringLiteral(elementNode))
            return;
        else
            stringArrayElements.push(elementNode);
    }
    // Get the binding of the array.
    const binding = path.scope.getBinding(declaration.id.name);

    if (!binding)
        return;

    const { constant, referencePaths } = binding;

    // This wouldn't be safe if the array was not constant.
    if (!constant)
        return;

    for (const referencePath of referencePaths) {
        const { parentPath: refParentPath } = referencePath;
        const { object, computed, property } = refParentPath.node;
        // Criteria to be a valid path for replacement:
        // The refParent must be of type MemberExpression
        // The "object" field of the refParent must be a reference to the array (the original referencePath)
        // The "computed" field of the refParent must be true (indicating use of bracket notation)
        // The "property" field of the refParent must be a numeric literal, so we can access the corresponding element of the array by index.
        if (
            (
                babelTypes.isMemberExpression(refParentPath.node) &&
                object == referencePath.node &&
                computed == true &&
                babelTypes.isNumericLiteral(property)
            )
        )
            // If the above conditions are met:
            // Replace the parentPath of the referencePath (the actual MemberExpression) with it's actual value.
            refParentPath.replaceWith(stringArrayElements[property.value]);
    }
}

function derefConsts(path, declaration) {
    const binding = path.scope.getBinding(declaration.id.name);
    if (!binding)
        return;

    const { constant, referencePaths } = binding;
    if (!constant)
        return;

    for (let referencedPath of referencePaths)
        referencedPath.replaceWith(declaration.init);
}

export function derefArraysConsts(ast) {
    traverse(ast, {
        VariableDeclaration(path) {
            const { declarations } = path.node;
            for (const declaration of declarations) {
                if (babelTypes.isArrayExpression(declaration.init))
                    derefArrays(path, declaration);

                else if (babelTypes.isLiteral(declaration.init))
                    derefConsts(path, declaration);
            }
        }
    });
}
