import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

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

export default function PicturesScreen() {
  const user = useSelector((state) => state.user.value);
  const [plants, setPlants] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      fetchData();
    }, [isLoading])
  );

  const fetchData = async () => {
    const response = await fetch(`${ADRESS_IP}/plants/allPictures/${user.username}`)
    if (response.ok) {
      const jsonData = await response.json();
      setPlants(jsonData.plants);
    }
  };


  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== "granted") {
          alert("Nous avons besoin de permissions pour accéder à votre galerie d'images !");
        }

        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          alert("Nous avons besoin de permissions pour utiliser la caméra !");
        }
      }
    })();
  }, []);

  const addPhotoPlant = async (item) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setIsLoading(true);
    if (!result.canceled) {
      const image = result.assets[0].uri;
      const formData = new FormData();
      formData.append("photoFromFront", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      await fetch(`${ADRESS_IP}/plants/addPicture/${item.id}`, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            updatePlantPictures(item.id, data.url);
          }
        })
    }
  };

  const updatePlantPictures = (plantId, newPhotoUrl) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant._id === plantId
          ? { ...plant, pictures: [...plant.pictures, newPhotoUrl] }
          : plant
      )
    );
    setIsLoading(false);
  };

  const deletePhoto = async (item, image) => {
    const id = item.id;
    const picture = image;
    const response = await fetch(`${ADRESS_IP}/plants/deletePicture/${id}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ picture }),
    });
    const data = await response.json();
    if (data.result) {
      setPlants((prevPlants) =>
        prevPlants.map((plant) =>
          plant.id === String(id)
            ? {
              ...plant,
              pictures: plant.pictures.filter((pic) => pic !== picture),
            }
            : plant
        )
      );
    }
  };



  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.plantContainer}>
      <View style={styles.headBox}>
        <Text style={styles.plantName}>{item.name} :</Text>
        <TouchableOpacity onPress={() => addPhotoPlant(item)}>
          <Ionicons name="add-circle-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.pictureScroll}>
        {item.pictures.map((picture, index) => (
          <View key={index} style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => openImageModal(picture)}>
              <Image source={{ uri: picture }} style={styles.picture} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.trash} onPress={() => deletePhoto(item, picture)}>
              <Ionicons name="trash-outline" size={18} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (!isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bibliothèque</Text>
        <FlatList
          data={plants}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeImageModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalBackground} onPress={closeImageModal}>
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (<LoadingAnimation />);
  }
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
    backgroundColor: '#fff',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: '#424242',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    color: "#12947C",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  plantContainer: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pictureScroll: {
    flexDirection: 'row',
  },
  picture: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  trash: {
    width: 20,
    height: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
