import { BrowserRouter, useRoutes } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { routes } from './routes'
import Footer from './components/common/Footer'

const AppRoutes = () => useRoutes(routes)

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        newestOnTop
        draggable
        transition={Slide}
        className="toast-container"
        toastClassName={({ type }) => `toastify-card toastify-${type || 'default'}`}
        progressClassName="toastify-progress"
      />
      <Footer />
    </BrowserRouter>
  )
}

export default App
