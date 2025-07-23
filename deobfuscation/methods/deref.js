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

export function derefArraysConsts(ast) {
    traverse(ast, {
        VariableDeclaration(path) {
            const { declarations } = path.node;
            if (
                // The VariableDeclaration node must declare only ONE variable.
                declarations.length !== 1 ||
                // It's corresponding VariableDeclarator node must have an init property of type ArrayExpression
                !babelTypes.isArrayExpression(declarations[0].init)
            )
                return;

            const stringArrayElements = [];
            for (const elementNode of declarations[0].init.elements) {
                // ALL of the elements of the ArrayExpression_must be of type StringLiteral
                if (!babelTypes.isStringLiteral(elementNode))
                    return;
                else
                    stringArrayElements.push(elementNode);
            }
            // Store the string array's name in a variable
            const stringArrayName = declarations[0].id.name;
            // Get the path of the identifier. By using this path, we ensure we will ALWAYS correctly refer to the scope of the array
            const idPath = path.get("declarations.0.id");
            // Get the binding of the array.
            const binding = idPath.scope.getBinding(stringArrayName);

            if (!binding)
                return;

            const { constant, referencePaths } = binding;

            // This wouldn't be safe if the array was not constant.
            if (!constant)
                return;
            // This decides if we can remove the array or not.
            // If there are any references to the array that cannot be replaced, it is unsafe to remove the original VariableDeclaration.
            let shouldRemove = true;

            for (const referencePath of referencePaths) {
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
                ) {
                    // If the above conditions aren't met, we've run into a reference that can't be replaced.
                    // Therefore, it'd be unsafe to remove the original variable declaration, since it will still be referenced after our transformation has completed.
                    shouldRemove = false;
                    continue;
                }

                // If the above conditions are met:
                // Replace the parentPath of the referencePath (the actual MemberExpression) with it's actual value.
                refParentPath.replaceWith(stringArrayElements[property.value]);
            }

            if (shouldRemove)
                path.remove();
        }
    });
}
