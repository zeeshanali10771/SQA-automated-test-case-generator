

const evaluate = (conditions, condition, vars) => {
    with (vars) {
        const state = eval(condition);
        //check if already exists
        const existingCondition = conditions.find(c => c.condition === condition);
        //if it does, update the state
        if (existingCondition) {
            existingCondition.state = state == existingCondition.state ? existingCondition.state : 'both';
            return state;
        }
        conditions.push({
            condition: condition,
            state: state
        });

        return state;
    }
}


module.exports = evaluate;