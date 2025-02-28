import React, { useState, useEffect } from "react";
import SafeAreaView from "react-native-safe-area-view";
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, TextInput, Image, ActivityIndicator } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

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

export default function AddQuestionsScreen({ navigation }) {
    const user = useSelector((state) => state.user.value);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false)

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

    const pickImage = async () => {
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

    const handleAddQuestion = () => {
        setIsLoading(true);
        if (title && description) {
            const formData = new FormData();
            formData.append("photoFromFront", {
                uri: image,
                name: "photo.jpg",
                type: "image/jpeg",
            });
            formData.append("username", user.username);
            formData.append("title", title);
            formData.append("message", description);
            fetch(`${ADRESS_IP}/questions/add`, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.result) {
                        navigation.navigate("TabNavigator", { screen: "Communauté" });
                    } else {
                        console.log('cassé !')
                    }
                });
        } else {
            alert('Veuillez remplir tous les champs !')
        }
    };

    if (!isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{ left: 15 }}>
                        <TouchableOpacity activeOpacity={0.2} onPress={() => navigation.navigate("Communauté")}>
                            <Ionicons name="chevron-back-outline" size={35} style={{ textAlign: "left", color: "#12947C" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: "90%", alignItems: "center", justifyContent: "flex-start", left: -17.5, }}>
                        <Text style={styles.title}>Ajouter une question</Text>
                    </View>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                    <View style={styles.inputContainer}>
                        <View style={{ width: "80%" }}>
                            <Text style={{ marginBottom: 10, fontWeight: "700" }}>Demande</Text>
                            <TextInput onChangeText={(name) => setTitle(name)} value={title} style={styles.NameInput} placeholder="Intitulé de la demande......" />
                        </View>
                        <View style={{ width: "80%" }}>
                            <Text style={{ marginBottom: 10, fontWeight: "700" }}>Photos</Text>
                            <TouchableOpacity onPress={pickImage}>
                                <View style={styles.greyBox}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.image} />
                                    ) : (
                                        <Ionicons name="image" size={60} color='#fff' />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "80%" }}>
                            <Text style={{ marginBottom: 10, fontWeight: "700" }}>Détail</Text>
                            <TextInput onChangeText={(name) => setDescription(name)} value={description} multiline={true} numberOfLines={10} style={styles.DescInput} placeholder="Développement de la question..." />
                        </View>
                        <TouchableOpacity onPress={() => handleAddQuestion()} style={styles.signupBtn}>
                            <Text style={styles.signupText}>AJOUTER MA QUESTION</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "white",
        width: "100%",
        padding: 7.5,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
    },
    title: {
        fontSize: 25,
        fontWeight: "600",
    },
    inputContainer: {
        backgroundColor: "#ecf0f6",
        width: "100%",
        height: "100%",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 10,
    },
    NameInput: {
        height: 45,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgba(187, 190, 195, 0.5)",
        padding: 10,
        borderRadius: 10,
    },
    greyBox: {
        backgroundColor: "#D9D9D9",
        borderWidth: 2,
        borderColor: '#D1C6C6',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: 100,
    },
    image: {
        width: 90,
        height: 90,
    },
    DescInput: {
        display: "flex",
        backgroundColor: "white",
        height: 300,
        justifyContent: "flex-end",
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
    },
    signupText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});