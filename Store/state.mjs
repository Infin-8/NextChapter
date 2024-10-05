export default (function () {

    let _state = {
        budget: 0,
        expenses: 0,
        bills: [],
        inputs: {},
        edits: {},
        editId: "",
        modal: false
    }

    const getState = () => JSON.parse(JSON.stringify(_state))
    const setState = (update) => {
        _state = { ..._state, ...update }
    }
    const genID = () => Math.floor(Date.now() * Math.random());

    return { getState, setState, genID }

})()

