import styled from 'styled-components'

const Wrapper = styled.div`
  background: var(--white);
  border-radius: var(--borderRadius);
  padding: 1.5rem;
  box-shadow: var(--shadow-3);
  border-left: 5px solid var(--primary-500);
  margin-top: 1rem;

  h4 {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-600);
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .analysis-section {
    margin-bottom: 1rem;
    
    h5 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--grey-500);
      margin-bottom: 0.5rem;
    }
    
    p {
      color: var(--grey-700);
      line-height: 1.5;
      background: var(--grey-50);
      padding: 0.75rem;
      border-radius: var(--borderRadius);
      border: 1px solid var(--grey-100);
    }
  }

  .upskilling {
    border-left: 3px solid #e9b949;
    p {
      background: #fffbef;
    }
  }

  .gap {
    border-left: 3px solid #d66a6a;
    p {
      background: #fff5f5;
    }
  }
`

export default Wrapper
