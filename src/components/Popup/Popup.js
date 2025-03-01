import React, { Component } from 'react'
import './Popup.module.scss'

class Popup extends Component {
    state = {
        popupClasses: 'popup__hidden',
        window: null
    }

    componentDidMount() {
        let shouldPopupBeClosed
        shouldPopupBeClosed = localStorage.getItem('popupClosed');
        if(shouldPopupBeClosed) {
            this.setState({popupClasses: 'popup__hidden'})
        } else {
            this.setState({popupClasses: 'popup__container'})
        }
    }

    onHideHandler = () => {
        this.setState({popupClasses: 'popup__hidden'})
        localStorage.setItem('popupClosed', true)
    }
    render() {
        if(!this.props.shouldShow) {
            this.onHideHandler();
        }
        return (
            <div className={this.state.popupClasses}>
                <p>This site uses cookies to make your browsing experience better. We also use google analytics for tracking purposes and we are confident that it is secure.</p>
                <p onClick={this.onHideHandler} className='popup__close'>&#10005;</p>
            </div>
        )
    }
}

export default Popup;