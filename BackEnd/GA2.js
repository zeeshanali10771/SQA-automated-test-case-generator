const {getCoverage} = require('./statementCoverage.js');
const {getBranchCoverage} = require('./branchCoverage.js');
const {getConditionCoverage} = require('./conditionCoverage.js');

class Line {
    constructor() {
        this.lines = [];
    }
}

class Value {
    constructor() {
        this.values = [];
    }
}

class Individual {
    constructor() {
        this.setLines = [];
        this.coverage = [];
        this.set = [];
        this.size = 0;
        this.prev = [];
    }
}

let literals = [];
let globalbestIndividual=null;

function compareLines(line1, line2) {
    const range = Math.min(line1.lines.length, line2.lines.length);

    for (let i = 0; i < range; i++) {
        if (line1.lines[i] !== line2.lines[i]) {
            return false;
        }
    }

    return true;
}

function fitnessFunction(individual) {

    let fitness = individual.coverage[0];

    // for (let i = 1; i < individual.coverage.length; i++) {
    //     if (!compareLines(individual.setLines[i], individual.setLines[i - 1])) {
    //         fitness += individual.coverage[i];
    //     }
    // }

    return fitness;
}

function generateRandomValues(individual) {
    const size = individual.set.length;

    for (let i = 0; i < size; i++) {
        const size2 = individual.set[i].values.length;

        for (let j = 0; j < size2; j++) {

            const ran = Math.floor(Math.random() * 7);

            if(ran === 0) {

                const prob = Math.floor(Math.random() * 5);

                switch (prob) {
                    case 0:
                        individual.set[i].values[j] = ((Math.random() * 1000000) + 101) * -1;
                        break;
                    case 1:
                        individual.set[i].values[j] = (Math.floor(Math.random() * 100) + 1) * -1;
                        break;
                    case 2:
                        individual.set[i].values[j] = 0;
                        break;
                    case 3:
                        individual.set[i].values[j] = Math.floor(Math.random() * 100) + 1;
                        break;
                    case 4:
                        individual.set[i].values[j] = ((Math.random() * 1000000) + 101);
                        break;
                }
            }
            else {

                const p = Math.floor(Math.random() * 3);

                if(p === 0) {

                    const prob = Math.floor(Math.random() * 7);

                    switch (prob) {
                        case 0:
                            individual.set[i].values[j] = (Math.floor(Math.random() * 100) + 1) * -1;
                            break;
                        case 1:
                            individual.set[i].values[j] = 0;
                            break;
                        case 2:
                            individual.set[i].values[j] = Math.floor(Math.random() * 100) + 1;
                            break;
                        case 3:
                            individual.set[i].values[j] = (Math.floor(Math.random() * 10) + 1) * -1;
                            break;
                        case 4:
                            individual.set[i].values[j] = Math.floor(Math.random() * 10) + 1;
                            break;
                        case 5:
                            individual.set[i].values[j] = (Math.floor(Math.random() * 5) + 1) * -1;
                            break;
                        case 6:
                            individual.set[i].values[j] = Math.floor(Math.random() * 5) + 1;
                            break;
                    }
                }
                else {
                    const inner_size = literals.length;
                    const prob = Math.floor(Math.random() * inner_size);

                    individual.set[i].values[j] = literals[prob];
                }
            }
        }
    }
}

function mutate(individual) {
    const size = individual.set.length;
    const ran = Math.floor(Math.random() * size);
    const size2 = individual.set[ran].values.length;
    const ran2 = Math.floor(Math.random() * size2);

    const rand = Math.floor(Math.random() * 7);

    if(rand === 0) {

        const prob = Math.floor(Math.random() * 5);

        switch (prob) {
            case 0:
                individual.set[ran].values[ran2] = ((Math.random() * 1000000) + 101) * -1;
                break;
            case 1:
                individual.set[ran].values[ran2] = (Math.floor(Math.random() * 100) + 1) * -1;
                break;
            case 2:
                individual.set[ran].values[ran2] = 0;
                break;
            case 3:
                individual.set[ran].values[ran2] = Math.floor(Math.random() * 100) + 1;
                break;
            case 4:
                individual.set[ran].values[ran2] = ((Math.random() * 1000000) + 101);
                break;
        }
    }
    else {

        const p = Math.floor(Math.random() * 3);

        if(p === 0) {

            const prob = Math.floor(Math.random() * 7);

            switch (prob) {
                case 0:
                    individual.set[ran].values[ran2] = (Math.floor(Math.random() * 100) + 1) * -1;
                    break;
                case 1:
                    individual.set[ran].values[ran2] = 0;
                    break;
                case 2:
                    individual.set[ran].values[ran2] = Math.floor(Math.random() * 100) + 1;
                    break;
                case 3:
                    individual.set[ran].values[ran2] = (Math.floor(Math.random() * 10) + 1) * -1;
                    break;
                case 4:
                    individual.set[ran].values[ran2] = Math.floor(Math.random() * 10) + 1;
                    break;
                case 5:
                    individual.set[ran].values[ran2] = (Math.floor(Math.random() * 5) + 1) * -1;
                    break;
                case 6:
                    individual.set[ran].values[ran2] = Math.floor(Math.random() * 5) + 1;
                    break;
            }
        }
        else {
            const inner_size = literals.length;
            const prob = Math.floor(Math.random() * inner_size);

            individual.set[ran].values[ran2] = literals[prob];
        }
    }
}

