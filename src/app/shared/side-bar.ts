import { FuseNavigationItem } from '../../@fuse/components/navigation';

export const navigationAdmin: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Features',
    subtitle: 'Internationalization management',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'home.companies',
        title: 'Company',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/companies',
      },
      {
        id: 'home.features',
        title: 'Features',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/features',
      },
      {
        id: 'home.groups',
        title: 'Groups',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/groups',
      },
      {
        id: 'home.currencies',
        title: 'Currencies',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/currencies',
      },
      {
        id: 'home.thirdparty',
        title: 'Third Party',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/thirdparty',
      },
      {
        id: 'home.typethirdparty',
        title: 'Third Party Type',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/typethirdparty',
      },
      {
        id: 'home.paramprojects',
        title: 'ParamProject',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/paramprojects',
      },
      {
        id: 'home.userfeatures',
        title: 'Users Features',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/userfeatures',
      },
      {
        id: 'home.countries',
        title: 'Countries',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/countries',
      },
    ],
  },
  {
    id: 'home',
    title: 'Administration',
    subtitle: 'Users management',
    type: 'group',
    icon: 'heroicons_outline:user-group',
    children: [
      {
        id: 'home.users',
        title: 'Users',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: 'home/users',
      },
    ],
  },
  {
    id: 'home',
    title: 'Account',
    subtitle: 'Settings management',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'home.profile',
        title: 'Profile',
        type: 'basic',
        icon: 'heroicons_outline:user-circle',
        link: 'home/profile',
      },
    ],
  },
];
export const navigationClient: FuseNavigationItem[] = [
  {
    id: 'home',
    title: 'Features',
    subtitle: 'Internationalization management',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'home.companies',
        title: 'Projects',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: 'home/companies',
      },
    ],
  },
  {
    id: 'home',
    title: 'Account',
    subtitle: 'Settings management',
    type: 'group',
    icon: 'heroicons_outline:home',
    children: [
      {
        id: 'home.profile',
        title: 'Profile',
        type: 'basic',
        icon: 'heroicons_outline:user-circle',
        link: 'home/profile',
      },
    ],
  },
];
