import React, { useEffect, useState } from 'react';
import Wrapper from '../assets/wrappers/FitScore';

const FitScore = ({ score, label, isLoading }) => {
    const [offset, setOffset] = useState(251.2); // Circumference for r=40
    const circumference = 2 * Math.PI * 40;

    useEffect(() => {
        if (!isLoading) {
            const progress = (score / 100) * circumference;
            setOffset(circumference - progress);
        }
    }, [score, isLoading, circumference]);

    const getScoreClass = () => {
        if (score >= 80) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    };

    return (
        <Wrapper className={`${getScoreClass()} ${isLoading ? 'loading' : ''}`}>
            <div className="score-circle">
                <svg>
                    <circle className="bg" cx="50" cy="50" r="40" />
                    <circle
                        className="progress"
                        cx="50"
                        cy="50"
                        r="40"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: isLoading ? circumference : offset,
                        }}
                    />
                </svg>
                <div className="score-text">
                    <span>{isLoading ? '...' : `${score}%`}</span>
                </div>
            </div>
            {label && <div className="label">{label}</div>}
        </Wrapper>
    );
};

export default FitScore;
