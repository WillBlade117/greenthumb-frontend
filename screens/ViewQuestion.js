import React, { useState, useEffect } from "react";
import SafeAreaView from "react-native-safe-area-view";
import { setState, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput, Dimensions, ScrollView, Image, Modal, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';

const moment = require('moment-timezone');

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

export default function ViewQuestionsScreen({ navigation, route }) {

  const user = useSelector((state) => state.user.value);
  const [modalVisible, setModalVisible] = useState(false);
  const [responses, setResponses] = useState()
  const [responseMsg, setResponseMsg] = useState('')
  const [refresh, setRefresh] = useState(false)
  const { id, title, pictures, message } = route.params;

  useEffect(() => {
    fetch(`${ADRESS_IP}/questions/${id}`)
      .then(res => res.json())
      .then(data => {
        setResponses(data.question.answers);
      });

  }, [id, refresh]);

  useEffect(() => {
    console.log('Updated question:', responses);
  }, [responses]);


  const handleLike = (answerId) => {
    fetch(`${ADRESS_IP}/questions/addLike/${id}/${answerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
      })
    })
      .then((res) => res.json())
      .then(() => setRefresh(!refresh))

  }


  const addReply = () => {
    setModalVisible(true)
  }

  const handleSubmit = () => {
    if (!responseMsg) {
      alert('Veuillez saisir une réponse')
      return;
    } else {
      fetch(`${ADRESS_IP}/questions/addResponse/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author: user.username,
          content: responseMsg,
          hasLiked: []
        })
      }).then((res) => res.json())
        .then((data) => {
          setModalVisible(false)
          setRefresh(!refresh)
        })
    }
  };

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ left: 15 }}>
          <TouchableOpacity activeOpacity={0.2} onPress={() => navigation.navigate("Communauté")}>
            <Ionicons name="chevron-back-outline" size={35} style={{ textAlign: "left", color: "#12947C" }} />
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", alignItems: "center", justifyContent: "flex-start", left: -17.5, }}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ScrollView contentContainerStyle={{ alignItems: 'flex-start', height: Dimensions.get('screen').height * 0.35, maxHeight: 'auto', width: Dimensions.get('window').width * 0.8 }}>
            <Image style={styles.rowContentImg} source={{ uri: pictures[0] }} />
            <Text style={styles.text}>
              {message}
            </Text>
          </ScrollView>
          <Text style={{ margin: 10, fontSize: 18, fontWeight: "700" }}>Réponses</Text>
          <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }} style={{ width: '100%', height: '80%' }}>
            {responses?.map((data, i) => {
              const responseDate = moment(data.date)
              const likes = data.hasLiked.length
              return (
                <View style={styles.rowContent} key={i}>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontSize: 12, color: '#95A5A6' }}>
                      {responseDate.tz('Europe/Paris').format('D/M/YYYY HH:mm')} - {data.author}
                    </Text>
                    <Text style={{ marginTop: 5, flexWrap: 'wrap', textAlign: 'left' }}>
                      {data.content}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <FontAwesome name='thumbs-up' size={25} color='#12947C' onPress={(answerId) => handleLike(data._id)} />
                    <Text>{likes ? likes : '0'}</Text>
                  </View>
                </View>
              )
            })}
          </ScrollView>
          <TouchableOpacity style={styles.signupBtn} onPress={() => addReply()}>
            <Text style={styles.signupText}>RÉPONDRE À LA QUESTION</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
        <Modal

          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
              keyboardShouldPersistTaps='handled'>
              <View style={styles.modalView}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                  <Text style={styles.modalText}>Répondre</Text>
                  <View style={styles.NameInput} >
                    <Text>{title}</Text>
                  </View>
                  <TextInput onChangeText={(valeur) => setResponseMsg(valeur)} value={responseMsg} multiline={true} numberOfLines={10} style={styles.DescInput} placeholder="Développement de la question..." />
                  <TouchableOpacity style={styles.signupBtn} onPress={() => handleSubmit()}>
                    <Text style={styles.signupText}>ENVOYER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text>Fermer</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({

  indicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: '#424242',
    fontWeight: 'bold'
  },
  centeredView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(193, 193, 193)',
  },
  modalView: {
    height: '60%',
    width: Dimensions.get('window').width * 0.9,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: "600",
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    textAlign: 'justify',
  },
  textImageWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowContent: {
    margin: 7.5,
    minHeight: 100,
    width: '95%',
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
  },
  rowContentCenter: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowContentImg: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    marginHorizontal: Dimensions.get('window').width * 0.3
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    padding: 7.5,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#ecf0f6",
    width: "100%",
    height: Dimensions.get('screen').height * 0.75,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10
  },
  NameInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(187, 190, 195, 0.5)",
    padding: 10,
    borderRadius: 10,
    width: '100%'
  },
  greyBox: {
    backgroundColor: "#D9D9D9",
    borderWidth: 2,
    borderColor: '#D1C6C6',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    width: 120,
  },
  image: {
    width: 90,
    height: 90,
  },
  DescInput: {
    backgroundColor: "white",
    height: 120,
    width: '100%',
    textAlignVertical: "top",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(187, 190, 195, 0.5)",
    borderRadius: 10,
  },
  signupBtn: {
    width: "auto",
    height: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12947C",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(11, 97, 81, 0.5)",
    borderRadius: 10,
    padding: 10,
    // position: 'fixed'
  },
  signupText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});