import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '@/pages/Index';

describe('Index page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Index /></MemoryRouter>);
  });
});
