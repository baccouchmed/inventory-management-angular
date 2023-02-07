/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: 'example',
    title: 'Profile',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: 'pages/profile',
  },
  {
    id: 'pages.settings',
    title: 'Settings',
    type: 'basic',
    icon: 'heroicons_outline:cog',
    link: 'home/profile',
  },
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'dashboards.project',
        title: 'Project',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-check',
        link: '/dashboards/project',
      },
      {
        id: 'dashboards.finance',
        title: 'Finance',
        type: 'basic',
        icon: 'heroicons_outline:cash',
        link: '/dashboards/finance',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Applications',
    subtitle: 'Custom made application designs',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'apps.calendar',
        title: 'Calendar',
        subtitle: '3 upcoming events',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/apps/calendar',
      },
      {
        id: 'apps.chat',
        title: 'Chat',
        type: 'basic',
        icon: 'heroicons_outline:chat-alt',
        link: '/apps/chat',
      },
      {
        id: 'apps.contacts',
        title: 'Companys',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/apps/contacts',
      },
      {
        id: 'apps.scrumboard',
        title: 'Scrumboard',
        type: 'basic',
        icon: 'heroicons_outline:view-boards',
        link: '/apps/scrumboard',
      },
    ],
  },
];
