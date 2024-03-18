// BookListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { Book } from '../types';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const BookListScreen: React.FC = () => {
  
  const navigation = useNavigation<RootStackParamList>();

  const [loading, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    loadFavoriteBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://openlibrary.org/subjects/sci-fi.json?details=true');
      const bookData: any = response.data.works;
      const books: Book[] = bookData.map((item: any) => (
        {
          key: item.key,
          title: item.title,
          authors: item.authors.map((author: any) => author.name),
          coverUrl: item.cover_url,
          genre: item.subject.join(', '),
          publicationYear: item.first_publish_year,
          description: item.description,
          isFavorite: false,
        }));
      setBooks(books);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://openlibrary.org/search.json?q=${searchTerm}`);
      const searchResults: any[] = response.data.docs;
      const books: Book[] = searchResults.map((item: any) => ({
        key: item.key,
        title: item.title,
        authors: item.author_name,
        coverUrl: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`,
        genre: item.subject ? item.subject.join(', ') : '',
        publicationYear: item.first_publish_year,
        description: '',
        isFavorite: false,
      }));
      setBooks(books);
      setLoading(false);
    } catch (error) {
      console.error('Error searching books:', error);
      setLoading(false);
    }
  };

  const loadFavoriteBooks = async () => {
    try {
      const favoriteBooks = await AsyncStorage.getItem('favoriteBooks');
      if (favoriteBooks !== null) {
        const parsedFavoriteBooks: Book[] = JSON.parse(favoriteBooks);
        const updatedBooks = books.map(book => ({
          ...book,
          isFavorite: parsedFavoriteBooks.some(favoriteBook => favoriteBook.key === book.key)
        }));
        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error('Error loading favorite books:', error);
    }
  };

  const toggleFavorite = async (key: string) => {
    try {
      const updatedBooks = books.map(book => {
        if (book.key === key) {
          return { ...book, isFavorite: !book.isFavorite };
        }
        return book;
      });
      setBooks(updatedBooks);
      await AsyncStorage.setItem('favoriteBooks', JSON.stringify(updatedBooks.filter(book => book.isFavorite)));
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setLoading(true);
    fetchBooks();
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity style={{}} onPress={() => navigation.navigate('BooksDetails',{book : item})}>
    <View style={{ padding: 10, height: 110, width: '100%', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff', flexDirection: 'row' }}>
      <View>
        <Image
          style={{ flex: 1, width: 70, backgroundColor: 'lightgrey', borderRadius: 5 }}
          source={{ uri: item.coverUrl }}
        />
      </View>

      <View style={{ width: '70%', paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: '900' }}>{item.title}</Text>
        <Text style={{ maxHeight: 20 }}>{item.authors}</Text>
        {item.genre && <Text style={{ maxHeight: 20 }}>{item.genre}</Text>}
        <Text>{item.publicationYear}</Text>
        <Text>{item.description}</Text>
      </View>

      <View style={{ flex: 1, width: 60, }}>
        <TouchableOpacity onPress={() => toggleFavorite(item.key)} >
          {item.isFavorite ?
            <Image
              style={{ height: 20, width: 20, top: 5, alignSelf: 'center' }}
              source={require('../screens/Images/images.png')}
            />
            :
            <Image
              style={{ height: 18, width: 20, top: 5, alignSelf: 'center' }}
              source={require('../screens/Images/download.png')}
            />
          }

        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 12 }}>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{ height: 40, width: searchTerm !== '' ? '90%' : '100%', borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
          onChangeText={text => setSearchTerm(text)}
          value={searchTerm}
          placeholder="Search books by title"
          onSubmitEditing={searchBooks}
        />
        {searchTerm !== '' && (
          <TouchableOpacity onPress={handleClearSearch} style={{ margin: 5 }}>
            <Image
              style={{ height: 25, width: 25, top: 5, alignSelf: 'center', }}
              source={require('../screens/Images/cross.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

export default BookListScreen;
