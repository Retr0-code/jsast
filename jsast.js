const { babelTypes } = require('@babel/types');
const { babelParser } = require('@babel/parser');
const { babelTraverse } = require('@babel/traverse').default;
const { babelGenerator } = require('@babel/generator').default;

const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');

const DEFAULT_FILE_ENCODING = 'utf8';
const DEFAULT_OUTPUT_FILE = '/dev/stdout';

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
`);
}

function readFileStdin() {

}

function main(){
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
            'script': {
                type: 'string',
                short: 's',
                default: ''
            }
        }
    }
    const parser = parseArgs(options);
    const args = parser.values;

    if (args.help) {
        showHelp();
        process.exit(0);
    }

    if (!(args.stdin ^ Boolean(args.script))) {
        console.error("Error: No script file supplied (or both stdin and script options are used simultaneously).\n");
        process.exit(1);
    }

    // Read script
    let scriptContent = '';
    if (args.stdin) {
        scriptContent = readFileStdin();
    } else if (args.script) {
        scriptContent = fs.readFileSync(args.script, args.encoding);
    } else {
        console.error("Error: Unable to read file content.");
        process.exit(1);
    }
    console.log(scriptContent);
}

if (require.main === module) {
    main();
}
