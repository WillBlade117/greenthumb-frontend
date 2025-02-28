import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import user, { logout } from "../reducers/user";
import { reset } from '../reducers/plants';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';


export default function UserScreen({ navigation }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.value);

  useEffect(() => {
    if (!auth.token) {
      navigation.navigate('Home')
    }
  }, [auth])

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auth.username}</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => handleLogout()}>
        <Ionicons name='power' style={styles.logoutIcon}/>
        <Text style={styles.logoutTxt}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  logoutBtn: {
    width: 250,
    height: 65,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E74C3C',
    borderRadius: 15,
    bottom: 60,
  },
  logoutTxt: {
    color: '#E74C3C',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutIcon: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 20,
    color: '#E74C3C'
  },
  title: {
    width: '80%',
    fontSize: 26,
    fontWeight: '600',
    top: 30,
    color: "#12947C",
    textAlign: 'center',
  },
});