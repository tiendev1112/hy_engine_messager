const xmppConfig = {
    transports: {
        websocket: "ws://im.myxxjs.com:5280/xmpp",
        bosh :false
    },
    host:"im.myxxjs.com",
    resource:"mobile"
}

const apiHost = "http://stg.myxxjs.com:9901/api"
const avatarHost = "http://stg.myxxjs.com:9002/api"


export  {
    xmppConfig,apiHost,avatarHost
}
