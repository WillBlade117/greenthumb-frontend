import * as React from "react";
import { StyleSheet, Platform, View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomTabBar,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccueilScreen from "./screens/AccueilScreen";
import HomeScreen from "./screens/HomeScreen";
import CommunityScreen from "./screens/CommunityScreen";
import CameraScreen from "./screens/CameraScreen";
import PicturesScreen from "./screens/PicturesScreen";
import UserScreen from "./screens/UserScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AddQuestionsScreen from "./screens/AddQuestionsScreen";
import ViewQuestionsScreen from "./screens/ViewQuestion";
import AddPlantScreen from "./screens/AddPlantScreen";
import EncyclopedieScreen from "./screens/EncyclopedieScreen";
import SuiviScreen from "./screens/SuiviScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import plants from './reducers/plants'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const reducers = combineReducers({ user, plants });

const persistConfig = { key: "green-thumb", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      style={styles.navbar}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline";
            size = 32;
          } else if (route.name === "Communauté") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            size = 32;
          } else if (route.name === "Caméra") {
            iconName = focused ? "camera" : "camera-outline";
            size = 40;
            {
              backgroundColor: "red";
            }
          } else if (route.name === "Photos") {
            iconName = focused ? "image" : "image-outline";
            size = 32;
          } else if (route.name === "Profil") {
            iconName = focused ? "person-circle" : "person-circle-outline";
            size = 32;
          }

          {
            if (route.name !== "Caméra") {
              return (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                  style={styles.tabBarIcons}
                  bordered
                />
              );
            }
          }
          {
            if (route.name === "Caméra") {
              return (
                <View
                  style={{
                    backgroundColor: "#12947c",
                    height: 83,
                    width: 83,
                    marginBottom: '85%',
                    borderColor: "#12947C",
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={iconName}
                    size={size}
                    color="white"
                    style={styles.cameraBtn}
                    onPress={() => navigation.navigate('Camera')}
                  />
                </View>
              );
            }
          }
        },
        tabBarActiveTintColor: "#12947C",
        tabBarInactiveTintColor: "#fff",
        headerShown: false,
        tabBarStyle: {
          ...styles.tabContainer,
          height: '12.5%',
          display: "flex",
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: "#12947C",
          paddingTop: 5,
          paddingBottom: 25,
          marginBottom: -40
        },
      })}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Communauté" component={CommunityScreen} />
      <Tab.Screen
        name="Caméra"
        style={styles.navItem}
        component={() => null}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Camera');
          },
        })}
      />
      <Tab.Screen
        name="Photos"
        style={styles.navItem}
        component={PicturesScreen}
      />
      <Tab.Screen name="Profil" style={styles.navItem} component={UserScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Connexion" component={LoginScreen} />
            <Stack.Screen name="Inscription" component={SignUpScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="AddQuestions" component={AddQuestionsScreen} />
            <Stack.Screen name="ViewQuestions" component={ViewQuestionsScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            <Stack.Screen name="Encyclopedie" component={EncyclopedieScreen} />
            <Stack.Screen name="Suivi" component={SuiviScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} options={{ tabBarVisible: false, headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  cameraBtn: {
    backgroundColor: "#12947C",
    width: 80,
    height: 80,
    textAlign: "center",
    justifyContent: "flex-end",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#fff",
    padding: "20%",
    textShadowColor: "#12947C",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarIcons: {
    display: "flex",
    alignItems: "center",
    textShadowColor: "#12947C",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    width: 45,
    height: 35,
    textAlign: "center",
    marginTop: 5,
  },
});
