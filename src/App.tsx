import { RouterProvider } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { router } from './routes'
import Footer from './components/common/Footer'

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
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
    </>
  )
}

export default App
