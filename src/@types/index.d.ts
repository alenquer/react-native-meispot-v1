declare module '*.png';

declare interface IStockProps {
  catalog_id: any;
  relation_id?: any;
  value: number;
  cost: number;
  amount: number;
  status?: string;
}

declare interface ISettings {
  language: string;
  currency: string;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare interface IContactProps {
  contact_id: any;
  relation_id?: any;
  status?: string;
}

declare interface IDiscount {
  type: string;
  value: number;
}

declare interface IMethod {
  name: string;
}

declare type IStatus = 'done' | 'pending' | 'canceled' | '';

declare interface IFee {
  type: string;
  value: number;
  to: string;
}

declare type ICatalogCategory = 'product' | 'service' | 'material';

declare interface IDeck {
  key: string;
  render: () => JSX.Element;
  isTitle?: boolean;
}
