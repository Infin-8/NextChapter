export default (function () {

    let state = {
        budget: 0,
        expenses: 0,
        bills: [],
        inputs: {},
        edits: {},
        editId: "",
        modal: false
    }

    const getState = () => JSON.parse(JSON.stringify(state))
    const setState = (update) => {
        state = { ...state, ...update }
    }
    const genID = () => Math.random() * 9876543

    return { getState, setState, genID }

})()

