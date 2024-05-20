const recast = require('recast');
const fs = require('fs');
const b = recast.types.builders;

let code = fs.readFileSync('./main.js', 'utf8');
// Parse the code into an AST
let ast = recast.parse(code);

const concatConditions = (path) => {
    const condition = recast.print(path.node.test).code;
    const variables = condition.match(/[a-z]+/gi);
    const objectProperties = variables ? variables.map(variable =>
        b.property('init', b.identifier(variable), b.identifier(variable))
    ) : [];

    const evaluateCall = b.callExpression(
        b.identifier('evaluate'),
        [
            b.identifier('conditions'),
            b.literal(condition),
            b.objectExpression(objectProperties)
        ]
    );
    path.node.test = evaluateCall;
}
const concatswitchcase = (path) => {
    let condition = recast.print(path.node.test).code;
    if (path.node.test == null) {
        condition = "'@'";
    }
    condition = condition.split(',').map(x => `${x}==${x}`).join(' && ');
    const variables = condition.match(/[a-z]+/gi);
    const objectProperties = variables ? variables.map(variable =>
        b.property('init', b.identifier(variable), b.identifier(variable))
    ) : [];

    const evaluateCall = b.callExpression(
        b.identifier('evaluate'),
        [
            b.identifier('conditions'),
            b.literal(condition),
            b.objectExpression(objectProperties)
        ]
    );

    path.node.consequent.unshift(b.expressionStatement(evaluateCall));
}
const formulateoutputjs = (fileToCreate, toImport) => {
    code = fs.readFileSync('./main.js', 'utf8');
    ast = recast.parse(code);
    // Add a line at the start of the file to initialize conditions
    ast.program.body.unshift(
        b.variableDeclaration("let", [
            b.variableDeclarator(b.identifier("conditions"), b.arrayExpression([]))
        ])
    );
    // Add a line at the start of the file to import fs
    ast.program.body.unshift(
        b.variableDeclaration("const", [
            b.variableDeclarator(b.identifier("fs"), b.callExpression(
                b.identifier("require"), [b.literal("fs")]
            ))
        ])
    );

    //add a line at the start of the file to import evaluate.js
    ast.program.body.unshift(
        b.variableDeclaration("const", [
            b.variableDeclarator(b.identifier("evaluate"), b.callExpression(
                b.identifier("require"), [b.literal(toImport)]
            ))
        ])
    );

    // Traverse the AST

    recast.visit(ast, {
        visitIfStatement: function (path) {
            // Get the condition from the if statement
            //concatConditions(path);
            // Create a call to the evaluate function
            concatConditions(path);
            // Continue the traversal of child nodes
            this.traverse(path);
            return false;
        },
        visitWhileStatement: function (path) {
            // Get the condition from the while statement
            concatConditions(path);
            // Continue the traversal of child nodes
            this.traverse(path);
            // Increment the condition index if at root
            return false;
        },
        visitForStatement: function (path) {
            // Get the condition from the for statement

            concatConditions(path);
            // Continue the traversal of child nodes
            this.traverse(path);

            // Increment the condition index if at root
            return false;
        },
        visitDoWhileStatement: function (path) {
            // Get the condition from the do while statement
            concatConditions(path);
            // Continue the traversal of child nodes
            this.traverse(path);
            // Increment the condition index if at root
            return false;
        },
        visitSwitchStatement: function (path) {
            // Get the condition from the switch statement
            concatConditions(path);
            // Continue the traversal of child nodes
            this.traverse(path);
            // Increment the condition index if at root
            return false;
        },
        visitSwitchCase: function (path) {
            // Get the condition from the switch case
            concatswitchcase(path);
            // Continue the traversal of child nodes
            this.traverse(path);
            // Increment the condition index if at root
            return false;
        }

    });

    const output = recast.print(ast).code;

    // Write the modified code to a new file
    fs.writeFileSync(fileToCreate, output);
}


module.exports.formulateoutputjs = formulateoutputjs;

// Generate the modified code
