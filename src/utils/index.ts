import moment from 'moment';

export function FirstCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function LimitCase(text: string, size: number) {
  return text.length < size ? text : `${text.substring(0, size - 2)}..`;
}

export function ExtractNumbers(text: string) {
  var num = text.replace(/[^0-9]/g, '');
  var result = parseInt(num, 10);
  return isNaN(result) ? 0 : result;
}

export function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const percentageOff = (
  mode: string,
  price: number,
  percentageValue: number,
): number => {
  return mode === 'percent'
    ? Number(price * (1 - percentageValue / 100))
    : Number(price - percentageValue);
};

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function combinedDate(date: any, time: any) {
  return new Date(date).setHours(
    new Date(time).getHours(),
    new Date(time).getMinutes(),
    new Date(time).getSeconds(),
  );
}

export function betweenDays(days: number) {
  const beforeIsoString = moment().subtract(days, 'days').toISOString();
  const start = new Date(beforeIsoString).getTime();
  const end = new Date().getTime();

  return { start, end };
}

export function ISODate(date: any) {
  return new Date(date).toISOString();
}

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
