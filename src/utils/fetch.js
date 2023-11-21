import { instance } from '@/utils/axios';
import axios from 'axios';

// Function for register user endpoint
async function registerUser(name, email, password) {
  try {
    const response = await instance.post('/api/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
}

// Function for login user endpoint
async function loginUser(email, password) {
  try {
    const response = await instance.post('/api/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
}

// Function for create book endpoint
async function createBook(formData) {
  try {
    const response = await instance.post('/api/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
}

// Function for get all books endpoint
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:3000/api/books');
    return response;
  } catch (error) {
    throw new Error(error.response.message || 'Something went wrong');
  }
}

// Function for edit book endpoint
async function editBook(id, title, author, publisher, year, pages) {
  console.log('FETCH ===>', title)
  try {
    const response = await instance.put(`/api/books/${id}`, { title, author, publisher, year, pages });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
}

// Function for delete book endpoint
async function deleteBook(id) {
  try {
    const response = instance.delete(`/api/books/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.message || 'Something went wrong');
  }
}

async function getBookDetailById(id) {
  try {
    const response = await axios.get(`http://localhost:3000/api/books/${id}`);
    return response;
  } catch (error) {
    throw new Error(error.response.message || 'Something went wrong');
  }
}

export { registerUser, loginUser, createBook, getAllBooks, editBook, deleteBook, getBookDetailById };
