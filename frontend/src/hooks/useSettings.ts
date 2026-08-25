import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api';

/** Kontakt podaci stranice — dijele ih kontakt stranica i footer. */
export function useSettings() {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
    staleTime: 5 * 60 * 1000,
  });
  return data;
}
