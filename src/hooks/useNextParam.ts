import {useSearchParams} from "react-router-dom";

export function useNextParam() {
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');

  return {
    still: next,
    prepared: next?.replaceAll("&", "%26")
  }
}
