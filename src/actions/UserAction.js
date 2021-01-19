export const FETCH_USERS = 'FETCH_USERS';
export const ADD_USER = 'ADD_USER';
export const UPDATE_USER = 'UPDATE_USER';

export const updateUser = user => async (dispatch) =>  {dispatch({type: UPDATE_USER, user: user})}
export const addUser = user => async (dispatch) =>  {dispatch({type: ADD_USER, user: user})}
export const fetchUsers = users => async (dispatch) =>  {dispatch({type: FETCH_USERS, users: users})}