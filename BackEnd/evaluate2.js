

const evaluate = (conditions, condition, vars) => {
    with (vars) {
        const state = eval(condition);
        const subconditions = condition.split(/&&|\|\|/).map(x => x.trim());
        if(subconditions.length>1)
        {
            
            subconditions.forEach(subcondition => {
                const subState=eval(subcondition)
                const existingCondition = conditions.find(c => c.condition === subcondition);
                if (existingCondition) {
                    existingCondition.state = subState == existingCondition.state ? existingCondition.state : 'both';
                    return state;
                }
                conditions.push({
                    condition: subcondition,
                    state: subState
                });
            });
        }
        else
        {
            const existingCondition = conditions.find(c => c.condition === condition);
                if (existingCondition) {
                    existingCondition.state = state == existingCondition.state ? existingCondition.state : 'both';
                    return state;
                }
                conditions.push({
                    condition: condition,
                    state: state
                });
        }


        
       
        //check if already exists
        const existingCondition = conditions.find(c => c.condition === condition);
        //if it does, update the state
        if (existingCondition) {
            existingCondition.state = state == existingCondition.state ? existingCondition.state : 'both';
            return state;
        }
        

        return state;
    }
}


module.exports = evaluate;