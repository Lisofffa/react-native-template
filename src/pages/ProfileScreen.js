import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

function ProfileScreen({navigation}) {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text>Профиль</Text>
      <Button title="Выйти" onPress={handleLogout} />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  wrapper: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
