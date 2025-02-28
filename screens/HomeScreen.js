import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import React from 'react';
import user from '../reducers/user';

import { useSelector } from "react-redux";
import { useEffect } from 'react';


export default function HomeScreen({ navigation }) {
  const auth = useSelector((state) => state.user.value)
  useEffect(() => {
    if (auth.token) {
      navigation.navigate('TabNavigator')
    }
  }, [auth])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logoImg} source={require('../assets/logo_brut.png')} />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Connexion')}>
          <Text style={styles.loginText}>SE CONNECTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Inscription')}>
          <Text style={styles.signupText}>S'INSCRIRE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '80%',
    marginTop: 25,
    borderBottomColor: '#EC6E5B',
    borderBottomWidth: 1,
    fontSize: 20,
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
  btnContainer: {
    marginBottom: 75,
    height: 160,
    display: 'flex',
    justifyContent: 'space-between'
  },
  loginBtn: {
    width: 250,
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12947C',
    borderRadius: 15,
  },
  signupBtn: {
    width: 250,
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#12947C',
    borderRadius: 15
  }
});