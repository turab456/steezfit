import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import Footer from './components/common/Footer'

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
  )
}

export default App
