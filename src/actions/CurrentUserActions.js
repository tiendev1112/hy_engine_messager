
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const setCurrentUser = currentUser => async (dispatch) =>  {dispatch({type: SET_CURRENT_USER, currentUser: currentUser})}