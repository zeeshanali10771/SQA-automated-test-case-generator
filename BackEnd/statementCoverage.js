const fs = require('fs');
const libCoverage = require('istanbul-lib-coverage');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const path = require('path');
const istanbul = require('istanbul');
const vm = require('vm');

let fileName;

const replaceFunction = (functionName, fileName) => {
    //keep only function of interest and all dependent functions
    let code = fs.readFileSync(fileName, 'utf8');

    let ast = esprima.parseScript(code);

    let functionsToKeep = [];
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
                let functionOfInterest = node.id ? node.id.name : parent.id ? parent.id.name : null;
                if (functionName === functionOfInterest) {
                    functionsToKeep.push(functionOfInterest);
                    functionsToKeep.push(...getFunctionCalls(node));
                }
            }
        }
    });

    // Remove all other functions
    code = removeFunctions(code, functionsToKeep);

    // Write the code to the file
    fs.writeFileSync(fileName, code);
}


const getFunctionInfo = (filename) => {
    fileName = filename;
    // Read the file
    const code = fs.readFileSync(filename, 'utf8');

    // Parse the code into an AST
    const ast = esprima.parseScript(code, { range: true });


    const functionInfo = [];
    const literals = [];
    // Traverse the AST
    estraverse.traverse(ast, {
        enter: function (node) {
            if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
                // Get the function name and parameters length
                const functionName = node.id ? node.id.name : 'anonymous function';
                const parametersLength = node.params.length;

                let returnCount = 0;
                estraverse.traverse(node, {
                    enter: function (innerNode) {
                        if (innerNode.type === 'ReturnStatement') {
                            returnCount++;
                        }
                    }
                });

                functionInfo.push({
                    functionName,
                    parametersLength,
                    returnCount
                });
            }
            else if (node.type === 'Literal') {
                // Add the literal value to the literals array
                literals.push(node.value);
            }
        }
    });
    //filter out duplicates
    let newLs = literals.filter((item, index) => literals.indexOf(item) === index);
    //filter out non-numbers
    newLs = literals.filter(item => typeof item === 'number');
    return { functionInfo, literals: newLs };
}

// // Run the nyc command
const checkCoverage = (testCasesLength) => {
    global.__coverage__ = {};

    // Create a new instrumenter
    const instrumenter = new istanbul.Instrumenter({ includeAllBranches: true, includeAllSources: true, all: true });

    // Instrument the code
    const code = fs.readFileSync(path.resolve(fileName), 'utf-8');
    const instrumentedCode = instrumenter.instrumentSync(code, fileName);

    const context = {
        require: require,
        module: module,
        console: console,
        __coverage__: global.__coverage__,
        // Add any other global objects that your code needs
    };
    // Execute the instrumented code
    vm.runInNewContext(instrumentedCode, context, fileName);


    // Generate the coverage report
    const collector = new istanbul.Collector();
    collector.add(global.__coverage__);


    const reporter = new istanbul.Reporter();
    reporter.addAll(['json', 'clover', 'cobertura', 'lcov']);
    reporter.write(collector, true, () => {
    });


    // Read the coverage report
    let coverageReport = JSON.parse(fs.readFileSync('./coverage/coverage-final.json', 'utf8'));

    // Create a coverage map
    let coverageMap = libCoverage.createCoverageMap(coverageReport);

    // Calculate coverage summary
    let summary = libCoverage.createCoverageSummary();
    coverageMap.files().forEach(function (f) {
        let fc = coverageMap.fileCoverageFor(f);
        summary.merge(fc.toSummary());
    });
    //console.log(summary.toJSON());
    let totalStatements = summary.toJSON().statements.total;
    let coveredStatements = summary.toJSON().statements.covered;
    totalStatements = totalStatements - testCasesLength;
    coveredStatements = coveredStatements - testCasesLength;
    let statementCoverage = (coveredStatements / totalStatements) * 100;
    return statementCoverage;
};

function getFunctionCalls(node) {
    let functionCalls = [];
    estraverse.traverse(node, {
        enter: function (node) {
            if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
                functionCalls.push(node.callee.name);
            }
        }
    });
    return functionCalls;
}

function removeFunctions(code, functionsToKeep) {
    let ast = esprima.parseScript(code);

    ast = estraverse.replace(ast, {
        enter: function (node) {
            if ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') &&
                node.id && !functionsToKeep.includes(node.id.name)) {
                return this.remove();
            }
        }
    });

    return escodegen.generate(ast);
}

const getCoverage = (functionName, paramsSet) => {
    // Store copy of file
    fs.copyFileSync(fileName, fileName + '.bak');

    // Build up all the function calls in memory
    const functionCalls = paramsSet.map(params => {
        let paramsString;
        if (params.values.length > 0) {
            paramsString = params.values.join(',');
        }
        else {
            paramsString = params.join(',');
        }
        return `${functionName}(${paramsString});\n`;
    }).join('');

    // Write all the function calls to the file at once
    fs.appendFileSync(fileName, functionCalls);

    // Run the coverage check
    const coverage = checkCoverage(paramsSet.length);

    // Restore file
    fs.copyFileSync(fileName + '.bak', fileName);

    return coverage;
};


// const functionInfo = getFunctionInfo('main.js');
//Example call
//getCoverage('validateNumbers', [[1, 1, 2]]);

// Usage
// console.log(functionInfo);

// console.log(getCoverage(functionInfo.functionInfo[0].functionName, [
//     { values: [1, 0, 0] },

// ]));

module.exports.getFunctionInfo = getFunctionInfo;
module.exports.getCoverage = getCoverage;
module.exports.replaceFunction = replaceFunction;