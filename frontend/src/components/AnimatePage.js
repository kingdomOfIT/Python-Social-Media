import React, { Component } from 'react'

export class AnimatePage extends Component {
    componentDidMount() {
        setTimeout(() => {
            this.refs.animate.classList.add("remove-animate")
        }, this.props.infinite ? Infinity : 1000);

    }
    render() {
        return (
            <div className="animate-page" ref="animate"> 
                <div className="charging"></div> 
            </div>
        )
    }
}

export default AnimatePage
