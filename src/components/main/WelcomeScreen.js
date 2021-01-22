import React, {Component} from 'react';
import {Dimensions,Image,SafeAreaView,StyleSheet,View,ActivityIndicator} from 'react-native';
import { Container, Content } from 'native-base';
import {connect} from 'react-redux';
import {show} from '../../actions/WelcomeAction'


const {height,width} = Dimensions.get('window');

class WelcomeScreen extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.welcomeShow()
    }

    render() {
        const {navigation} = this.props;

        return (

            <SafeAreaView style={{backgroundColor:"#445566",flex:1,alignContent:"space-around",justifyContent:"space-around"}}>
                    <View style={styles.container}>
                        <Image style={styles.imageSize} source={require('../../../assets/images/logo.png')}  />
                        {/*<ActivityIndicator*/}
                            {/*animating={true}*/}
                            {/*style={{marginTop:60}}*/}
                            {/*color='#00ff00'*/}
                            {/*size="large"*/}
                        {/*/>*/}
                    </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSize: {
        width: 200,
        height:200

    },
})

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({
    welcomeShow:()=>{
        dispatch(show(props))
    }

})
export default connect(mapStateToProps, mapDispatchProps)(WelcomeScreen)
