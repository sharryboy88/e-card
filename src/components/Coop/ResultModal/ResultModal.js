import React, { Component } from 'react';
import classes from './ResultModal.module.scss';
import Button from '../../../containers/Buttons/Button';

class ResultModal extends Component {
  render() {
    const { 
      revealedCards,
      resultDetails,
      playerScore,
      opponentScore,
      resetGame,
      nextRound,
      currentRound,
      totalRounds // Neue Prop für die Gesamtanzahl der Runden
    } = this.props;

    // Standardwerte für Karten, falls `revealedCards` null oder undefined ist
    const [playerCard, opponentCard] = revealedCards || [
      { type: 'back', image: 'backImage' }, // Standardwert für Spieler 1
      { type: 'back', image: 'backImage' }  // Standardwert für Spieler 2
    ];

    // Überprüfen, ob das Spiel beendet ist (alle Runden gespielt)
    const isGameOver = currentRound >= totalRounds;

    return (
      <div className={classes.modalBackdrop}>
        <div className={classes.modalContent}>
          <h2 className={classes.resultHeader}>
            {resultDetails?.player1?.result === 'win' ? '🏆 PLAYER 1 WON!' : 
             resultDetails?.player2?.result === 'win' ? '🏆 PLAYER 2 WON!' : 
             'TIE!'}
          </h2>

          <div className={classes.cardComparison}>
            <div className={classes.cardWrapper}>
              <img src={playerCard?.image} alt="Player 1" />
              <div className={classes.cardLabel}>
                Player 1 ({playerCard?.type?.toUpperCase() || 'BACK'})
              </div>
              <div className={classes.resultLabel}>
                {resultDetails?.player1?.result?.toUpperCase() || 'TIE'}
              </div>
            </div>
            
            <div className={classes.vs}>VS</div>

            <div className={classes.cardWrapper}>
              <img src={opponentCard?.image} alt="Player 2" />
              <div className={classes.cardLabel}>
                Player 2 ({opponentCard?.type?.toUpperCase() || 'BACK'})
              </div>
              <div className={classes.resultLabel}>
                {resultDetails?.player2?.result?.toUpperCase() || 'TIE'}
              </div>
            </div>
          </div>

          <div className={classes.scoreBoard}>
            <div className={classes.scoreItem}>
              <span>Player 1:</span>
              <strong>{playerScore}</strong> {/* Spieler 1 Punkte */}
              {resultDetails?.player1?.points > 0 && (
                <span className={classes.pointsChange}>+{resultDetails.player1.points}</span>
              )}
            </div>
            <div className={classes.scoreItem}>
              <span>Player 2:</span>
              <strong>{opponentScore}</strong> {/* Spieler 2 Punkte */}
              {resultDetails?.player2?.points > 0 && (
                <span className={classes.pointsChange}>+{resultDetails.player2.points}</span>
              )}
            </div>
          </div>

          <div className={classes.buttonGroup}>
            {!isGameOver ? ( // Wenn das Spiel noch nicht vorbei ist, zeige "Next Round"
              <Button
                text="Next Round"
                btnClass="button__primary"
                clicked={nextRound}
              />
            ) : ( // Wenn das Spiel vorbei ist, zeige "New Game"
              <Button
                text="New Game"
                btnClass="button__primary"
                clicked={resetGame}
              />
            )}
            <Button
              text="Main Menu"
              btnClass="button__secondary"
              href="/"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ResultModal;