import React, { useState, useEffect } from "react";
import SafeAreaView from "react-native-safe-area-view";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

export default function CommunityScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [render, setRender] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      fetchData();
    }, [render])
  );
  const fetchData = async () => {
    try {
      const response = await fetch(`${ADRESS_IP}/questions/`);
      if (response.ok) {
        const jsonData = await response.json();
        setQuestions(jsonData.questions);
        // setRender(!render)
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const truncate = (str, n, useWordBoundary) => {
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "...";
  };


  const questionsList = questions.map((data, i) => {
    return (
      <TouchableOpacity key={i} style={styles.rowContent} onPress={() => navigation.navigate('ViewQuestions', {
        id: data._id,
        title: data.title,
        pictures: data.pictures,
        message: data.message
      }
      )}>
        <View>
          <View style={styles.rowContentCenter}>
            <Image style={styles.rowContentImg} source={data.pictures[0] ? { uri: data.pictures[0] } : require('../assets/nopic.png')} />
            <View style={{ marginLeft: 20 }}>
              <Text style={styles.questionTitle}>{data.title}</Text>
              <Text style={styles.questionDesc}>{truncate(data.message, 160, true).replace(/(\r\n|\n|\r)/gm,"")}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Communauté</Text>
      <ScrollView style={styles.questionsBox} contentContainerStyle={{ alignItems: 'center' }}>
        {questionsList ? questionsList : <View style={{ alignItems: 'center', bottom: 300, width: '100%' }}>
          <Text style={{ color: "#000000" }}>Pas de question</Text>
        </View>}
      </ScrollView>
      {questionsList.length === 0 &&
        <View style={{ alignItems: 'center', bottom: 300, width: '100%' }}>
          <Text style={{ color: "#000000" }}>Pas de question</Text>
        </View>
      }
      <TouchableOpacity onPress={() => navigation.navigate("AddQuestions")} style={styles.button}>
        <Text style={styles.btnText}>POSTER MA DEMANDE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: "center",
    justifyContent: 'space-between',
  },
  title: {
    color: "#12947C",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10,
    textAlign: 'center',
  },
  questionsBox: {
    width: '90%',
    height: '100%',
    marginBottom: -20,
  },
  rowContent: {
    margin: 7.5,
    maxHeight: 90,
    backgroundColor: "#f6f7fc",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 10,
  },
  rowContentCenter: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowContentImg: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  questionDesc: {
    fontSize: 14,
    fontWeight: "medium",
    color: "#8E93AC",
    maxWidth: "85%",
    height: 'auto',
    marginBottom: 5,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 325,
    marginBottom: 60,
    backgroundColor: "#12947C",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 83, 0.5)",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});