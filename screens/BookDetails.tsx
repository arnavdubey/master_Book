import React from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type BookDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;

type BookDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetails'>;

type Props = {
  route: BookDetailsScreenRouteProp;
  navigation: BookDetailsScreenNavigationProp;
};

const BooksDetails: React.FC<Props> = ({ route }) => {
    
    const { book } = route.params;

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, }}>{book.title}</Text>
        <Text style={{ fontSize: 18, marginBottom: 10, }}>{book.authors.join(', ')}</Text>
        {book.description && <Text style={{ fontSize: 16 }}>{book.description}</Text>}
    </View>;
}
export default BooksDetails;