import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import { Container, Content, Text } from 'native-base';


class ContactPanel extends Component {
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
                        <Text>Contact</Text>
                    </View>

                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({

})
export default connect(mapStateToProps, mapDispatchProps)(ContactPanel)
