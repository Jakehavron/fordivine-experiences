'use client';
import { useEffect } from 'react';

export default function StoryExperience() {
  useEffect(() => {
    const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
    const closeMenu = (event: PointerEvent) => {
      if (menu?.open && !menu.contains(event.target as Node)) menu.open = false;
    };
    const escapeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu?.open) {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    };
    const closeOnLink = (event: MouseEvent) => {
      if ((event.target as Element).closest('a')) menu?.removeAttribute('open');
    };
    const desktop = matchMedia('(min-width: 701px)');
    const closeOnDesktop = () => { if (desktop.matches) menu?.removeAttribute('open'); };
    menu?.addEventListener('click', closeOnLink);
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('pointerdown', closeMenu);
    document.addEventListener('keydown', escapeMenu);
    return () => {
      menu?.removeEventListener('click', closeOnLink);
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('pointerdown', closeMenu);
      document.removeEventListener('keydown', escapeMenu);
    };
  }, []);

  return null;
}
