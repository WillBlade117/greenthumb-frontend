import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';

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

const getPlantImageFromWikipedia = async (plantName) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${plantName}&prop=pageimages&format=json&pithumbsize=500`;
  try {
    const response = await axios.get(url);
    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const imageUrl = pages[pageId]?.thumbnail?.source;
    return imageUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image de Wikipedia', error);
    return null;
  }
};

export default function EncyclopedieScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        // Appel à l'API GBIF pour récupérer les plantes
        const response = await axios.get('https://api.gbif.org/v1/occurrence/search?taxonKey=6&limit=500');
        const plantData = response.data.results;

        // Récupération des images via Wikipedia pour chaque plante
        const plantsWithImages = await Promise.all(plantData.map(async (plant) => {
          const plantName = plant.genericName;
          const imageUrl = await getPlantImageFromWikipedia(plantName);
          return { ...plant, imageUrl };
        }));
        const uniquePlants = Array.from(
          new Map(plantsWithImages.filter(item => item.imageUrl).map(item => [item.genericName, item])).values()
        );
        uniquePlants.sort((a, b) => a.genericName.localeCompare(b.genericName));
        setPlants(uniquePlants);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des plantes', error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) {
    return (<LoadingAnimation />);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ left: 15 }}>
          <TouchableOpacity activeOpacity={0.2} onPress={() => navigation.navigate("Accueil")}>
            <Ionicons name="chevron-back-outline" size={35} style={{ textAlign: "left", color: "#12947C" }} />
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", alignItems: "center", justifyContent: "flex-start", left: -17.5 }}>
          <Text style={styles.title}>Retour</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.plantListContainer}>
        {plants.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.text}>{item.genericName}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  plantListContainer: {
    padding: 10,
    alignItems: "center",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
