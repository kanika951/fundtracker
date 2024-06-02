const initialState =0;

const changeTheNumber = (state = initialState, action) => {
    switch(action.type){
        case "SETZERO": return 0;
        case "SETONE": return 1;
        case "SETTWO": return 2;
        default: return state;
    }
}

export default changeTheNumber;