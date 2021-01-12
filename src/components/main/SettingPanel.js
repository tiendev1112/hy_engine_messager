import React, {Component} from 'react';
import {View,Dimensions, StyleSheet} from 'react-native';
import { Container, Content, Text } from 'native-base';
import {connect} from 'react-redux';

const {height,width} = Dimensions.get('window');

class SettingPanel extends Component {
    constructor(props) {
        super(props);


    }

    componentDidMount() {

    }

    render() {
        const {navigation} = this.props;

        return (
            <Container>
                <Content style={{backgroundColor:"#445566"}}>
                    <View>
                        <Text>Setting</Text>
                    </View>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 60,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 100,
    },
    toolBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCall: {
        backgroundColor: 'green',
    },
    buttonCallEnd: {
        backgroundColor: 'red',
    },
    buttonMute: {
        backgroundColor: 'blue',
    },
    buttonSwitch: {
        backgroundColor: 'orange',
    },
});
const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({

})
export default connect(mapStateToProps, mapDispatchProps)(SettingPanel)
