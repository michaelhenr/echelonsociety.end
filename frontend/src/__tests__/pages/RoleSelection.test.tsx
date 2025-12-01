import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoleSelection from '@/pages/RoleSelection';

describe('RoleSelection page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><RoleSelection /></MemoryRouter>);
  });
});
