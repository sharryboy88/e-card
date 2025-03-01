import React, { Component } from 'react';
import GameContainer from '../Container/GameContainer';
import PlayerScreen from './PlayerScreen/PlayerScreen';
import ResultModal from './ResultModal/ResultModal';
import Score from './Score/Score';
import Button from '../../containers/Buttons/Button';
import Timeouts from '../../containers/hoc/Timeouts';
import soundfile from '../../sounds/zawa.wav';
import classes from './CoopGame.module.scss';

// Bildimporte
import backImage from '../../img/back.jpg';
import citizenImage from '../../img/citizen.jpg';
import emperorImage from '../../img/emperor.jpg';
import slaveImage from '../../img/slave.jpg';

class Game extends Component {
  constructor(props) {
    super(props);
    this.audio = new Audio(soundfile);
    this.timeouts = [];
    
    this.state = {
      currentRound: 1,
      currentTurn: 1, // Neue State für Turns
      totalRounds: 2,
      totalTurns: 3, // 3 Turns pro Runde
      currentPlayer: 1,
      players: {
        1: { 
          role: 'emperor',
          score: 0,
          cards: [],
          selectedCard: null,
          revealed: false,
          confirmed: false
        },
        2: { 
          role: 'slave',
          score: 0,
          cards: [],
          selectedCard: null,
          revealed: true,
          confirmed: false
        }
      },
      phase: 'selection',
      resultDetails: null,
      showPopup: false
    };
  }

  componentDidMount() {
    this.initializeRound();
  }

  componentWillUnmount() {
    this.timeouts.forEach(clearTimeout);
    this.audio.pause();
  }

  getCardImage = (type) => ({
    back: backImage,
    citizen: citizenImage,
    emperor: emperorImage,
    slave: slaveImage
  }[type] || backImage);

  generateCards = (specialCard) => {
    const cards = Array(4).fill().map(() => ({
      type: 'citizen',
      image: this.getCardImage('citizen')
    }));
    cards.push({
      type: specialCard,
      image: this.getCardImage(specialCard)
    });
    return this.shuffleArray(cards);
  }

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initializeRound = () => {
    this.setState({
      players: {
        1: {
          ...this.state.players[1],
          cards: this.generateCards(this.state.players[1].role),
          selectedCard: null,
          revealed: this.state.currentRound === 1 ? false : true,
          confirmed: false
        },
        2: {
          ...this.state.players[2],
          cards: this.generateCards(this.state.players[2].role),
          selectedCard: null,
          revealed: this.state.currentRound === 1 ? true : false,
          confirmed: false
        }
      },
      phase: 'selection'
    });
  }

  handleCardSelect = (playerId, card) => {
    if (this.state.currentPlayer !== playerId || this.state.phase !== 'selection') return;
    
    this.setState(prevState => ({
      players: {
        ...prevState.players,
        [playerId]: {
          ...prevState.players[playerId],
          selectedCard: card
        }
      }
    }));
  }

  handleConfirmation = () => {
    this.setState(prevState => ({
      players: {
        ...prevState.players,
        [prevState.currentPlayer]: {
          ...prevState.players[prevState.currentPlayer],
          confirmed: true,
          revealed: true
        }
      }
    }), () => {
      if (this.state.players[1].confirmed && this.state.players[2].confirmed) {
        this.showResult();
      } else {
        this.setState({ showPopup: true }, () => {
          this.timeouts.push(setTimeout(() => {
            this.setState({ showPopup: false });

            const nextPlayer = this.state.currentPlayer === 1 ? 2 : 1;
            this.setState({ currentPlayer: nextPlayer });

            this.setState(prevState => ({
              players: {
                ...prevState.players,
                [nextPlayer]: {
                  ...prevState.players[nextPlayer],
                  revealed: false
                }
              }
            }));
          }, 3000));
        });
      }
    });
  }

  showResult = () => {
    this.audio.play();
    this.timeouts.push(setTimeout(() => {
      const { players, currentRound } = this.state;
      const playerCard = players[1].selectedCard?.type;
      const opponentCard = players[2].selectedCard?.type;

      const { result, points } = this.checkResults(playerCard, opponentCard);

      if (result === 'draw') {
        // Bei Unentschieden: Karten entfernen und Zustand zurücksetzen
        const updatedPlayers = { ...players };
        updatedPlayers[1].cards = updatedPlayers[1].cards.filter(card => card !== players[1].selectedCard);
        updatedPlayers[2].cards = updatedPlayers[2].cards.filter(card => card !== players[2].selectedCard);

        this.setState({
          players: {
            ...updatedPlayers,
            1: {
              ...updatedPlayers[1],
              selectedCard: null,
              revealed: currentRound === 1 ? false : true, // Karten von Spieler 1 zudecken (Runde 1) oder aufdecken (Runde 2)
              confirmed: false
            },
            2: {
              ...updatedPlayers[2],
              selectedCard: null,
              revealed: currentRound === 1 ? true : false, // Karten von Spieler 2 aufdecken (Runde 1) oder zudecken (Runde 2)
              confirmed: false
            }
          },
          phase: 'selection'
        });

        // Wechsel zum nächsten Spieler
        const nextPlayer = this.state.currentPlayer === 1 ? 2 : 1;
        this.setState({ currentPlayer: nextPlayer });

        return;
      }

      // Punkte vergeben
      const updatedPlayers = { ...players };
      if (result === 'win') {
        updatedPlayers[1].score += points;
      } else if (result === 'lose') {
        updatedPlayers[2].score += opponentCard === 'slave' ? 3 : 1;
      }

      this.setState({
        phase: 'result',
        resultDetails: {
          player1: { 
            card: playerCard, 
            result: result === 'win' ? 'win' : result === 'draw' ? 'draw' : 'lose',
            points: result === 'win' ? points : 0
          },
          player2: { 
            card: opponentCard, 
            result: result === 'lose' ? 'win' : result === 'draw' ? 'draw' : 'lose',
            points: result === 'lose' ? (opponentCard === 'slave' ? 3 : 1) : 0
          }
        },
        players: updatedPlayers
      });
    }, 1000));
  }

