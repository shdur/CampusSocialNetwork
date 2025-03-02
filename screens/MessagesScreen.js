import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages(); // Ngarko mesazhet e ruajtura kur hapet ekrani

    // Setimi i intervalit për të simuluar përditësimet në kohë reale
    const interval = setInterval(simulateNewMessage, 5000); // Simulimi i një mesazhi të ri çdo 5 sekonda

    return () => clearInterval(interval); // Pastrimi i intervalit kur ekrani largohet
  }, []);

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('messages');
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {
      console.log('Dështoi ngarkimi i mesazheve');
    }
  };

  const simulateNewMessage = () => {
    // Simulimi i një mesazhi të ri
    const newSimulatedMessage = {
      id: Date.now().toString(),
      content: `Mesazh i ri #${Math.floor(Math.random() * 100)}`,
      sender: 'Simulated User',
      timestamp: new Date().toLocaleString(),
    };

    // Përditësojmë mesazhet duke shtuar mesazhin e ri në fillim
    const updatedMessages = [newSimulatedMessage, ...messages];
    AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [
        { 
          id: Date.now().toString(),
          threadId: '123',
          content: newMessage,
          sender: 'Përdoruesi Aktual',
          timestamp: new Date().toLocaleString()
        },
        ...messages,
      ];
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <Text>{item.sender}: {item.content}</Text>
            <Text>{item.timestamp}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Shkruaj një mesazh"
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Dërgo Mesazh" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  messageCard: {
    marginBottom: 10,
  },
});
