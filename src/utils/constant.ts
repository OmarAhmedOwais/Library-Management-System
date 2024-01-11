export const SEARCH_FIELDS = <T>(
  fields: Array<Partial<keyof T>>,
  q: string | undefined,
): unknown =>
  fields.map((key) => ({
    [key]: {
      contains: q || '',
      mode: 'insensitive',
    },
  }));
