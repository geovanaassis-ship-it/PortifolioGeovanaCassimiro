import { createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router'
import { Layout } from './components/layout/Layout'
import { ButtonLink } from './components/ui/Button'
import { About } from './pages/About'
import { Admin } from './pages/Admin'
import { CacoC360 } from './pages/CacoC360'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { MoreInvest } from './pages/MoreInvest'
import { NotFound } from './pages/NotFound'
import { OtherProjects } from './pages/OtherProjects'
import { Photography } from './pages/Photography'
import { ProjectPage } from './pages/ProjectPage'

function RouteError() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />
  return (
    <section className="container-page py-24">
      <p className="label-mono text-cherry">Algo deu errado</p>
      <h1 className="mt-4 text-5xl">Não foi possível carregar esta página.</h1>
      <div className="mt-8">
        <ButtonLink to="/">Voltar ao início</ButtonLink>
      </div>
    </section>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sobre', element: <About /> },
      { path: '/more-invest', element: <MoreInvest /> },
      { path: '/more-invest/:slug', element: <ProjectPage /> },
      { path: '/caco-c360', element: <CacoC360 /> },
      { path: '/caco-c360/:slug', element: <ProjectPage /> },
      { path: '/fotografia', element: <Photography /> },
      { path: '/outros-projetos', element: <OtherProjects /> },
      { path: '/outros-projetos/:slug', element: <ProjectPage /> },
      { path: '/contato', element: <Contact /> },
      { path: '/admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
