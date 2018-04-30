const siteConfig = {
  title: 'oribella',
  tagline: 'Gestures, for everyone, everywhere',
  disableTitleTagline: true,
  url: 'https://oribella.github.io/oribella',
  baseUrl: '/',
  projectName: 'oribella',
  organizationName: 'oribella',
  headerLinks: [
    { doc: 'introduction', label: 'Docs' },
    { search: true },
    { href: 'https://github.com/oribella/oribella', label: '\uf09b' },
  ],
  headerIcon: 'img/oa.svg',
  disableHeaderTitle: true,
  ogImage: 'img/oa.svg',
  favicon: 'img/oa-favicon.png',
  colors: {
    primaryColor: '#333',
    secondaryColor: '#555',
  },
  copyright: `Copyright © ${new Date().getFullYear()} Oribella`,
  highlight: {
    theme: 'atom-one-light',
  },
  scripts: [
    'https://buttons.github.io/buttons.js',
  ],
  stylesheets: [
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  ],
  repoUrl: 'https://github.com/oribella/oribella',
  algolia: {
    apiKey: 'ddaa175b4947881d3a2270dc6e5cd945',
    indexName: 'oribella',
     algoliaOptions: {
     hitsPerPage: 7,
    },
  },
};

module.exports = siteConfig;
