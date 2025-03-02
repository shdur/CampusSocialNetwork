import { useState, useEffect } from 'react';

import { View, Text, FlatList, Button, StyleSheet, Modal, TextInput } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { format } from 'date-fns';

export default function EventsScreen() {

  const [events, setEvents] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [newEvent, setNewEvent] = useState({

    title: '',

    date: new Date(),

    location: '',

    description: ''

  });

  useEffect(() => {

    loadEvents();

  }, []);

  const loadEvents = async () => {

    try {

      const savedEvents = await AsyncStorage.getItem('events');

      if (savedEvents) setEvents(JSON.parse(savedEvents));

    } catch (e) {

      console.log('Failed to load events');

    }

  };

  const saveEvents = async (updatedEvents) => {

    try {

      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));

      setEvents(updatedEvents);

    } catch (e) {

      console.log('Failed to save events');

    }

  };

  const handleCreateEvent = () => {

    const updatedEvents = [...events, {

      ...newEvent,

      id: Date.now().toString(),

      date: format(newEvent.date, 'MMM dd, yyyy HH:mm')

    }];

    saveEvents(updatedEvents);

    setModalVisible(false);

    setNewEvent({

      title: '',

      date: new Date(),

      location: '',

      description: ''

    });

  };

  return (

    <View style={styles.container}>

      <Button title="Create New Event" onPress={() => setModalVisible(true)} />

      

      <FlatList

        data={events}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.eventCard}>

            <Text style={styles.eventTitle}>{item.title}</Text>

            <Text style={styles.eventDate}>{item.date}</Text>

            <Text style={styles.eventLocation}>{item.location}</Text>

            <Text style={styles.eventDescription}>{item.description}</Text>

          </View>

        )}

      />

      <Modal visible={modalVisible} animationType="slide">

        <View style={styles.modalContent}>

          <TextInput

            style={styles.input}

            placeholder="Event Title"

            value={newEvent.title}

            onChangeText={(text) => setNewEvent({...newEvent, title: text})}

          />

          <TextInput

            style={styles.input}

            placeholder="Location"

            value={newEvent.location}

            onChangeText={(text) => setNewEvent({...newEvent, location: text})}

          />

          <TextInput

            style={styles.input}

            placeholder="Description"

            value={newEvent.description}

            onChangeText={(text) => setNewEvent({...newEvent, description: text})}

            multiline

          />

          <View style={styles.buttonRow}>

            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />

            <Button title="Create Event" onPress={handleCreateEvent} />

          </View>

        </View>

      </Modal>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: 20,

  },

  eventCard: {

    backgroundColor: '#fff',

    borderRadius: 8,

    padding: 15,

    marginBottom: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 2,

  },

  eventTitle: {

    fontSize: 18,

    fontWeight: 'bold',

    marginBottom: 5,

  },

  eventDate: {

    color: '#666',

    marginBottom: 3,

  },

  eventLocation: {

    color: '#444',

    marginBottom: 8,

  },

  modalContent: {

    flex: 1,

    padding: 20,

  },

  input: {

    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: 8,

    padding: 12,

    marginBottom: 15,

  },

  buttonRow: {

    flexDirection: 'row',

    justifyContent: 'space-around',

    marginTop: 20,

  },

});
