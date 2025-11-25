import { extractFieldData } from '@slabs/fields';

export function save(element: HTMLElement): any {
  // Find the fields container created by renderBlockEditor
  const fieldsContainer = element.querySelector('.slabs-fields');

  if (!fieldsContainer) {
    console.warn('Fields container not found in pricing block');
    return {};
  }

  // Extract data - conditional fields automatically handled
  const data = extractFieldData(fieldsContainer as HTMLElement);
  console.log('Pricing data saved:', data);
  return data;
}
