import { useState, useEffect } from 'react';

import { View, Text, FlatList, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import { format } from 'date-fns';

export default function ForumScreen() {

  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);

  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {

    loadPosts();

  }, []);

  const loadPosts = async () => {

    try {

      const savedPosts = await AsyncStorage.getItem('forumPosts');

      if (savedPosts) setPosts(JSON.parse(savedPosts));

    } catch (e) {

      console.log('Failed to load posts');

    }

  };

  const savePosts = async (updatedPosts) => {

    try {

      await AsyncStorage.setItem('forumPosts', JSON.stringify(updatedPosts));

      setPosts(updatedPosts);

    } catch (e) {

      console.log('Failed to save posts');

    }

  };

  const createPost = () => {

    const updatedPosts = [{

      id: Date.now().toString(),

      title: newPost.title,

      content: newPost.content,

      author: 'Current User',

      timestamp: format(new Date(), 'MMM dd, yyyy HH:mm'),

      comments: []

    }, ...posts];

    

    savePosts(updatedPosts);

    setNewPost({ title: '', content: '' });

    navigation.navigate('PostDetail', { postId: updatedPosts[0].id });

  };

  return (

    <View style={styles.container}>

      <View style={styles.newPostContainer}>

        <TextInput

          style={styles.input}

          placeholder="Post Title"

          value={newPost.title}

          onChangeText={(text) => setNewPost({...newPost, title: text})}

        />

        <TextInput

          style={[styles.input, styles.contentInput]}

          placeholder="What's on your mind?"

          value={newPost.content}

          onChangeText={(text) => setNewPost({...newPost, content: text})}

          multiline

        />

        <Button 

          title="Create Post" 

          onPress={createPost} 

          disabled={!newPost.title || !newPost.content}

        />

      </View>

      <FlatList

        data={posts}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <TouchableOpacity 

            style={styles.postCard}

            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}

          >

            <Text style={styles.postTitle}>{item.title}</Text>

            <Text style={styles.postMeta}>{item.author} · {item.timestamp}</Text>

            <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>

            <Text style={styles.commentsCount}>

              {item.comments.length} comment{item.comments.length !== 1 ? 's' : ''}

            </Text>

          </TouchableOpacity>

        )}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: 15,

  },

  newPostContainer: {

    marginBottom: 20,

    backgroundColor: '#fff',

    borderRadius: 10,

    padding: 15,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 2,

  },

  input: {

    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: 8,

    padding: 12,

    marginBottom: 10,

  },

  contentInput: {

    height: 80,

    textAlignVertical: 'top',

  },

  postCard: {

    backgroundColor: '#fff',

    borderRadius: 10,

    padding: 15,

    marginBottom: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 2,

  },

  postTitle: {

    fontSize: 18,

    fontWeight: '600',

    marginBottom: 5,

  },

  postMeta: {

    color: '#666',

    fontSize: 12,

    marginBottom: 8,

  },

  postContent: {

    color: '#444',

    lineHeight: 20,

    marginBottom: 10,

  },

  commentsCount: {

    color: '#2196F3',

    fontSize: 14,

  },

});

