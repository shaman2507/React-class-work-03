import { QuizForm } from './QuizForm/QuizForm';
import { QuizList } from './QuizList/QuizList';
import { SearchBar } from './SearchBar';
import { Component } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';
import { addNewQuiz, deleteQuizById, fetchQuizzes } from './api';
import { Puff } from 'react-loader-spinner';

const initialFilters = {
  topic: '',
  level: 'all',
};

const storageKey = 'quiz-filters';

export class App extends Component {
  state = {
    quizItems: [],
    isLoading: false,
    filters: initialFilters,
  };

  async componentDidMount() {
    const savedFilters = window.localStorage.getItem(storageKey);

    if (savedFilters !== null) {
      this.setState({
        filters: JSON.parse(savedFilters),
      });
    }

    try {
      this.setState({ isLoading: true });
      const initialQuizzes = await fetchQuizzes();
      this.setState({quizItems: initialQuizzes})
    } catch (error) {
      
    } finally {
      this.setState({ isLoading: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.filters !== this.state.filters
    ) {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(this.state.filters)
      );
    }
  };

  updateTopicFilter = newTopic => {
    this.setState(prevState => {
      return {
        filters: {
          ...prevState.filters,
          topic: newTopic,
        },
      };
    });
  };

  updateLevelFilter = newLevel => {
    this.setState(prevState => {
      return {
        filters: {
          ...prevState.filters,
          level: newLevel,
        },
      };
    });
  };

  resetFilters = () => {
    this.setState({
      filters: initialFilters,
    });
  };

  deleteQuiz = async quizId => {
    try {
      const deletedQuiz = await deleteQuizById(quizId);
    } catch (error) {
      
    };
    
  };

  addQuiz = async newQuiz => {
    try {
      this.setState({ isLoading: true });
      const addedQuiz = await addNewQuiz(newQuiz);
      this.setState(prevState => {
        return {
          quizItems: [...prevState.quizItems, addedQuiz],
        };
      });
    } catch (error) {
      
    } finally {
      this.setState({ isLoading: false });
    };
  };

  render() {
    const { quizItems,filters, isLoading} = this.state;

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

    return (
      <Layout>
        <QuizForm onAdd={this.addQuiz} />
        <SearchBar
          filters={filters}
          onUpdateTopic={this.updateTopicFilter}
          onUpdateLevel={this.updateLevelFilter}
          onReset={this.resetFilters}
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
        />)}
        {visibleQuizItems.length > 0 && <QuizList items={visibleQuizItems}
          onDelete={this.deleteQuiz}
        />}
        <GlobalStyle />
      </Layout>
    );
  }
}