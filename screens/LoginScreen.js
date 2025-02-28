import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../reducers/user';

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

export default function LoginScreen({ navigation }) {
  const auth = useSelector((state) => state.user.value)
  useEffect(() => {
    if (auth.token) {
      navigation.navigate('TabNavigator')
    }
  }, [auth])
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    const datas = { email, password }
    if (email && password) {
      fetch(`${ADRESS_IP}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            dispatch(login({ token: data.user.token, username: data.user.username }))
            navigation.navigate('TabNavigator', { screen: 'Accueil' })
          }
        })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logoImg} source={require('../assets/logo.png')} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={(value) => setEmail(value)} value={email} keyboardType='email-address' textContentType="emailAddress" placeholder='Adresse email...'></TextInput>
          <TextInput style={styles.input} onChangeText={(value) => setPassword(value)} value={password} secureTextEntry={true} placeholder='Mot de passe...'></TextInput>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => handleSubmit()}>
            <Text style={styles.loginText}>VALIDER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goBackText}>Retour</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImg: {
    width: 250,
    height: 200,
    objectFit: 'cover',
    marginTop: 100,
  },
  title: {
    width: '80%',
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    width: 300,
    height: 65,
    marginTop: 25,
    padding: 15,
    borderColor: '#12947C',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 20,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 8,
    width: '80%',
    marginTop: 30,
    backgroundColor: '#EC6E5B',
    borderRadius: 10,
    marginBottom: 80,
  },
  loginText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  signupText: {
    color: '#12947C',
    fontWeight: '600',
    fontSize: 16,
  },
  backBtn: {
    marginTop: 25
  },
  goBackText: {
    color: 'rgba(0,0,0, 0.5)',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  btnContainer: {
    marginBottom: 75,
    height: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  loginBtn: {
    width: 300,
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12947C',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 102, 83, 0.5)',

  },
  signupBtn: {
    width: 67,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 25,
  }
});