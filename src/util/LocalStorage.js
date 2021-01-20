import AsyncStorage from '@react-native-async-storage/async-storage';

const setItemValue = async (key,value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch(e) {

    }
}

const setItemObject = async (key,obj) => {
    try {
        const jsonValue = JSON.stringify(obj);
        await AsyncStorage.setItem(key, jsonValue);
    } catch(e) {

    }
}
const getItemValue = async (key) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch(e) {
        return null;
    }
}

const getItemObject = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        return null;
    }
}
const getAllKeys = async () => {
    let keys = []
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch(e) {

    }
    return keys;
}
const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch(e) {
    }
}

const mergeItemObject= async (key,obj) => {
    try {
        await AsyncStorage.mergeItem(key,JSON.stringify(obj));
    } catch(e) {
    }
}

export {
    getItemValue,getItemObject,getAllKeys,removeItem,setItemValue,setItemObject
}