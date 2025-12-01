import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubmitBrand from '@/pages/SubmitBrand';

describe('SubmitBrand page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><SubmitBrand /></MemoryRouter>);
  });
});
