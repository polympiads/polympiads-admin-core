import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';

export default function usePageQuery(key: string = 'page') {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const value = parseInt((search as Record<string, string>)[key] ?? '1', 10);

  const setValue = useCallback(
    (newValue: number) => {
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          [key]: Math.trunc(newValue),
        })) as never,
        replace: true,
      });
    },
    [navigate, key]
  );

  return [value, setValue] as const;
}