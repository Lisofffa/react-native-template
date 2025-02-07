import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('Email обязателен');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Пароль обязателен');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateInputs()) return;

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setEmailError('Некорректный email');
      } else if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setPasswordError('Неверный email или пароль');
      } else {
        setPasswordError('Ошибка при входе');
      }
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateInputs()) return;

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('Email уже используется');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Некорректный email');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Пароль должен быть не менее 6 символов');
      } else {
        setPasswordError('Ошибка при регистрации');
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, emailError ? styles.inputError : null]}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text>Пароль:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, passwordError ? styles.inputError : null]}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <Button title="Войти" onPress={handleLogin} />
      <Button title="Зарегистрироваться" onPress={handleSignUp} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {padding: 20},
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderColor: '#ccc',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
