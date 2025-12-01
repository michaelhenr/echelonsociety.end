import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Products from '@/pages/Products';

describe('Products page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Products /></MemoryRouter>);
  });
});
