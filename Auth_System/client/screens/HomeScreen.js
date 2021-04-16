import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLinkProps } from '@react-navigation/native';
const jwtDecode = require('jwt-decode');

const HomeScreen = (props) => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const loadProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        if(!token) {
            useLinkProps.navigation.navigate('Login')
        }
        
        const decoded = jwtDecode(token);
        setFullName(decoded.fullName);
        setEmail(decoded.email);
    }

    const logout = (props) => {
        AsyncStorage.removeItem('token')
            .then(
                props.navigation.replace('Login')   //by using replace, the user cannot click on the back button to return to home screen
            )
            .catch(err => console.log(err));
    }
    
    useEffect(() => {
        loadProfile();
    });
    
    return(
        <View style={styles.container}>
            <View>
                <Text style={StyleSheet.text}>Welcome {fullName ? fullName : ''}</Text>
            </View>
            <View>
                <Text style={StyleSheet.text}>Your Email {email ? email: ''}</Text>
            </View>
            <View>
                <Button
                    title="Logout"
                    onPress={() => logout(props)}></Button>
            </View>
        </View>
    )
}

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        padding: 40
    },
    text: {
        fontSize: 22
    }
});

export default HomeScreen;