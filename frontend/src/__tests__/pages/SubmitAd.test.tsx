import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubmitAd from '@/pages/SubmitAd';

describe('SubmitAd page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><SubmitAd /></MemoryRouter>);
  });
});
