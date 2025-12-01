import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '@/pages/About';

describe('About page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
  });
});
