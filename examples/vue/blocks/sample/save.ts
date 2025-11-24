import { extractFieldData } from '@slabs/fields';

export function save(element: HTMLElement): any {
  // Find the fields container created by renderBlockEditor
  const fieldsContainer = element.querySelector('.slabs-fields');

  if (!fieldsContainer) {
    console.warn('Fields container not found in sample block');
    return {};
  }

  // Use @slabs/fields to extract data
  const data = extractFieldData(fieldsContainer as HTMLElement);
  console.log('Sample data saved:', data);
  return data;
}
