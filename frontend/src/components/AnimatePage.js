import React, { useRef, useEffect } from 'react';

const AnimatePage = (props) => {
    const animateRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (animateRef.current) {
                animateRef.current.classList.add("remove-animate");
            }
        }, props.infinite ? Infinity : 1000);

        return () => clearTimeout(timeout);
    }, [props.infinite]);

    return (
        <div className="animate-page" ref={animateRef}>
            <div className="charging"></div>
        </div>
    );
};

export default AnimatePage;
