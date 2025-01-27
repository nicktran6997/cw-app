import * as React from 'react';
import { Query } from 'react-apollo';
import { Table } from 'react-bootstrap';
import { gql } from 'apollo-boost';
import {
  InterventionsPageQuery,
  InterventionsPageQueryVariables,
} from 'types/InterventionsPageQuery';
import { History } from 'history';
import { match } from 'react-router-dom';

import InterventionItem from './InterventionItem';
import StudySummary from 'components/StudySummary';

const QUERY = gql`
  query InterventionsPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      interventions {
        ...InterventionItemFragment
      }
    }
  }

  ${InterventionItem.fragment}
  ${StudySummary.fragment}
`;

interface InterventionsPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

class QueryComponent extends Query<
  InterventionsPageQuery,
  InterventionsPageQueryVariables
> {}

class InterventionsPage extends React.PureComponent<InterventionsPageProps> {
  static fragment = InterventionItem.fragment;

  handleItemClick = (id: number) => {
    this.props.history.push(`/intervention/${id}`);
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.study) return null;
          this.props.onLoaded && this.props.onLoaded();
          return (
            <div>
              <Table striped>
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Name</th>
                    <th style={{ width: '25%' }}>Kind</th>
                    <th style={{ width: '50%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.study.interventions.map(intervention => (
                    <InterventionItem
                      key={intervention.id}
                      interventionItem={intervention}
                      onClick={this.handleItemClick}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          );
        }}
      </QueryComponent>
    );
  }
}

export default InterventionsPage;
