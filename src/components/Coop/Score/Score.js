import React, { Component } from 'react';
import classes from './Score.module.scss';

class Score extends Component {
  state = {
    player1Styles: {},
    player2Styles: {}
  };

  componentDidUpdate(prevProps) {
    if (prevProps.player2Score !== this.props.player2Score) {
      this.setGreenColor('player2');
    }
    if (prevProps.player1Score !== this.props.player1Score) {
      this.setGreenColor('player1');
    }
  }

  setGreenColor = (user) => {
    if (user === 'player2') {
      this.setState({ player2Styles: { color: '#2CE960', fontSize: '4.8rem' } });
      setTimeout(() => this.setState({ player2Styles: {} }), 1000);
    }

    if (user === 'player1') {
      this.setState({ player1Styles: { color: '#2CE960', fontSize: '4.8rem' } });
      setTimeout(() => this.setState({ player1Styles: {} }), 1000);
    }
  };

  render() {
    const { player1Score, player2Score } = this.props;
    return (
      <div className={classes.score}>
        <div className={classes.score__circle}>
          <p
            style={this.state.player2Styles}
            className={[classes.score__player2, classes.score__amount].join(' ')}
          >
            {player2Score}
          </p>
          <p
            style={this.state.player1Styles}
            className={[classes.score__player1, classes.score__amount].join(' ')}
          >
            {player1Score}
          </p>
        </div>
      </div>
    );
  }
}

export default Score;