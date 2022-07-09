const xmppConfig = {
    transports: {
        websocket: "wss://xmpp.mektou.be:5281/xmpp-websocket",
        bosh: false
    },
    iceServers: [{ urls: ['stun:turn.mektoube.fr:3478?transport=udp'] }],
    host: "xmpp.mektou.be",
    resource: "rna-stanza"
}

const apiHost = "https://staging.mektoube.fr/api"
const avatarHost = "http://stg.myxxjs.com:9002/api"


export {
    xmppConfig, apiHost, avatarHost
}
