import { useState, useEffect } from 'react';

import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { format } from 'date-fns';

export default function PostDetailScreen({ route }) {

  const { postId } = route.params;

  const [post, setPost] = useState(null);

  const [comment, setComment] = useState('');

  useEffect(() => {

    loadPost();

  }, []);

  const loadPost = async () => {

    try {

      const savedPosts = await AsyncStorage.getItem('forumPosts');

      if (savedPosts) {

        const posts = JSON.parse(savedPosts);

        const foundPost = posts.find(p => p.id === postId);

        setPost(foundPost);

      }

    } catch (e) {

      console.log('Failed to load post');

    }

  };

  const addComment = async () => {

    if (!comment.trim()) return;

    

    try {

      const savedPosts = await AsyncStorage.getItem('forumPosts');

      const posts = JSON.parse(savedPosts);

      const updatedPosts = posts.map(p => {

        if (p.id === postId) {

          return {

            ...p,

            comments: [{

              id: Date.now().toString(),

              content: comment,

              author: 'Current User',

              timestamp: format(new Date(), 'MMM dd, yyyy HH:mm')

            }, ...p.comments]

          };

        }

        return p;

      });

      

      await AsyncStorage.setItem('forumPosts', JSON.stringify(updatedPosts));

      setPost(prev => ({

        ...prev,

        comments: updatedPosts.find(p => p.id === postId).comments

      }));

      setComment('');

    } catch (e) {

      console.log('Failed to add comment');

    }

  };

  if (!post) return null;

  return (

    <View style={styles.container}>

      <View style={styles.postContainer}>

        <Text style={styles.postTitle}>{post.title}</Text>

        <Text style={styles.postMeta}>{post.author} · {post.timestamp}</Text>

        <Text style={styles.postContent}>{post.content}</Text>

      </View>

      <TextInput

        style={styles.commentInput}

        placeholder="Write a comment..."

        value={comment}

        onChangeText={setComment}

        multiline

        onSubmitEditing={addComment}

      />

      <FlatList

        data={post.comments}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.commentCard}>

            <Text style={styles.commentAuthor}>{item.author}</Text>

            <Text style={styles.commentContent}>{item.content}</Text>

            <Text style={styles.commentTime}>{item.timestamp}</Text>

          </View>

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

  postContainer: {

    backgroundColor: '#fff',

    borderRadius: 10,

    padding: 15,

    marginBottom: 15,

  },

  postTitle: {

    fontSize: 20,

    fontWeight: '600',

    marginBottom: 8,

  },

  postMeta: {

    color: '#666',

    fontSize: 12,

    marginBottom: 10,

  },

  postContent: {

    fontSize: 16,

    lineHeight: 24,

    color: '#444',

  },

  commentInput: {

    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: 25,

    padding: 15,

    marginBottom: 15,

    backgroundColor: '#fff',

  },

  commentCard: {

    backgroundColor: '#f8f9fa',

    borderRadius: 15,

    padding: 15,

    marginBottom: 10,

  },

  commentAuthor: {

    fontWeight: '500',

    marginBottom: 4,

  },

  commentContent: {

    color: '#444',

    marginBottom: 4,

  },

  commentTime: {

    color: '#666',

    fontSize: 12,

  },

});
