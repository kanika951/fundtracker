let initialState = {
    requests: []
}               

const changeRequests = (state = initialState, action) => {
    switch(action.type){
        case "ADDREQUEST": return {
            ...state,
            requests:[...state.requests,action.payload]
        };
        case "DELETEREQUEST": return {
            ...state,
            requests : state.requests.filter(request => !(request.username === action.payload.username && request.amount === action.payload.amount) ),
        };
        default: return state;
    
    }
}

export default changeRequests;