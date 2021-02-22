
export const SET_LOCAL_STREAM = 'SET_LOCAL_STREAM';
export const SET_MEDIA_SESSION = 'SET_MEDIA_SESSION';
export const SET_INCOMING_FLAG = 'SET_INCOMING_FLAG';
export const SET_AUDIO_FLAG = 'SET_AUDIO_FLAG';
export const SET_CAMERA_FRONT_FLAG = 'SET_CAMERA_FRONT_FLAG';
export const SET_MUTE_FLAG = 'SET_MUTE_FLAG';
export const SET_LOUDSPEAKER_FLAG = 'SET_LOUDSPEAKER_FLAG';
export const SET_STATUS = 'SET_STATUS';
export const HANG_OFF_SESSION = 'HANG_OFF_SESSION';

export const setMediaSession = (mediaSession) => async (dispatch) =>  {dispatch({type: SET_MEDIA_SESSION, mediaSession: mediaSession})};
export const setLocalStream = (localStream) => async (dispatch) =>  {dispatch({type: SET_LOCAL_STREAM, localStream: localStream})};
export const setIncomingFlag = (incomingFlag) => async (dispatch) =>  {dispatch({type: SET_INCOMING_FLAG, incomingFlag: incomingFlag})};
export const setAudioFlag = (audioFlag) => async (dispatch) =>  {console.log(audioFlag);dispatch({type: SET_AUDIO_FLAG, audioFlag: audioFlag})};
export const setCameraFrontFlag = (cameraFrontFlag) => async (props,dispatch) =>  {console.log(cameraFrontFlag);dispatch({type: SET_CAMERA_FRONT_FLAG, cameraFrontFlag: cameraFrontFlag})};
export const setLoudSpeakerFlag = (loudSpeakerFlag) => async (props,dispatch) =>  {console.log(loudSpeakerFlag);dispatch({type: SET_LOUDSPEAKER_FLAG, loudSpeakerFlag: loudSpeakerFlag})};
export const setMuteFlag = (muteFlag) => async (dispatch) =>  {console.log(muteFlag);dispatch({type: SET_MUTE_FLAG, muteFlag: muteFlag})};
export const setStatus = (status) => async (dispatch) =>  {dispatch({type: SET_STATUS, status: status})};
export const hangOffSession = () => async (dispatch) =>  {dispatch({type: HANG_OFF_SESSION})};