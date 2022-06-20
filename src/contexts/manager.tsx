import React, { createContext, useReducer, useState } from 'react';

interface IStock {
  data: IStockProps[];
  total: () => number;
  add: (data: IStockProps) => void;
  remove: (id: any) => void;
  find: (id: any) => IStockProps | undefined;
  update: (id: any, newStock: any) => void;
  set: (data: IStockProps[]) => void;
}

interface IContacts {
  data: IContactProps[];
  add: (data: IContactProps) => void;
  remove: (id: any) => void;
  find: (id: any) => IContactProps | undefined;
  update: (id: any, newStock: any) => void;
  set: (data: IContactProps[]) => void;
}

interface ISearch {
  start: number;
  end: number;
  type: string;
  name: string;
}

interface ManagerContextData {
  orders: IStock;
  contacts: IContacts;
  manager: string;
  search: ISearch;
  setSearch: (val: ISearch) => void;
  setManager(val: string): void;
  clearManager(): void;
}

export const ManagerContext = createContext<ManagerContextData>(
  {} as ManagerContextData,
);

export const ManagerProvider: React.FC = ({ children }) => {
  const [manager, setManager] = useState('');

  const initialData = {
    orders: [],
    contacts: [],
    tasks: [],
    search: { start: 0, end: 0, type: 'month', name: '' },
  };

  const [state, setState] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'manager/set': {
        return {
          ...state,
          manager: action.mode,
        };
      }
      case 'orders/set': {
        return {
          ...state,
          orders: action.data,
        };
      }
      case 'contacts/set': {
        return {
          ...state,
          contacts: action.data,
        };
      }
      case 'search/set': {
        return {
          ...state,
          search: action.data,
        };
      }
      case 'reset': {
        return { ...initialData, cards: state.cards };
      }
      default:
        throw new Error();
    }
  }, initialData);

  // ----------------------------------------------------------------

  const setSearch = (data: ISearch) => {
    setState({
      type: 'search/set',
      data,
    });
  };

  const orders: IStock = {
    data: state.orders,

    total() {
      return this.data
        .filter(({ status }) => status !== 'deleted')
        .map(({ value, cost, amount }) => (value - cost) * amount)
        .reduce((prev: number, next: number) => prev + next, 0);
    },

    add(data: IStockProps) {
      setState({
        type: 'orders/set',
        data: [...this.data, { ...data }],
      });
    },

    remove(id: any) {
      setState({
        type: 'orders/set',
        data: this.data.map((obj: any) =>
          obj.catalog_id === id ? { ...obj, status: 'deleted' } : obj,
        ),
      });
    },

    find(id: any) {
      return this.data.find(e => e.catalog_id === id);
    },

    set(data: IStockProps[]) {
      setState({
        type: 'orders/set',
        data,
      });
    },

    update(id: any, newStock: any) {
      const newState = this.data.map((obj: any) =>
        obj.catalog_id === id ? { ...obj, ...newStock } : obj,
      );

      setState({ type: 'orders/set', data: newState });
    },
  };

  /*/----------------------------------------------------------------/*/

  const contacts: IContacts = {
    data: state.contacts,

    add(data: IContactProps) {
      setState({
        type: 'contacts/set',
        data: [...state.contacts, { ...data }],
      });
    },

    remove(id: any) {
      setState({
        type: 'contacts/set',
        data: this.data.map((obj: any) =>
          obj.contact_id === id ? { ...obj, status: 'deleted' } : obj,
        ),
      });
    },

    find(id: any) {
      return state.contacts.find((e: any) => e.contact_id === id);
    },

    set(data: IContactProps[]) {
      setState({
        type: 'contacts/set',
        data,
      });
    },

    update(id: any, newStock: any) {
      const newState = state.contacts.map((obj: any) =>
        obj.contact_id === id ? { ...obj, ...newStock } : obj,
      );

      setState({ type: 'contacts/set', data: newState });
    },
  };

  /*/----------------------------------------------------------------/*/

  function clearManager() {
    setManager('');
    setState({ type: 'reset' });
  }

  return (
    <ManagerContext.Provider
      value={{
        search: state.search,
        setSearch,
        orders,
        contacts,
        manager,
        setManager,
        clearManager,
      }}>
      {children}
    </ManagerContext.Provider>
  );
};
