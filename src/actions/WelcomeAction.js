import {getItemObject} from '../util/LocalStorage';
import LocalStorageKey from '../util/LocalStorageKey';

export const SHOW_WELCOME = 'SHOW_WELCOME';

export const show = (props) => async (dispatch) =>  {
   //读取local
    const localUserObj = await getItemObject(LocalStorageKey.USER);
    console.log(localUserObj);
    //换取token

}