  checkResults = (playerCard, opponentCard) => {
    if (playerCard === opponentCard) return { result: 'draw', points: 0 };
    
    const rules = {
      emperor: { beats: ['citizen'], points: 1 },
      citizen: { beats: ['slave'], points: 1 },
      slave: { beats: ['emperor'], points: 3 }
    };

    if (rules[playerCard]?.beats.includes(opponentCard)) {
      return { result: 'win', points: rules[playerCard].points };
    }
    return { result: 'lose', points: 0 };
  }

  nextTurn = () => {
    this.setState(prevState => ({
      currentTurn: prevState.currentTurn + 1
    }), () => {
      if (this.state.currentTurn > this.state.totalTurns) {
        this.nextRound(); // Nächste Runde starten
      } else {
        this.initializeRound(); // Neue Karten für den nächsten Turn
      }
    });
  }

  nextRound = () => {
    this.setState(prevState => ({
      currentRound: prevState.currentRound + 1,
      currentTurn: 1,
      currentPlayer: prevState.players[1].role === 'emperor' ? 2 : 1, // Rollenwechsel
      players: {
        1: { 
          ...prevState.players[1],
          role: prevState.players[2].role, // Rollen tauschen
          selectedCard: null,
          revealed: prevState.currentRound === 1 ? false : true, // Karten von Spieler 1 zudecken (Runde 1) oder aufdecken (Runde 2)
          confirmed: false
        },
        2: { 
          ...prevState.players[2],
          role: prevState.players[1].role, // Rollen tauschen
          selectedCard: null,
          revealed: prevState.currentRound === 1 ? true : false, // Karten von Spieler 2 aufdecken (Runde 1) oder zudecken (Runde 2)
          confirmed: false
        }
      }
    }), () => {
      if (this.state.currentRound > this.state.totalRounds) {
        this.checkGameEnd(); // Spiel beenden
      } else {
        this.initializeRound(); // Neue Runde initialisieren
      }
    });
  }

  checkGameEnd = () => {
    const winner = this.state.players[1].score > this.state.players[2].score ? 1 : 2;
    alert(`Spiel beendet! Spieler ${winner} gewinnt mit ${this.state.players[winner].score} Punkten!`);
    this.resetGame();
  }

  resetGame = () => {
    this.timeouts.forEach(clearTimeout);
    this.audio.pause();
    this.audio.currentTime = 0;
    
    this.setState({
      currentRound: 1,
      players: {
        1: { 
          role: 'emperor',
          score: 0,
          cards: [],
          selectedCard: null,
          revealed: false,
          confirmed: false
        },
        2: { 
          role: 'slave',
          score: 0,
          cards: [],
          selectedCard: null,
          revealed: true,
          confirmed: false
        }
      },
      phase: 'selection',
      resultDetails: null,
      showPopup: false
    }, this.initializeRound);
  }

  render() {
    const { 
      currentPlayer,
      players,
      phase,
      resultDetails,
      currentRound,
      showPopup
    } = this.state;

    return (
      <GameContainer>
        <Score 
          player1Score={players[1].score} 
          player2Score={players[2].score} 
          currentRound={currentRound}
        />

        <div className={classes.playersContainer}>
          {/* Spieler 1 unten */}
          <PlayerScreen
            playerNumber={1}
            cards={players[1].cards}
            selectedCard={players[1].selectedCard}
            isActive={currentPlayer === 1 && phase === 'selection'}
            revealed={players[1].revealed}
            onSelect={(card) => this.handleCardSelect(1, card)}
            backImage={this.getCardImage('back')}
          />
          
          {/* Spieler 2 oben */}
          <PlayerScreen
            playerNumber={2}
            cards={players[2].cards}
            selectedCard={players[2].selectedCard}
            isActive={currentPlayer === 2 && phase === 'selection'}
            revealed={players[2].revealed}
            onSelect={(card) => this.handleCardSelect(2, card)}
            backImage={this.getCardImage('back')}
          />
        </div>

        {phase === 'selection' && (
          <div className={classes.confirmContainer}>
            <Button
              text="CONFIRM"
              btnClass={players[currentPlayer].selectedCard ? 'button__confirm' : 'button__disabled'}
              clicked={this.handleConfirmation}
              isDisabled={!players[currentPlayer].selectedCard}
              playerNumber={currentPlayer}
            />
          </div>
        )}

        {phase === 'result' && (
          <ResultModal
            revealedCards={[players[1].selectedCard, players[2].selectedCard]}
            playerScore={players[1].score}
            opponentScore={players[2].score}
            resetGame={this.resetGame}
            resultDetails={resultDetails}
            nextRound={this.nextRound}
            currentRound={currentRound}
            totalRounds={this.state.totalRounds} // Neue Prop
          />
        )}

        {showPopup && (
          <div className={classes.popup}>
            <div className={classes.popupContent}>
              Give Phone to Player {this.state.currentPlayer === 1 ? 2 : 1}
            </div>
          </div>
        )}
      </GameContainer>
    );
  }
}

export default Timeouts(Game);