function crossover(individual1, individual2) {
    const size = individual1.set.length;
    const ran = Math.floor(Math.random() * size);

    for (let i = 0; i < size; i++) {
        const size2 = individual1.set[i].values.length;

        for (let j = ran; j < size2; j++) {
            const temp = individual1.set[i].values[j];
            individual1.set[i].values[j] = individual2.set[i].values[j];
            individual2.set[i].values[j] = temp;
        }
    }
}

function runGA(numGenerations, population, func_json, lit, type) {
    globalbestIndividual = null;
    const populations = [];
    let ss = 1;

    if(func_json.returnCount !== 0)
        ss = func_json.returnCount;

    literals = lit;

    //console.log("function name: " + func_json.functionName + " parameters: " + func_json.parametersLength);

    for (let i = 0; i < population; i++) {
        const individual = new Individual();
        for (let j = 0; j < ss; j++) {
            individual.set.push(new Value());
            individual.set[j].values = [];
            for (let k = 0; k < func_json.parametersLength; k++) {
                individual.set[j].values.push(0);
            }
        }
        generateRandomValues(individual);
        populations.push(individual);
    }

    while (true) {
        let flag = false;
        for (let generation = 0; generation < numGenerations; generation++) {
            const fitnesses = new Array(population);

            for (let i = 0; i < population; i++) {

                // console.log(populations[i].set);

                if (JSON.stringify(populations[i].set) !== JSON.stringify(populations[i].prev))
                {
                    if(type === "statement")
                        populations[i].coverage[0] = getCoverage(func_json.functionName, populations[i].set);
                    else if(type === "branch")
                        populations[i].coverage[0] = getBranchCoverage(func_json.functionName, populations[i].set);
                    else if(type === "condition")
                        populations[i].coverage[0] = getConditionCoverage(func_json.functionName, populations[i].set);
                }

                // console.log("Generation " + generation + " Coverage " + i + ": " + populations[i].coverage[0]);

                if(populations[i].coverage[0] === 100) {
                    flag = true;
                    break;
                }

                for(let j = 0; j < populations[i].set.length; j++) {
                    populations[i].prev[j] = new Value();
                    populations[i].prev[j].values = [];
                    for(let k = 0; k < populations[i].set[j].values.length; k++) {
                        populations[i].prev[j].values.push(populations[i].set[j].values[k]);
                    }
                }
            }

            if(flag) {
                break;
            }

            //sort by fitness in descending order
            for (let i = 0; i < population; i++) {
                for (let j = i + 1; j < population; j++) {
                    if (fitnesses[i] < fitnesses[j]) {
                        const temp = populations[i];
                        populations[i] = populations[j];
                        populations[j] = temp;

                        const temp2 = fitnesses[i];
                        fitnesses[i] = fitnesses[j];
                        fitnesses[j] = temp2;
                    }
                }
            }

            let reproduce = Math.floor(population * 0.5);
            for(let i = 0; i < reproduce; i++) {
                const prob = Math.floor(Math.random() * 2);
                if (prob === 0) {
                    crossover(populations[i], populations[i+1]);
                } else {
                        mutate(populations[i]);
                }
            }

            
        }

        let bestFitness = populations[0].coverage[0];
        let bestIndividual = populations[0];

        for (let i = 0; i < population; i++) {
            const fitness = fitnessFunction(populations[i]);

            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestIndividual = populations[i];
            }
        }

        if(globalbestIndividual === null) {
            globalbestIndividual = bestIndividual;
        }
        else {
            if(bestFitness > fitnessFunction(globalbestIndividual)) {
                globalbestIndividual = bestIndividual;
            }
        }

        if (bestFitness === 100 || populations[0].set.length > 50) {
            break;
        }

        ss++;
        for (let i = 0; i < population; i++) {
            populations[i].set.push(new Value());
            populations[i].set[ss - 1].values = [];
            for (let j = 0; j < func_json.parametersLength; j++) {
                populations[i].set[ss - 1].values.push(0);
            }
            generateRandomValues(populations[i]);
        }
    }

    for(let i = 0; i < globalbestIndividual.set.length; i++) {
        for(let j = i+1; j < globalbestIndividual.set.length; j++) {
            if(JSON.stringify(globalbestIndividual.set[i].values) === JSON.stringify(globalbestIndividual.set[j].values)) {
                globalbestIndividual.set.splice(j, 1);
                j--;
            }
        }
    }

    return globalbestIndividual;
}

// const numGenerations = 100;
// const populationSize = 100;

// const func ={
//     function_name: "testConditions",
//     parameters: 3
// }


// runGA(numGenerations, populationSize, func);

module.exports.runGA = runGA;