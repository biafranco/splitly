
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('should display the application name', () => {
    render(<App />);

    expect(screen.getByText('Splitly')).toBeInTheDocument();
  });

  it('should display the dashboard', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Visão geral' }),
    ).toBeInTheDocument();
  });

  it('should display the group creation link', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: 'Criar primeiro grupo' }),
    ).toBeInTheDocument();
  });
});
