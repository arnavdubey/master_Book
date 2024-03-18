// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookListScreen from './screens/BookListScreen';
import BooksDetails from './screens/BookDetails';
import { RootStackParamList } from './types';


const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Book List' }} />
        <Stack.Screen name="BooksDetails" component={BooksDetails} options={{ title: 'Book Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
