// Datos del sitio en un solo lugar. Para desbloquear un botón, pon su enlace en lugar de `null`.

export const links = {
  steam: null as string | null,
  x: 'https://x.com/dreamvarstudio' as string | null,
  instagram: 'https://www.instagram.com/dreamvar.studio/' as string | null,
  youtube: null as string | null,
  discord: null as string | null,
};

export const socials = [
  { label: 'X (Twitter)', handle: '@dreamvarstudio', href: links.x },
  { label: 'Instagram', handle: '@dreamvar.studio', href: links.instagram },
  { label: 'YouTube', handle: '', href: links.youtube },
  { label: 'Discord', handle: '', href: links.discord },
  { label: 'Steam', handle: '', href: links.steam },
];

export const dates = {
  demo: 'Steam Next Fest, febrero de 2027',
  demoShort: 'Feb. 2027',
  demoTentative: true,
  launch: 'Mediados de 2027',
};
