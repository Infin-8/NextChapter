import reducer from "./Reducers/reducer.mjs"
import initial_State from "./State/initialState.mjs"

export default (function () {

    let _state = initial_State
    const getState = () => JSON.parse(JSON.stringify(_state));
    const dispatch = action => { _state = reducer(_state, action); };
    return { getState, dispatch }

})()

