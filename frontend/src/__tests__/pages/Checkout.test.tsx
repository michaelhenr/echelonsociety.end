import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '@/pages/Checkout';

describe('Checkout page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Checkout /></MemoryRouter>);
  });
});
