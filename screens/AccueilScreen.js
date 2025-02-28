import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { addPlant, deletePlant } from "../reducers/plants";
import Ionicons from "react-native-vector-icons/Ionicons";

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

export default function AccueilScreen({ navigation }) {
  const dispatch = useDispatch();
  const userPlants = useSelector((state) => state.plants.value);
  const user = useSelector((state) => state.user.value);
  
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      fetchData();
    }, [])
  );
  const truncate = (str, n, useWordBoundary) => {
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "...";
  };


  const fetchData = async () => {
    try {
      const response = await fetch(`${ADRESS_IP}/plants/${user.username}`);
      if (response.ok) {
        const jsonData = await response.json();
        dispatch(addPlant(jsonData.plants));
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (plantId) => {
    fetch(`${ADRESS_IP}/plants/` + plantId, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then(() => {
        dispatch(deletePlant(plantId));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Encyclopedie')}>
            <Text style={styles.btnText}>CONSULTER L'ENCYCLOPÉDIE</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes plantes</Text>
        </View>
        <View style={{ alignItems: 'center', height: '72.5%', marginBottom: -20 }}>
          <ScrollView style={{ marginBottom: -20 }} contentContainerStyle={{ alignItems: 'center' }}>
            {userPlants ? (
              userPlants.map((item, i) => (
                <View style={styles.rowContent} key={i}>
                  <View style={styles.rowContentCenter}>
                    <Image style={styles.rowContentImg} source={item.pictures[0] ? { uri: item.pictures[0] } : require('../assets/nopic.png')} />
                    <View style={{ marginLeft: 20 }}>
                      <Text style={styles.plantTitle}>{item.name}</Text>
                      <Text style={styles.plantDesc}>{truncate(item.description, 160, true)}</Text>
                      <TouchableOpacity
                        style={styles.rowContentCenter}
                        onPress={() => navigation.navigate("Suivi", { plantId: item._id })}
                      >
                        <Text style={{ color: '#12947C' }}>Suivre cette plante</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.deleteIconContainer} onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-sharp" size={25} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '50%', width: '100%' }}>
                <Text style={{ color: "#000000" }}>Pas de plante</Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.addPlantBtn}
            onPress={() => navigation.navigate("AddPlant")}
          >
            <Text style={{ color: "#12947C", fontWeight: "bold" }}>
              AJOUTER UNE PLANTE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 325,
    marginTop: 30,
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
  addPlantBtn: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#12947C",
    borderRadius: 10,
    padding: 10,
    width: "90%",
  },
  title: {
    color: "#12947C",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10
  },
  rowContent: {
    margin: 7.5,
    height: 2000,
    maxHeight: 80,
    backgroundColor: "#f6f7fc",
    width: Dimensions.get('window').width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 5,
  },
  rowContentCenter: {
    height: "80%",
    whiteSpace: 'no-wrap',
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowContentImg: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  plantTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  plantDesc: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#8E93AC",
    maxWidth: "80%",
    height: 'auto',
    marginBottom: 5
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
  },
});
