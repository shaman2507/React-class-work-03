import { QuizForm } from './QuizForm/QuizForm';
import { QuizList } from './QuizList/QuizList';
import { SearchBar } from './SearchBar';
import { useEffect, useState } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';
import { addNewQuiz, deleteQuizById, fetchQuizzes } from './api';
import { Puff } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';


const initialFilters = {
  topic: '',
  level: 'all',
};

const storageKey = 'quiz-filters';

const getInitialFilters = () => {
  const savedFilters = window.localStorage.getItem(storageKey);
  return savedFilters !== null ? JSON.parse(savedFilters) : initialFilters;
};

export const App = () => {
  const [quizItems, setQuizItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filters, setfilters] = useState(getInitialFilters);

  useEffect(() => {
    async function getQuizzes() {
      try {
        setIsLoading(true);
        setError(false);
        const initialQuizzes = await fetchQuizzes();
        setQuizItems(initialQuizzes);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getQuizzes();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(filters)
    );
  }, [filters]);

  const visibleQuizItems = quizItems.filter(item => {
      const hasTopic = item.topic
        .toLowerCase()
        .includes(filters.topic.toLocaleLowerCase());
      
      if (filters.level === "all") {
        return hasTopic;
      }

      const matchesLevel = item.level === filters.level;
      return hasTopic && matchesLevel;
  });

  const addQuiz = async newQuiz => {
    try {
      setIsLoading(true);
      const addedQuiz = await addNewQuiz(newQuiz);
      setQuizItems(prevItems => [...prevItems, addedQuiz]);
    } catch (error) {
      toast.error("ERROR ADDING QUIZ!");
    } finally {
      setIsLoading(false);
    };
  };
  
  const deleteQuiz = async quizId => {
    try {
      setIsLoading(true);
      const deletedQuiz = await deleteQuizById(quizId);
      setQuizItems(prevItems =>
        prevItems.filter(item => item.id !== deletedQuiz.id)
      );
    } catch (error) {
      toast.error("ERROR DELETING THE QUIZ!");
    } finally {
      setIsLoading(false);
    };
  };

  const resetFilters = () => {
    setfilters(initialFilters);
  };

  const updateLevelFilter = newLevel => {
    setfilters(prevFilters => ({
      ...prevFilters,
      level: newLevel,
    }));
  };

  const updateTopicFilter = newTopic => {
    setfilters(prevFilters => ({
      ...prevFilters,
      topic: newTopic,
    }));
  };

  return (
      <Layout>
        <QuizForm onAdd={addQuiz} />
        <SearchBar
          filters={filters}
          onUpdateTopic={updateTopicFilter}
          onUpdateLevel={updateLevelFilter}
          onReset={resetFilters}
        />
        {isLoading && (
          <Puff
            height="80"
            width="80"
            radius={1}
            color="#4fa94d"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
        {error && <b>Oops! Somthing went wrong! Please try to reloading this page!</b>}
        {visibleQuizItems.length > 0 && <QuizList items={visibleQuizItems}
          onDelete={deleteQuiz}
        />}
        <GlobalStyle />
        <Toaster />
      </Layout>
    );
};