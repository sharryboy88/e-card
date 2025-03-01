import React from 'react';
import classes from './PlayerScreen.module.scss';

const PlayerScreen = ({ playerNumber, cards, selectedCard, isActive, revealed, onSelect, backImage }) => {
  return (
    <div className={`${classes.playerScreen} ${playerNumber === 2 ? classes.playerScreenTop : ''}`}>
      {/* Spielername links für Spieler 1, rechts für Spieler 2 */}
      <div className={classes.playerName}>
        Player {playerNumber}
      </div>
      <div className={classes.cardGrid}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${classes.card} ${selectedCard === card ? classes.selected : ''}`}
            onClick={() => isActive && onSelect(card)}
          >
            <img
              src={revealed ? backImage : card.image} // Karte umdrehen, wenn revealed true ist
              alt={revealed ? 'card back' : card.type}
              className={classes.cardImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerScreen;