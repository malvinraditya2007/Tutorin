import { Link as RouterLink } from "react-router-dom";

/**
 * Pengganti `next/link`: API sama (`href`), memakai React Router untuk
 * navigasi internal dan <a> biasa untuk tautan eksternal / mailto / anchor.
 */
export default function Link({ href, children, prefetch, replace, scroll, ...rest }) {
  if (typeof href === "string" && /^(https?:|mailto:|tel:|#)/.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={href} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}
