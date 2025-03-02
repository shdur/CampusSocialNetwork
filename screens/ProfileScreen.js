import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ setIsAuthenticated }) { // Shto prop-in setIsAuthenticated
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    bio: 'Computer Science Student',
    major: 'BSc CS',
    year: '2025',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) setUser(JSON.parse(savedProfile));
    } catch (e) {
      console.log('Failed to load profile');
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(user));
      setIsEditing(false);
    } catch (e) {
      console.log('Failed to save profile');
    }
  };

  // Shto funksionin e logout brenda komponentit
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      setIsAuthenticated(false);
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={user.major}
            onChangeText={(text) => setUser({ ...user, major: text })}
            placeholder="Major"
          />
          <TextInput
            style={styles.input}
            value={user.bio}
            onChangeText={(text) => setUser({ ...user, bio: text })}
            placeholder="Bio"
            multiline
          />
          <Button title="Save Profile" onPress={saveProfile} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.detail}>{user.major} - Class of {user.year}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
            <Button 
              title="Logout" 
              onPress={handleLogout} 
              color="#ff4444"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10
  }
});