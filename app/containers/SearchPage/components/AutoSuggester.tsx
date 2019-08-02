import * as React from 'react';
import { Typeahead, AsyncTypeahead, } from 'react-bootstrap-typeahead'; // ES2015
import {gql, ApolloClient} from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import { SuggestionsQuery } from 'types/SuggestionsQuery';
import { path, pathOr, test, is, map } from 'ramda';

const QUERY = gql`
  query SuggestionsQuery($prefix: String) {
    autosuggest(prefix: $prefix) {
      word
    }
  }
`;

class SuggestionsQueryComponent extends Query<
  SuggestionsQuery
  > {}

interface SuggestionsProps {
  prefix: String;
}
interface SuggestionsState {
  isLoading: boolean;
  options: [String] | null;
}

class AutoSuggester extends React.Component<SuggestionsProps, SuggestionsState> {
  constructor(props) {
    super(props);
    this.state = {
      options: [''],
      isLoading: false,
    }
  }
  render() {
    return (<ApolloConsumer> 
      {client => this.renderMain(client)}
    </ApolloConsumer>)
  }
  eachPath = arrayData => path(['word'], arrayData);


  onSearch = async (query: string, client:ApolloClient<any>) => {

    this.setState({isLoading: true});

    const {data}: any = await client.query({
      query: QUERY, 
      variables: {
        prefix: query
      }
    });
    const autoSuggestData: any = path(['autosuggest'], data);
    let wordList: [] | null | undefined | any = null;
    wordList = map(this.eachPath, autoSuggestData);


    this.setState({
      options: wordList,
      isLoading: false
    });
  };

  renderMain(client:ApolloClient<any>) {
    //const defaultOptions = ['Jick', 'Miles', 'Charles', 'Herbie'];

    return (
      <AsyncTypeahead {...this.props} 
      options={this.state.options} 
      isLoading={this.state.isLoading}
      onSearch = {e=>this.onSearch(e,client)}
      minLength={1} 
      maxResults={10} />
    );
  }

}

export default AutoSuggester;
