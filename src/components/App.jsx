import { QuizForm } from './QuizForm/QuizForm';
import { QuizList } from './QuizList/QuizList';
import { SearchBar } from './SearchBar';
import { Component } from 'react';
import { nanoid } from 'nanoid';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';
import initialQuizItems from './quiz-items.json';

const initialFilters = {
  topic: '',
  level: 'all',
};

const storageKey = 'quiz-filters';

export class App extends Component {
  state = {
    quizItems: initialQuizItems,
    filters: initialFilters,
  };

  componentDidMount() {
    const savedFilters = window.localStorage.getItem(storageKey);

    if (savedFilters !== null) {
      this.setState({
        filters: JSON.parse(savedFilters),
      });
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

  deleteQuiz = quizId => {
    console.log('deleteQuiz', quizId);
    this.setState(prevState => {
      return {
        quizItems: prevState.quizItems.filter(item => item.id !== quizId),
      };
    });
  };

  addQuiz = newQuiz => {
    const quiz = {
      ...newQuiz,
      id: nanoid(),
    }
    
    this.setState(prevState => {
      return {
        quizItems: [...prevState.quizItems, quiz],
      };
    });
  };

  render() {
    const { quizItems,filters } = this.state;

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
        {visibleQuizItems.length > 0 && <QuizList items={visibleQuizItems}
          onDelete={this.deleteQuiz}
        />}
        <GlobalStyle />
      </Layout>
    );
  }
}