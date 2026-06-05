

import { useNavigate, useSearch } from '@tanstack/react-router';
import type { SortingState } from '@tanstack/react-table';
import { useCallback } from 'react';

function sortingStateToString (state: SortingState): string | undefined {
    if (state.length === 0) {
        return undefined;
    }

    const sort = state[0];
    const orderingParam = sort.desc ? `-${sort.id}` : `${sort.id}`;
    return orderingParam;
}
function stringToSortingState (state: string | undefined): SortingState {
    if (state === "" || state === undefined) {
        return [];
    }

    if (state.charAt(0) == '-') {
        return [
            { desc: true, id: state.substring(1) }
        ]
    }

    return [ { desc: false, id: state } ]
}

export default function useOrderingQuery(key: string = 'ordering') {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const orderingParam = (search as Record<string, string>)[key]
  const value = stringToSortingState(orderingParam);

  const setValue = useCallback(
    (newValue: SortingState) => {
      navigate({
        search: ((prev: Record<string, unknown>) => ({
          ...prev,
          [key]: sortingStateToString(newValue),
        })) as never,
        replace: true,
      });
    },
    [navigate, key]
  );

  return [orderingParam, value, setValue] as const;
}