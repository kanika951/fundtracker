export const setZero = () => {
    return{
        type: "SETZERO"
    }
}
export const setOne = () => {
    return{
        type: "SETONE"
    }
}
export const setTwo = () => {
    return{
        type: "SETTWO"
    }
}
export const addRequest = (value) => {
    return{
        type: "ADDREQUEST",
        payload: value
    }
}
export const deleteRequest = (value) => {
    return{
        type: "DELETEREQUEST",
        payload: value
    }
}