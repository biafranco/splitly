import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

function navigate(path: string) {
  window.history.replaceState({}, '', path);
  render(<App />);
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function change(element: HTMLElement, value: string) {
  fireEvent.change(element, { target: { value } });
}

function createGroup(name = 'Viagem') {
  click('Novo grupo');

  change(screen.getByLabelText(/nome/i), name);
  click('Criar grupo');
}

function openGroup() {
  createGroup();
  fireEvent.click(screen.getByRole('link', { name: 'Ver grupo' }));
}

function addParticipant(name: string) {
  change(screen.getByLabelText('Nome do participante'), name);
  click('Adicionar participante');
}

function prepareGroup() {
  navigate('/groups');
  openGroup();
  addParticipant('Ana');
  addParticipant('Pedro');
}

function createExpense(
  description = 'Restaurante',
  amount = '100',
) {
  click('Nova despesa');

  const dialog = within(screen.getByRole('dialog'));

  change(dialog.getByLabelText('Descrição'), description);
  change(dialog.getByLabelText('Valor (R$)'), amount);

  click('Salvar despesa');
}

describe('Application integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should create a group', () => {
    navigate('/groups');
    createGroup();

    expect(screen.getByRole('heading', {
      name: 'Viagem',
    })).toBeInTheDocument();
  });

  it('should edit a group', () => {
    navigate('/groups');
    createGroup();

    click('Editar Viagem');
    change(screen.getByLabelText(/nome/i), 'Férias');
    click('Salvar alterações');

    expect(screen.getByRole('heading', {
      name: 'Férias',
    })).toBeInTheDocument();
  });

  it('should delete a group', () => {
    navigate('/groups');
    createGroup();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    click('Excluir Viagem');

    expect(screen.getByText(
      'Nenhum grupo criado',
    )).toBeInTheDocument();
  });

  it('should cancel group creation', () => {
    navigate('/groups');
    click('Novo grupo');
    click('Cancelar');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open group details', () => {
    navigate('/groups');
    openGroup();

    expect(screen.getByRole('heading', {
      name: 'Viagem',
    })).toBeInTheDocument();
  });

  it('should display an unknown group message', () => {
    navigate('/groups/invalid');

    expect(screen.getByText(
      'Grupo não encontrado.',
    )).toBeInTheDocument();
  });

  it('should add participants', () => {
    prepareGroup();

    expect(screen.getByLabelText(
      'Editar participante Ana',
    )).toBeInTheDocument();

    expect(screen.getByLabelText(
      'Editar participante Pedro',
    )).toBeInTheDocument();
  });

  it('should reject duplicate participants', () => {
    prepareGroup();
    addParticipant('Ana');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Participante já cadastrado',
    );
  });

  it('should edit a participant', () => {
    prepareGroup();

    click('Editar participante Ana');

    change(
      screen.getByLabelText('Nome do participante'),
      'Maria',
    );

    click('Salvar participante');

    expect(screen.getByLabelText(
      'Editar participante Maria',
    )).toBeInTheDocument();
  });

  it('should cancel participant editing', () => {
    prepareGroup();

    click('Editar participante Ana');
    click('Cancelar');

    expect(screen.getByRole('button', {
      name: 'Adicionar participante',
    })).toBeInTheDocument();
  });

  it('should remove a participant', () => {
    prepareGroup();

    click('Excluir participante Pedro');

    expect(screen.queryByLabelText(
      'Editar participante Pedro',
    )).not.toBeInTheDocument();
  });

  it('should create an equally divided expense', () => {
    prepareGroup();
    createExpense();

    expect(screen.getByText('Restaurante')).toBeInTheDocument();

    expect(screen.getByRole('button', {
      name: 'Registrar pagamento',
    })).toBeInTheDocument();
  });

  it('should create a custom expense', () => {
    prepareGroup();

    click('Nova despesa');

    const dialog = within(screen.getByRole('dialog'));

    change(dialog.getByLabelText('Descrição'), 'Hotel');
    change(dialog.getByLabelText('Valor (R$)'), '100');
    change(dialog.getByLabelText('Tipo de divisão'), 'custom');

    change(dialog.getByLabelText('Ana'), '70');
    change(dialog.getByLabelText('Pedro'), '30');

    click('Salvar despesa');

    expect(screen.getByText('Hotel')).toBeInTheDocument();
  });

  it('should reject an invalid custom division', () => {
    prepareGroup();

    click('Nova despesa');

    const dialog = within(screen.getByRole('dialog'));

    change(dialog.getByLabelText('Descrição'), 'Hotel');
    change(dialog.getByLabelText('Valor (R$)'), '100');
    change(dialog.getByLabelText('Tipo de divisão'), 'custom');

    change(dialog.getByLabelText('Ana'), '10');
    change(dialog.getByLabelText('Pedro'), '20');

    click('Salvar despesa');

    expect(dialog.getByRole('alert')).toBeInTheDocument();
  });

  it('should edit an expense', () => {
    prepareGroup();
    createExpense();

    click('Editar despesa Restaurante');

    const dialog = within(screen.getByRole('dialog'));

    change(dialog.getByLabelText('Descrição'), 'Almoço');
    change(dialog.getByLabelText('Valor (R$)'), '200');

    click('Salvar despesa');

    expect(screen.getByText('Almoço')).toBeInTheDocument();
    expect(screen.queryByText('Restaurante')).not.toBeInTheDocument();
  });

  it('should delete an expense', () => {
    prepareGroup();
    createExpense();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    click('Excluir despesa Restaurante');

    expect(screen.queryByText(
      'Restaurante',
    )).not.toBeInTheDocument();
  });

  it('should cancel expense deletion', () => {
    prepareGroup();
    createExpense();

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    click('Excluir despesa Restaurante');

    expect(screen.getByText('Restaurante')).toBeInTheDocument();
  });

  it('should cancel expense creation', () => {
    prepareGroup();

    click('Nova despesa');
    click('Cancelar');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should prevent removing participants with expenses', () => {
    prepareGroup();
    createExpense();

    click('Excluir participante Ana');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Este participante possui movimentações financeiras',
    );
  });

  it('should register a settlement', () => {
    prepareGroup();
    createExpense();

    click('Registrar pagamento');

    expect(screen.getByText(
      'Nenhuma dívida pendente.',
    )).toBeInTheDocument();

    expect(screen.getByText(
      'Pedro pagou Ana',
    )).toBeInTheDocument();
  });

  it('should delete a settlement', () => {
    prepareGroup();
    createExpense();

    click('Registrar pagamento');

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    click('Excluir pagamento');

    expect(screen.getByRole('button', {
      name: 'Registrar pagamento',
    })).toBeInTheDocument();
  });

  it('should display expenses in the general expenses page', () => {
    prepareGroup();
    createExpense();

    fireEvent.click(screen.getByRole('link', {
      name: 'Despesas',
    }));

    expect(screen.getByText('Restaurante')).toBeInTheDocument();
  });

  it('should filter expenses by description', () => {
    prepareGroup();

    createExpense('Restaurante');
    createExpense('Hotel');

    fireEvent.click(screen.getByRole('link', {
      name: 'Despesas',
    }));

    change(screen.getByLabelText('Buscar despesas'), 'Hotel');

    expect(screen.getByText('Hotel')).toBeInTheDocument();

    expect(screen.queryByText(
      'Restaurante',
    )).not.toBeInTheDocument();
  });

  it('should display an empty search result', () => {
    prepareGroup();
    createExpense();

    fireEvent.click(screen.getByRole('link', {
      name: 'Despesas',
    }));

    change(
      screen.getByLabelText('Buscar despesas'),
      'Inexistente',
    );

    expect(screen.getByText(
      'Nenhuma despesa encontrada.',
    )).toBeInTheDocument();
  });

  it('should display pending settlements', () => {
    prepareGroup();
    createExpense();

    fireEvent.click(screen.getByRole('link', {
      name: 'Acertos',
    }));

    expect(screen.getByText('Total pendente')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Pedro')).toBeInTheDocument();
  });

  it('should display settlement history', () => {
    prepareGroup();
    createExpense();

    click('Registrar pagamento');

    fireEvent.click(screen.getByRole('link', {
      name: 'Acertos',
    }));

    expect(screen.getByText(
      'Pedro pagou Ana',
    )).toBeInTheDocument();
  });

  it('should display dashboard data', () => {
    prepareGroup();
    createExpense();

    fireEvent.click(screen.getByRole('link', {
      name: 'Visão geral',
    }));

    expect(screen.getByText('Restaurante')).toBeInTheDocument();
    expect(screen.getByText('Despesas recentes')).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: 'Viagem',
    })).toBeInTheDocument();
  });

  it('should display the empty expenses page', () => {
    navigate('/expenses');

    expect(screen.getByText(
      'Nenhuma despesa encontrada.',
    )).toBeInTheDocument();
  });

  it('should display the empty settlements page', () => {
    navigate('/settlements');

    expect(screen.getByText(
      'Nenhum grupo cadastrado.',
    )).toBeInTheDocument();
  });

  it('should redirect unknown routes to the dashboard', () => {
    navigate('/unknown');

    expect(screen.getByRole('heading', {
      name: 'Visão geral',
    })).toBeInTheDocument();
  });
});