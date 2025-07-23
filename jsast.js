import fs from 'fs';
import path from 'path';
import { parseArgs } from 'node:util';
import { astGenerate, astCompile, deobfuscationMethods } from './deobfuscation/general.js';

const DEFAULT_FILE_ENCODING = 'utf8';
const DEFAULT_OUTPUT_FILE = '/dev/stdout';
const DEFAULT_AST_PARAMETER = false;

function showHelp() {
    console.log(`Usage: ${path.basename(process.argv[1])} [OPTIONS]
DESCRIPTION:
\tGenerates AST of JavaScript a given script.

OPTIONS:
\t[-h|--help]\t\tShows this message and exits.
\t[-P|--stdin]\t\tReads script from stdin.
\t[-e|--encoding]\t\tSets encoding of input/output file content (default='${DEFAULT_FILE_ENCODING}').
\t[-o|--output]\t\tSets output file (default='${DEFAULT_OUTPUT_FILE}').
\t[-s|--script]\t\tInput script file to process.
\t[-a|--ast]\t\tOutput only AST, without deobfuscation. (default=${DEFAULT_AST_PARAMETER})
\t[-x|--unhex]\t\tDecodes hexlified/unicode-encoded strings.
\t[-d|--deref]\t\tDereferences array values and constants, substitutes as constants.
\t[-c|--concat]\t\tConcatenates strings to one.
\t[-D|--decrypt]\t\tDecrypt strings.
`);
}

function main() {
    const options = {
        args: process.argv.slice(2),
        strict: true,
        options: {
            // Print usage instructions
            'help': {
                type: 'boolean',
                short: 'h',
                default: false,
            },
            // Pipe data from stdin
            'stdin': {
                type: 'boolean',
                short: 'P',
                default: false,
            },
            // Text encoding for local input/output files
            'encoding': {
                type: 'string',
                short: 'e',
                default: DEFAULT_FILE_ENCODING
            },
            // Output file
            'output': {
                type: 'string',
                short: 'o',
                default: DEFAULT_OUTPUT_FILE
            },
            // Input script file
            'script': {
                type: 'string',
                short: 's',
                default: ''
            },
            'ast': {
                type: 'boolean',
                short: 'a',
                default: DEFAULT_AST_PARAMETER
            },
            'unhex': {
                type: 'boolean',
                short: 'x',
                default: false
            },
            'deref': {
                type: 'boolean',
                short: 'd',
                default: false
            },
            'concat': {
                type: 'boolean',
                short: 'c',
                default: false
            },
            'decrypt': {
                type: 'boolean',
                short: 'D',
                default: false
            }
        }
    }
    let parser = null;
    try {
        parser = parseArgs(options);
    } catch (error) {
        console.error('Error: Unable to parse command line arguments.');
        process.exit(1);
    }
    const args = parser.values;

    if (args.help) {
        showHelp();
        process.exit(0);
    }

    if (!(args.stdin ^ Boolean(args.script))) {
        console.error('Error: No script file supplied (or both stdin and script options are used simultaneously).\n');
        process.exit(1);
    }

    // Read script
    let scriptContent = '';
    try {
        if (args.stdin) {
            scriptContent = fs.readFileSync(process.stdin.fd, args.encoding);
        } else if (args.script) {
            scriptContent = fs.readFileSync(args.script, args.encoding);
        }
    } catch (error) {
        console.error('Error: Unable to read file content.');
        process.exit(1);
    }

    var ast = astGenerate(scriptContent);
    if (args.ast) {
        try {
            fs.writeFileSync(args.output, JSON.stringify(ast));
        } catch (error) {
            console.error('Error: Unable to write file.');
            process.exit(1);
        }
        process.exit(0);
    }

    for (const method in deobfuscationMethods) {
        if (Object.hasOwn(args, method)) {
            ast = deobfuscationMethods[method](ast)
        }
    }

    try {
        let sourceCode = astCompile(ast);
        if (sourceCode != '')
            fs.writeFileSync(args.output, sourceCode);
        else
            process.exit(1);
    } catch (error) {
        console.error('Error: Unable to write file.');
        process.exit(1);
    }
}

main();
