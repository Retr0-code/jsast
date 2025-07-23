import babelTypes from '@babel/types';
import babelTraverse from '@babel/traverse';
const traverse = babelTraverse.default || babelTraverse;

export function concatStrings(ast) {
    traverse(ast, {
        BinaryExpression(path) {
            let { confident, value } = path.evaluate(); // Evaluate the binary expression
            if (!confident)
                return; // Skip if not confident
            
            if (typeof value == "string")
                path.replaceWith(babelTypes.stringLiteral(value)); // Substitute the simplified value
        }
    });
}
