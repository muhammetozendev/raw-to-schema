export function BooleanTransformer(
  value: string | number | boolean
): boolean | null {
  if (value === 'true' || value === 1 || value === '1' || value === true) {
    return true;
  } else if (
    value === 'false' ||
    value === 0 ||
    value === '0' ||
    value === false
  ) {
    return false;
  } else {
    return null;
  }
}

export function NumberTransformer(value: any): number | null {
  const result = Number(value);
  return isNaN(result) ? null : result;
}

export function StringTransformer(value: any): string | null {
  return String(value);
}
