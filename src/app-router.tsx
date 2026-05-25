import { createBrowserRouter } from 'react-router'

import { ShellUiLoader } from '@/shell/feature'

export const appRouter = createBrowserRouter(
  [
    {
      hydrateFallbackElement: <ShellUiLoader fullScreen />,
      lazy: () => import('@/guildsigil/features/guildsigil-feature-home'),
      path: '*',
    },
  ],
  {
    // Set the base URL for router links and redirects, removing trailing slashes if present, independent of the base
    basename: import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, ''),
  },
)
