const recast = require('recast');
const fs = require('fs');
const esprima = require('esprima');
const estraverse = require('estraverse');

const fileName='output2.js';

function countConditions(func) {
    // Parse the function into an AST
    const ast = esprima.parseScript(func.toString());

    let conditionCount = 0;

    // Traverse the AST
    estraverse.traverse(ast, {
        enter: function (node) {
            // Increment the branch count if the node is a branch
            switch (node.type) {
                case 'IfStatement':
                case 'WhileStatement':
                case 'ForStatement':
                case 'DoWhileStatement':
                    const condition = recast.print(node.test).code;
                    // Divide the condition into subconditions
                    const subconditions = condition.split(/&&|\|\|/);
                    conditionCount += subconditions.length*2;
                    break;
                case 'SwitchStatement':
                    conditionCount += node.cases.length;
                    break;
                default:
                    break;
            }
        }
    });

    return conditionCount;
}

let branches = null;

const ranbranches=() => {
    let branches = 0;
    let conditions = JSON.parse(fs.readFileSync('conditions2.json', 'utf8'));
    conditions.forEach(condition => {
       if(condition.state == 'both')
       {
           branches+=2;
       }
         else
         {
              branches+=1;
            }
    });
    return branches;
}

const setBranches = () => {
    const code = fs.readFileSync('./main.js', 'utf8');
    branches = countConditions(code);
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
    fs.appendFileSync(fileName,`fs.writeFileSync("conditions2.json", JSON.stringify(conditions));`);

    delete require.cache[require.resolve('./output2.js')];

    require('./output2.js');

    // Run the coverage check
    const branchCount = ranbranches();
    const coverage = (branchCount/branches)*100;

    // Restore file
    fs.copyFileSync(fileName + '.bak', fileName);

    return coverage;
};


module.exports.getConditionCoverage = getCoverage;
module.exports.setConditions = setBranches;