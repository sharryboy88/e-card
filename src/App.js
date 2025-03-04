import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'; // Nur diese Zeile behalten
import './App.scss';

import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import Rules from './components/Rules/Rules';
import About from './components/About/About';
import Game from './components/Game/Game';
import CoOpGame from './components/Coop/CoOpGame.js'; // Importiere den Co-Op-Modus

class App extends Component {
    render() {
        return (
            <Router>
                <Layout>
                    <Route path="/" exact component={Home} />
                    <Route path="/rules" component={Rules} />
                    <Route path="/about/" exact component={About} />
                    <Route path="/game" exact component={Game} />
                    <Route path="/coop" exact component={CoOpGame} /> {/* Neue Route für Co-Op-Modus */}
                </Layout>
            </Router>
        );
    }
}

export default App;