import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

describe('NotFound page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
  });
});
