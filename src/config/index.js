const xmppConfig = {
    transports: {
        websocket: "ws://im.myxxjs.com:5280/xmpp",
        bosh :false
    },
    iceServers:[{"urls": "stun:139.196.59.138:3478?transport=udp"},{"urls": "turn:139.196.59.138:3478?transport=udp"}],
    host:"im.myxxjs.com",
    resource:"mobile"
}

const apiHost = "http://stg.myxxjs.com:9901/api"
const avatarHost = "http://stg.myxxjs.com:9002/api"


export  {
    xmppConfig,apiHost,avatarHost
}
