import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import BookListScreen from '../screens/BookListScreen';

jest.mock('axios');

describe('BookListScreen', () => {
  const mockBooks = [
    {
      key: '1',
      title: 'Sample Book 1',
      authors: ['Author 1'],
      coverUrl: 'sample-cover-url-1',
      genre: 'Fiction',
      publicationYear: 2022,
      description: 'Sample description 1',
      isFavorite: false,
    },
    {
      key: '2',
      title: 'Sample Book 2',
      authors: ['Author 2'],
      coverUrl: 'sample-cover-url-2',
      genre: 'Non-fiction',
      publicationYear: 2023,
      description: 'Sample description 2',
      isFavorite: false,
    },
  ];

//   beforeEach(() => {
//     axios.get.mockResolvedValue({ data: { works: mockBooks } });
//   });

  test('renders book list correctly', async () => {
    const { getByText, getByTestId } = render(<BookListScreen />);
    await waitFor(() => {   
      expect(getByText('Sample Book 1')).toBeDefined();
      expect(getByText('Sample Book 2')).toBeDefined();
    });
  });

  test('searches for books by title', async () => {
    // axios.get.mockResolvedValue({ data: { docs: mockBooks } });

    const { getByPlaceholderText, getByTestId } = render(<BookListScreen />);
    const searchInput = getByPlaceholderText('Search books by title');
    fireEvent.changeText(searchInput, 'Sample Book');
    fireEvent(searchInput, 'submitEditing');

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://openlibrary.org/search.json?q=Sample%20Book');
      expect(getByTestId('book-list')).toBeDefined();
      expect(getByTestId('book-list').props.data.length).toEqual(2); // Assuming 2 books match the search query
    });
  });

  test('toggles favorite status of a book', async () => {
    const { getByTestId } = render(<BookListScreen />);
    fireEvent.press(getByTestId('toggle-favorite-1'));

    await waitFor(() => {
      expect(getByTestId('toggle-favorite-1').props.source).toEqual(require('../screens/Images/images.png'));
    });
  });
});
