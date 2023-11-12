import axios from "axios";

axios.defaults.baseURL = 'https://6550cb5b7d203ab6626e2bc8.mockapi.io';

export const fetchQuizzes = async () => {
    const response = await axios.get('/quizes');
    return response.data;
};

export const addNewQuiz = async newQuiz => {
    const response = await axios.post('/quizes', newQuiz);
    return response.data;
};

export const deleteQuizById = async quizId => {
    const response = await axios.delete(`/quizes/${quizId}`);
    return response.data;
};