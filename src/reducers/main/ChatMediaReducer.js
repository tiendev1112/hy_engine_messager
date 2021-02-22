import {handleActions} from 'redux-actions';
import * as chatMediaAction from '../../actions/ChatMediaAction'
const initialState = {
    mediaSession:null,
    localStream:null,
    user:{},
    remoteStream:null,
    isIncoming :false,
    isAudio : false,
    isLoudSpeaker : false,
    isCameraFront : true,
    isMute : false,
    status : 1
};

export default handleActions(
    {
        [chatMediaAction.SET_MEDIA_SESSION]: (state, action) => {
            const {mediaSession} = action;
            console.log(mediaSession);
             console.log(state.mediaSession=mediaSession);
             console.log(state);
             return state;
        },
        [chatMediaAction.SET_LOCAL_STREAM]: (state, action) => {
            const {localStream} = action;
            return {...state,localStream:localStream};
        },
        [chatMediaAction.SET_INCOMING_FLAG]: (state, action) => {
            const {incomingFlag} = action;
            return {...state,isIncoming:incomingFlag};
        },
        [chatMediaAction.SET_AUDIO_FLAG]: (state, action) => {
            const {audioFlag} = action;
            return {...state,isAudio: audioFlag};
        },
        [chatMediaAction.SET_CAMERA_FRONT_FLAG]: (state, action) => {
            const {cameraFrontFlag} = action;
            return {...state,isCameraFront: cameraFrontFlag};
        },
        [chatMediaAction.SET_MUTE_FLAG]: (state, action) => {
            const {muteFlag} = action;
            console.log(muteFlag);
            return {...state,isMute: muteFlag};
        },
        [chatMediaAction.SET_LOUDSPEAKER_FLAG]: (state, action) => {
            const {loudSpeakerFlag} = action;
            console.log(loudSpeakerFlag)
            return {...state,isLoudSpeaker: loudSpeakerFlag};
        },
        [chatMediaAction.SET_STATUS]: (state, action) => {
            const {status} = action;
            return {...state,status: status};
        },
        [chatMediaAction.HANG_OFF_SESSION]: (state, action) => {
            console.log(state);
            if(state.mediaSession){
                console.log("session ending");
                state.mediaSession.end();
                state.mediaSession.parent.endAllSessions();
            }
            return {...state,mediaSession: null};
        }
    }
    , initialState)
