import React from 'react';
import Wrapper from '../assets/wrappers/FitAnalysisCard';
import FitScore from './FitScore';
import { FaChartLine, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

const FitAnalysisCard = ({
    technicalFit,
    softSkillsFit,
    experienceFit,
    aiFeedback,
    aiGapAnalysis,
    aiUpskillingSuggestions
}) => {
    return (
        <Wrapper>
            <h4><FaChartLine /> Detailed AI Fit Analysis</h4>

            <div className="scores-grid">
                <FitScore score={technicalFit} label="Technical" />
                <FitScore score={softSkillsFit} label="Soft Skills" />
                <FitScore score={experienceFit} label="Experience" />
            </div>

            <div className="analysis-section">
                <h5>Overall Feedback</h5>
                <p>{aiFeedback}</p>
            </div>

            {aiGapAnalysis && (
                <div className="analysis-section gap">
                    <h5><FaExclamationTriangle style={{ color: '#d66a6a' }} /> Gap Analysis</h5>
                    <p>{aiGapAnalysis}</p>
                </div>
            )}

            {aiUpskillingSuggestions && (
                <div className="analysis-section upskilling">
                    <h5><FaLightbulb style={{ color: '#e9b949' }} /> Upskilling Suggestions</h5>
                    <p>{aiUpskillingSuggestions}</p>
                </div>
            )}
        </Wrapper>
    );
};

export default FitAnalysisCard;
