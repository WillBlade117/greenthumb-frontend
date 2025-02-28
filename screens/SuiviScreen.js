import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome } from '@expo/vector-icons';

// const ADRESS_IP = 'https://greenthumb-backend.vercel.app';
const ADRESS_IP = 'http://172.20.10.2:3000';

export default function SuiviScreen({ route, navigation }) {
    const { plantId } = route.params;
    const [events, setEvents] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [plantImages, setPlantImages] = useState([]);

    const taskIcons = {
        'Arrosage': 'tint',
        'Taille': 'cut',
        'Rempotage': 'leaf',
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch(`${ADRESS_IP}/plants/${plantId}/events`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data);
        };

        const fetchPlantImages = async () => {
            const response = await fetch(`${ADRESS_IP}/plants/pictures/${plantId}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            setPlantImages(data.pictures);
        };

        fetchEvents();
        fetchPlantImages();
    }, [plantId]);

    const handleAddEvent = async (task) => {
        console.log("TRESOREGFOK",task)
        const date = selectedDate;
        await fetch(`${ADRESS_IP}/plants/${plantId}/add-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, task }),
        });
        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            if (!updatedEvents[date]) updatedEvents[date] = [];
            updatedEvents[date].push(task);
            return updatedEvents;
        });
        Alert.alert('Succès', 'Tâche ajoutée avec succès');
        setModalVisible(false);
    };

    const renderMarkedDates = () => {
        const markedDates = {};
        Object.keys(events).forEach(date => {
            markedDates[date] = {
                marked: true,
                dotColor: 'blue',
                activeOpacity: 0.7,
            };
        });
        return markedDates;
    };

    const openModal = (day) => {
        setSelectedDate(day.dateString); // On garde la date sélectionnée
        setModalVisible(true);
    };

    const renderImageItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: item }}
                style={styles.image}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ left: 15 }}>
                    <TouchableOpacity activeOpacity={0.2} onPress={() => navigation.navigate("Accueil")}>
                        <Ionicons name="chevron-back-outline" size={35} style={{ textAlign: "left", color: "#12947C" }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "90%", alignItems: "center", left: -17.5 }}>
                    <Text style={styles.title}>Suivi de la plante</Text>
                </View>
            </View>
            <View style={styles.calendarContainer}>
                <Calendar markedDates={renderMarkedDates()} onDayPress={openModal} monthFormat={'yyyy MM'} />
            </View>
            <View style={styles.imagesContainer}>
                <FlatList data={plantImages} renderItem={renderImageItem} keyExtractor={(item, index) => index.toString()} numColumns={4} columnWrapperStyle={styles.columnWrapper} />
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un événement</Text>
                        {events[selectedDate] && events[selectedDate].length > 0 ? (
                            <View style={styles.existingTasksContainer}>
                                <Text style={styles.existingTasksTitle}>Tâches déjà ajoutées :</Text>
                                {events[selectedDate].map((task, index) => (
                                    <View key={index} style={styles.existingTask}>
                                        <FontAwesome name={taskIcons[task]} size={20} color="#12947C" />
                                        <Text style={styles.existingTaskText}>{task}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noTasksText}>Aucune tâche enregistrée pour ce jour.</Text>
                        )}
                        <Text style={styles.addTaskTitle}>Ajouter une nouvelle tâche :</Text>
                        {Object.keys(taskIcons).map((task, i) => (
                            <TouchableOpacity key={i} style={styles.taskButton} onPress={() => handleAddEvent(task)}>
                                <FontAwesome name={taskIcons[task]} size={30} color="#12947C" />
                                <Text style={styles.taskText}>{task}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
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
    calendarContainer: {
        marginVertical: 50,
    },
    imagesContainer: {
        flex: 1,
        marginBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    imageContainer: {
        margin: 5,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    existingTasksContainer: {
        marginBottom: 20,
    },
    existingTasksTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    existingTask: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    existingTaskText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#12947C',
    },
    noTasksText: {
        fontSize: 16,
        color: '#999',
    },
    addTaskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    taskButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 10,
    },
    taskText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#12947C',
    },
    cancelButton: {
        marginTop: 20,
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

