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
