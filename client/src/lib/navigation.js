import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/** Pengganti `usePathname` dari next/navigation. */
export function usePathname() {
  return useLocation().pathname;
}

/** Pengganti `useRouter` (subset yang dipakai: push, replace, back). */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to) => navigate(to),
    replace: (to) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}

export { useSearchParams };
