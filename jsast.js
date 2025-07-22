const babelTypes = require('@babel/types');
const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse').default;
const babelGenerator = require('@babel/generator').default;

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
function astGenerate(script, output) {
    let ast = null;
    try {
        ast = babelParser.parse(script, {
            sourceType: 'module',
            plugins: ['jsx']
        });
        fs.writeFileSync(output, JSON.stringify(ast));
    } catch (error) {
        console.error('Error: Unable to parse the script\'s AST.');
    }
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
            }
        }
    }
    let parser = null;
    try {
        parser = parseArgs(options);
    } catch (error) {
        conseole.error('Error: Unable to parse command line arguments.');
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
    try {
        let scriptContent = '';
        if (args.stdin) {
            scriptContent = fs.readFileSync(process.stdin.fd, args.encoding);
        } else if (args.script) {
            scriptContent = fs.readFileSync(args.script, args.encoding);
        }
    } catch (error) {
        console.error('Error: Unable to read file content.');
        process.exit(1);
    }


    astGenerate(scriptContent, args.output);
}

if (require.main === module) {
    main();
}
