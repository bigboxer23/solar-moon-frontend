declare module 'react-csv/lib/core' {
  export type CsvHeader = { label: string; key: string };

  export function toCSV(
    data: object[],
    headers?: CsvHeader[],
    separator?: string,
    enclosingCharacter?: string,
  ): string;
}
