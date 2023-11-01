import { QuizForm } from './QuizForm';
import { QuizList } from './QuizList/QuizList';
import { SearchBar } from './SearchBar';
import { Component } from 'react';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';
// import initialQuizItems from '../quiz-items.json';

export class App extends Component {
  state = {
    quizItems: [],
    filters: {
      topic: '',
      level: 'all',
    },
  };

  render() {
    return (
      <Layout>
        <QuizForm />
        <SearchBar />
        <QuizList items={this.state.quizItems} />
        <GlobalStyle />
      </Layout>
    );
  }
}