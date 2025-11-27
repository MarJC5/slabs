import { extractFieldData } from '@slabs/fields';

export function save(element: HTMLElement): any {
  const fieldsContainer = element.querySelector('.slabs-fields');
  return extractFieldData(fieldsContainer as HTMLElement);
}
