import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .score-circle {
    position: relative;
    width: 100px;
    height: 100px;
  }

  svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  circle {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
  }

  .bg {
    stroke: var(--grey-100);
  }

  .progress {
    stroke: var(--primary-500);
    transition: stroke-dashoffset 1s ease-in-out;
  }

  .score-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-500);
    }
  }

  .label {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--grey-500);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--letterSpacing);
  }

  &.high {
    .progress { stroke: #22c55e; }
    .score-text span { color: #22c55e; }
  }
  &.medium {
    .progress { stroke: #e9b949; }
    .score-text span { color: #e9b949; }
  }
  &.low {
    .progress { stroke: #d66a6a; }
    .score-text span { color: #d66a6a; }
  }

  @keyframes shimmer {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  &.loading {
    animation: shimmer 1.5s infinite;
  }
`

export default Wrapper
