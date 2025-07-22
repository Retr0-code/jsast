// const babelTypes = require('@babel/types');
import babelParser from '@babel/parser';
// const babelTraverse = require('@babel/traverse').default;
// const babelGenerator = require('@babel/generator').default;

/** Constructor for DeobfuscationMethod objects
 * 
 * @param name corresponds to name of the command-line argument.
 * @param ast AST object that will pass deobfuscation.
 * @param deobfuscate reference to deobfuscation function that MUST to return AST. 
 */
export function DeobfuscationMethod(name, ast, deobfuscate) {
    this.name = name;
    this.ast = ast;
    this.deobfuscate = deobfuscate;
}

export function astGenerate(script, output) {
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

