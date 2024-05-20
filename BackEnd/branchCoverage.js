const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');

let fileName = 'output.js';

function countBranches(func) {
    // Parse the function into an AST
    const ast = esprima.parseScript(func.toString());

    let branchCount = 0;

    // Traverse the AST
    estraverse.traverse(ast, {
        enter: function (node) {
            // Increment the branch count if the node is a branch
            switch (node.type) {
                case 'IfStatement':
                case 'WhileStatement':
                case 'ForStatement':
                case 'DoWhileStatement':
                    branchCount += 2;
                    break;
                case 'SwitchStatement':
                    branchCount += node.cases.length;
                    break;
                default:
                    break;
            }
        }
    });

    return branchCount;
}

let branches = null;

const ranbranches = () => {
    let branches = 0;
    let conditions = JSON.parse(fs.readFileSync('conditions.json', 'utf8'));
    conditions.forEach(condition => {
        if (condition.state == 'both') {
            branches += 2;
        }
        else {
            branches += 1;
        }
    });
    return branches;
}

const setBranches = () => {
    const code = fs.readFileSync('./main.js', 'utf8');
    branches = countBranches(code);
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
    fs.appendFileSync(fileName,`fs.writeFileSync("conditions.json", JSON.stringify(conditions))`);

    delete require.cache[require.resolve('./output.js')];

    require('./output.js');

    // Run the coverage check
    const branchCount = ranbranches();
    const coverage = (branchCount/branches)*100;

    // Restore file
    fs.copyFileSync(fileName + '.bak', fileName);

    return coverage;
};


module.exports.getBranchCoverage = getCoverage;
module.exports.setBranches = setBranches;