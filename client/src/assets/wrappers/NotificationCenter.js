import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: var(--borderRadius);
  box-shadow: var(--shadow-4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: var(--primary-500);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 0.5rem;
  }

  .notification-item {
    padding: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: var(--transition);
    cursor: pointer;
    border-radius: var(--borderRadius);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    &:last-child {
      border-bottom: none;
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--grey-700);
    }

    .time {
      font-size: 0.75rem;
      color: var(--grey-400);
      margin-top: 0.25rem;
    }

    .status-badge {
      font-size: 0.7rem;
      padding: 0.1rem 0.4rem;
      border-radius: 20px;
      margin-left: 0.5rem;
      text-transform: uppercase;
      font-weight: 700;
    }
  }

  .no-notifications {
    text-align: center;
    color: var(--grey-400);
    padding: 1rem;
  }
`

export default Wrapper
