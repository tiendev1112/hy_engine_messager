/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import * as XMPP from "stanza";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
  MediaStreamConstraints,
} from "react-native-webrtc";
import stanzaService from "../../service";
import { xmppConfig } from "../../config";
import * as stanzaConst from "../../service/StanzaConst";

const localMedia = [];

const STUN_SERVER = "stun:turn.mektoube.fr:3478?transport=udp";
const SOCKET_URL = "wss://xmpp.mektou.be:5281";

// let client = XMPP.createClient({});

export default function PocScreen() {
  const isDarkMode = useColorScheme() === "dark";
  const [username, onChangeUsername] = useState("3379262");
  const [password, onChangePassword] = useState(
    "b21c70b7e8725d8bb2c5438d93d6bc0c,hVQJksQgCPySIoc%2BJ5Po%2F5%2BwDU7OzdZOanJg00CD8ihLybgWIs5S2Lgpq2g31mZsjQgIKqks9rESaHV0Su%2F4lGQobPD7aAPef1YaOBT%2FyWGTgZaUTEz%2BxdcTr6sONXh02lebr3p8z0Mr1jOedqxn8JzxEFEJLE0Lf1SiwokrE6eEZ1bPIuHdVBDfYBPlUjXWsYri4VFha6XgrurWhKR3Ppq6fvMWq5agEWmOXId25niX%2BN5ULhmze4bukQ2eyfOBPSEbBLxg26W6EmoWja7IlxdWRNLN0j8RWnxJRLrqVx76F7CtLODOiLDSra97J0L38oz4ZWGwTO%2F%2BwhMVocu7vSMi8PQyD7M2V%2FGYoHzo%2F%2Bi7Fa2YTigf%2Fe9QaHz18YrshaNdO3jbFXfcZaKRDQGbHcP9N49pzGfzbA6e9FIZIdPVs3tOsqWIsIEDd1rf%2B3D0674b5oy74WSVq06xg6Y23fkx1zLRRzXHGRARojfquwq7Rj%2Fw08j97Fdy9B%2FzlFGNnxkDPu3c2TdVnhOYvesyXs6CPGPtc01bTLLf23u9nr1FZ42syYhq%2BLIXQy9mWcKy5UE81oqzY%2Btdt8qtjWE9k9TVNri2jP6Q%2FgA%3D"
  );
  const [url, onChangeUrl] = useState(
    "wss://xmpp.mektou.be:5281/xmpp-websocket"
  );
  const [fullJid, setFullJid] = useState("");
  const [peerJid, onPeerJid] = useState("3376829@xmpp.mektou.be/5IwOVRaE9x4x");
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });
  const [calling, setCalling] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [isLoadingConnect, setIsLoadingConnect] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onConnect = () => {
    console.log("on Connecting");
    setIsLoadingConnect(true);
    if (stanzaService.client && stanzaService.client.xmppClient) {
      stanzaService.client.xmppClient.disconnect();
    }
    stanzaService.config({ username, password });
    stanzaService.client.init();
    stanzaService.client.xmppClient.on("session:started", function () {
      console.log("session:started");
      stanzaService.client.xmppClient.getRoster();
      stanzaService.client.xmppClient.sendPresence();
      stanzaService.client.xmppClient.discoverICEServers();
      setFullJid(stanzaService.client.xmppClient.jid);
      setIsLoadingConnect(false);
      console.log("client.jid", stanzaService.client.xmppClient.jid);
    });
    stanzaService.client.xmppClient.on("jingle:incoming", function (session) {
      console.log("jingle incoming");
      console.log(session.parent.sessions);
    });

    stanzaService.client.xmppClient.connect();
  };
  const onReset = () => {
    onChangeUsername("");
    onChangePassword("");
    onChangeUrl("");
  };
  const onCall = () => {
    stanzaService.client.xmppClient.pc = new RTCPeerConnection({
      iceServers: xmppConfig.iceServers,
    });
    initLocalVideo();
    registerPeerEvents();
    setTimeout(() => {
      stanzaService.client.xmppClient.pc.createOffer().then((offer) => {
        stanzaService.client.xmppClient.pc
          .setLocalDescription(offer)
          .then(() => {
            const msgObj = {
              type: stanzaConst.MSG_TYPE_MEDIA_VIDEO_OFFER,
              text: offer,
            };
            console.log(offer);
            stanzaService.client.xmppClient.sendMessage({
              to: peerJid,
              body: JSON.stringify(msgObj),
            });
          });
      });
    }, 4000);
  };
  const registerPeerEvents = () => {
    stanzaService.client.xmppClient.pc.onaddstream = (event) => {
      console.log("--->On Add Remote Stream");
      setRemoteStream(event.stream);
      // if (isLoudSpeaker) {
      //   InCallManager.setSpeakerphoneOn(true);
      // }
      // setStatus(CONNECTED_STATUS);
      // switchView();
      setLocalStream(stanzaService.client.xmppClient.pc.getLocalStreams()[0]);
      setRemoteStream(stanzaService.client.xmppClient.pc.getRemoteStreams()[0]);
    };
    stanzaService.client.xmppClient.pc.oniceconnectionstatechange = (state) => {
      console.log("oniceconnectionstatechange:", state);
    };
    stanzaService.client.xmppClient.pc.onconnectionstatechange = (state) => {
      console.log("onconnectionstatechange:", state);
    };
    stanzaService.client.xmppClient.pc.onconnectionstatechange = (state) => {
      console.log("onconnectionstatechange:", state);
    };
    stanzaService.client.xmppClient.pc.onicecandidate = (event) => {
      console.log("---> send candidate");
      if (event.candidate) {
        const msgObj = {
          type: stanzaConst.MSG_TYPE_MEDIA_CANDIDATE,
          text: event.candidate,
        };
        stanzaService.client.xmppClient.sendMessage({
          to: peerJid,
          body: JSON.stringify(msgObj),
        });
      }
    };
  };
  const initLocalVideo = () => {
    const deviceOptions: MediaStreamConstraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode: "user",
        optional: [],
      },
    };
    mediaDevices
      .getUserMedia(deviceOptions)
      .then((stream) => {
        setLocalStream(stream);
        stanzaService.client.xmppClient.pc.addStream(stream);
        console.log(stanzaService.client.xmppClient.pc.getLocalStreams());
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const accept = async () => {
    stanzaService.client.xmppClient.pc
      .setRemoteDescription(new RTCSessionDescription(route.params.offer))
      .then(() => {
        return stanzaService.client.xmppClient.pc.createAnswer();
      })
      .then((answer) => {
        stanzaService.client.xmppClient.pc.setLocalDescription(answer);
        const msgObj = {
          type: stanzaConst.MSG_TYPE_MEDIA_ANSWER,
          text: answer,
        };
        console.log(answer);
        stanzaService.client.xmppClient.sendMessage({
          to: peerJid,
          body: JSON.stringify(msgObj),
        });
      });
  };
  return (
    <View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            padding: 5,
          }}
        >
          <Text>Connection settings</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Username:</Text>
            <TextInput
              style={{ ...styles.input, flex: 1 }}
              onChangeText={onChangeUsername}
              value={username}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Password:</Text>
            <TextInput
              style={{ ...styles.input, flex: 1 }}
              onChangeText={onChangePassword}
              value={password}
            />
          </View>
          {/* <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Text>Websocker URL:</Text>
                        <TextInput
                            style={{ ...styles.input, flex: 1 }}
                            onChangeText={onChangeUrl}
                            value={url}
                        />
                    </View> */}
          <TouchableOpacity
            onPress={onReset}
            disabled={!username && !password}
            style={{
              marginBottom: 20,
              backgroundColor: !username && !password ? "#e1e1e1" : "#038cfc",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConnect}
            disabled={!username || !password || isLoadingConnect}
            style={{
              marginBottom: 20,
              backgroundColor:
                !username || !password || isLoadingConnect
                  ? "#e1e1e1"
                  : "#038cfc",
              padding: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoadingConnect && (
              <ActivityIndicator size="large" color="#038cfc" />
            )}
            <Text
              style={{
                color: "#fff",
              }}
            >
              {isLoadingConnect ? "Connecting" : "Connect"}
            </Text>
          </TouchableOpacity>
          {fullJid ? (
            <View>
              <Text>My full JID:</Text>
              <Text style={{ fontSize: 20 }}>{fullJid}</Text>
            </View>
          ) : (
            <View />
          )}
          <View>
            <Text>Start video section</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Peer JID:</Text>
              <TextInput
                style={{ ...styles.input, flex: 1 }}
                onChangeText={onPeerJid}
                value={peerJid}
              />
            </View>
            <TouchableOpacity
              style={{
                marginBottom: 20,
                backgroundColor: "#038cfc",
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={onCall}
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                Call
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            <View style={[styles.videos, styles.localVideos]}>
              <Text>Your Video</Text>
              <RTCView
                streamURL={localStream ? localStream.toURL() : ""}
                style={styles.localVideo}
              />
            </View>
            <View style={[styles.videos, styles.remoteVideos]}>
              <Text>Friends Video</Text>
              <RTCView
                streamURL={remoteStream ? remoteStream.toURL() : ""}
                style={styles.remoteVideo}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
  },
  videos: {
    width: "100%",
    flex: 1,
    position: "relative",
    overflow: "hidden",

    borderRadius: 6,
  },
  localVideos: {
    height: 200,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    width: "100%",
  },
  remoteVideo: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    width: "100%",
  },
});
