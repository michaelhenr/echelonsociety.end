import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home';

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
  });
});
