import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Admin from '@/pages/Admin';

describe('Admin page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Admin /></MemoryRouter>);
  });
});
