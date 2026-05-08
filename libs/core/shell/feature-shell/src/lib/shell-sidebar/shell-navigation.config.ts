export type ShellNavItem = {
  label: string;
  route?: string;
  badge?: string;
  disabled?: boolean;
};

export type ShellNavSection = {
  label: string;
  items: ShellNavItem[];
};

export const SHELL_NAV_SECTIONS: readonly ShellNavSection[] = [
  {
    label: 'Operations',
    items: [
      {
        label: 'Dashboard',
        route: '/dashboard',
      },
      {
        label: 'Products',
        badge: 'Soon',
        disabled: true,
      },
      {
        label: 'Stock movements',
        badge: 'Soon',
        disabled: true,
      },
      {
        label: 'Locations',
        badge: 'Soon',
        disabled: true,
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      {
        label: 'Users',
        badge: 'Soon',
        disabled: true,
      },
      {
        label: 'Settings',
        badge: 'Soon',
        disabled: true,
      },
    ],
  },
];
