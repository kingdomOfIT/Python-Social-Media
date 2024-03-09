import React, { Component } from 'react'

export class AnimatePage extends Component {
    constructor(props) {
        super(props);
        this.animateRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.animateRef.current) {
                this.animateRef.current.classList.add("remove-animate");
            }
        }, this.props.infinite ? Infinity : 1000);
    }

    render() {
        return (
            <div className="animate-page" ref={this.animateRef}> 
                <div className="charging"></div> 
            </div>
        )
    }
}

export default AnimatePage;
