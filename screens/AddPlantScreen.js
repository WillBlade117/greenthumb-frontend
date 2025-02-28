import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import user, { login } from "../reducers/user";
import plants, { addPlant } from "../reducers/plants";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";


// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

function LoadingAnimation() {
  return (
    <Modal transparent={true}>
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" color='#12947C' />
        <Text style={styles.indicatorText}>Veuillez patienter...</Text>
      </View>
    </Modal>
  );
}

export default function AddPlantScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const plants = useSelector((state) => state.plants.value);

  const [isLoading, setIsLoading] = useState(false)
  const [plantName, setPlantName] = useState("");
  const [plantDesc, setPlantDesc] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddPlant = () => {
    if (plantName && plantDesc) {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      formData.append("username", user.username);
      formData.append("name", plantName);
      formData.append("description", plantDesc);
      fetch(`${ADRESS_IP}/plants/add`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('debug data: ', data)
          if (data.result) {
            navigation.navigate("TabNavigator", { screen: "Accueil" });
          }
        });
    } else {
      alert('Veuillez remplir tous les champs!')
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }

        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    })();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
        }}
      >
        <View style={{ left: 15 }}>
          <TouchableOpacity
            activeOpacity={0.2}
            onPress={() => navigation.navigate("Accueil")}
          >
            <Ionicons
              name="chevron-back-outline"
              size={35}
              style={{ textAlign: "left", color: "#12947C" }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "flex-start",
            left: -17.5,
          }}
        >
          <Text style={styles.title}>Ajouter une plante</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inputContainer}>
          <View style={{ width: "80%" }}>
            <Text
              style={{ marginBottom: 10, fontWeight: "700" }}
            >
              Nom
            </Text>
            <TextInput
              onChangeText={(name) => setPlantName(name)}
              value={plantName}
              style={styles.NameInput}
              label={<Text style={{ color: 'red' }}>Must Fill</Text>}
              placeholder="Un joli petit nom..."

            />
          </View>
          <View style={{ width: "80%" }}>
            <Text
              style={{ marginBottom: 10, fontWeight: "700" }}
              aria-label="Label for Description"
              nativeID="labelPlantDesc"
            >
              Description
            </Text>
            <TextInput
              onChangeText={(desc) => setPlantDesc(desc)}
              value={plantDesc}
              multiline={true}
              numberOfLines={10}
              style={styles.DescInput}
              aria-label="input"
              aria-labelledby="labelPlantDesc"
              placeholder="Une petite description..."
            />
          </View>
          <View style={{ width: "80%" }}>
            <Text
              style={{ marginBottom: 10, fontWeight: "700" }}
              aria-label="Label for Pictures"
              nativeID="labelPhotos"
            >
              Photos
            </Text>
            <TouchableOpacity onPress={pickImage}>
              <View
                style={{
                  backgroundColor: "#D9D9D9",
                  borderWidth: 2,
                  borderColor: '#D1C6C6',
                  borderStyle: 'dashed',
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Ionicons name="image" size={60} color='#fff' />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => handleAddPlant()}
          >
            <Text style={styles.signupText}>AJOUTER MA PLANTE</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {isLoading === true && <LoadingAnimation />}
    </SafeAreaView>
  );
}

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
    backgroundColor: 'rgba(217, 217, 217, 0.75)',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: '#424242',
    fontWeight: 'bold'
  },
  NameInput: {
    height: 45,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(187, 190, 195, 0.5)",
    padding: 10,
    borderRadius: 10,
  },
  DescInput: {
    display: "flex",
    backgroundColor: "white",
    height: 200,
    justifyContent: "flex-end",
    textAlignVertical: "top",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(187, 190, 195, 0.5)",
    borderRadius: 10,
  },
  PhotosInput: {
    backgroundColor: "white",
  },
  inputContainer: {
    backgroundColor: "#ecf0f6",
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    width: "100%",
    padding: 7.5,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: 250,
    height: 200,
    objectFit: "cover",
    marginTop: 100,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
  },
  input: {
    width: 300,
    height: 65,
    marginTop: 25,
    padding: 15,
    borderColor: "#12947C",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  button: {
    display: "flex",
    alignItems: "center",
    paddingTop: 8,
    width: "80%",
    marginTop: 30,
    backgroundColor: "#EC6E5B",
    borderRadius: 10,
    marginBottom: 80,
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  signupText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  backBtn: {
    marginTop: 25,
  },
  goBackText: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  btnContainer: {
    marginBottom: 75,
    height: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginBtn: {
    width: 300,
    height: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12947C",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 83, 0.5)",
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
  },
  image: {
    width: 180,
    height: 180,
  },
});
