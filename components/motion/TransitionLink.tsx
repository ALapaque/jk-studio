"use client";

/* Lien qui déclenche le voile de transition puis navigue.
   Rendu comme <a href> (SEO + clic-milieu) mais intercepte le clic gauche. */

import { AnchorHTMLAttributes } from "react";
import { useTransition } from "./TransitionProvider";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Mot affiché dans le voile de transition. */
  transitionLabel?: string;
}

export function TransitionLink({
  href,
  transitionLabel,
  onClick,
  children,
  ...rest
}: Props) {
  const { navigate } = useTransition();
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        navigate(href, transitionLabel);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
