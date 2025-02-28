import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, Modal, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../reducers/plants";
import Ionicons from "react-native-vector-icons/Ionicons";

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000'

function LoadingAnimation() {
  return (
    <View transparent={true} style={{ flex: 1 }}>
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" color='#12947C' />
        <Text style={styles.indicatorText}>Veuillez patienter...</Text>
      </View>
    </View>
  );
}

export default function CameraScreen({ navigation }) {
  const dispatch = useDispatch();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back");
  const [torch, setTorch] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const plants = useSelector(state => state.plants.value);
  const [isLoading, setIsLoading] = useState(false)
  const width = Dimensions.get('screen').width;
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashStatus = () => {
    setTorch(!torch);
  };

  const takePicture = async () => {
    setIsLoading(true);
    // You can define a custom width and height to control the image's dimensions
    const pictureOptions = {
      quality: 1,  // Image quality (0 to 1)
      base64: false,  // Whether to return the base64 encoded string
      exif: true, // Include EXIF data
      width: width * 0.9, // Adjust the width to a percentage of the screen width
      height: width * 0.9 * (16 / 9),  // Adjust the height based on a 16:9 aspect ratio
    };
  
    // Capture the photo with the specified options
    const photo = await cameraRef.current?.takePictureAsync(pictureOptions);
    setPhoto(photo);
    setIsLoading(false);
    setModalVisible(true);
  };

  const handleSelectPlant = async (plantId) => {
    setIsLoading(true);
    setModalVisible(false);
    if (photo) {
      const formData = new FormData();
      formData.append('photoFromFront', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      fetch(`${ADRESS_IP}/plants/addPicture/${plantId}`, {
        method: 'PUT',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(addPhoto({ plantId, photoUrl: photo.uri }));
            navigation.navigate('Accueil');
          } else {
            console.error('Error adding photo:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  if (!hasPermission) {
    return <View />;
  }

  if (!isLoading) {
    return (
      <CameraView style={{...styles.camera, width, height: width * (16/9)}} facing={facing} enableTorch={torch} ref={cameraRef}>
        <View style={styles.topButton}>
          <SafeAreaView style={{ justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => navigation.navigate("Accueil")}
            >
              <Ionicons
                name="chevron-back-outline"
                size={55}
                style={{ textAlign: "left", color: "#fff" }}
              />
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView style={styles.settingContainer}>
            <TouchableOpacity style={styles.settingButton} onPress={toggleFlashStatus}>
              <Ionicons name="flash-outline" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingButton} onPress={toggleCameraFacing}>
              <Ionicons name="arrow-redo-circle-outline" size={35} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        <View style={styles.snapContainer}>
          <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
            <Ionicons name="camera-outline" size={95} color="white" />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView} >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choisissez une plante :</Text>
              <FlatList
                data={plants}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectPlant(item._id)} style={styles.plantItem}>
                    <Text style={styles.plantText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </CameraView>
    )
  } else {
    return (<LoadingAnimation />);
  }
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
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  topButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  settingContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 20,
  },
  settingButton: {
    width: 40,
    aspectRatio: 1,
    marginTop: '20%',
    marginBottom: '40%',
    alignItems: "center",
    justifyContent: "center",
  },
  snapContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  snapButton: {
    width: 100,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(193, 193, 193)',
  },
  modalView: {
    height: '60%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  plantItem: {
    padding: 20,
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#12947C',
  },
  plantText: {
    fontSize: 20,
    textAlign: 'center',
  },
});
