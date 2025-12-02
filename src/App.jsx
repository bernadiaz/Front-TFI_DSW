// import './App.css' 
import Login from './Modules/Auth/Pages/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import OrdersPage from './Modules/Orders/Pages/OrdersPage';
import Dashboard from './Modules/Templates/Components/Dashboard';
import ProtectedRoute from './Modules/Auth/Components/ProtectedRoute';
import {AuthProvider} from './Modules/Auth/Context/AuthProvider';
import HomePage from './Modules/Home/Pages/HomePage';
import ProductsPage from './Modules/Products/Pages/ProductsPage';
import { Outlet } from 'react-router-dom';
import CreateProduct from './Modules/Products/Pages/CreateProduct';
import Register from './Modules/Auth/Pages/Register';
import ProductsCatalogue from './Modules/Products/Pages/ProductsCatalogue';
import ClientSide from './Modules/Templates/Components/ClientSide';
import ShoppingCart from './Modules/Cart/Pages/ShoppingCart';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ClientSide />,
      children: [
        {
          path: '/',
          element: < ProductsCatalogue />
        },
        {
          path: '/cart',
          element: <ShoppingCart />
        },
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/admin',
      element: (<ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>),
      children: [
        {
          path: '/admin/home',
          element: <HomePage />
        },
        {
          path: '/admin/products',
          element: <ProductsPage />
        },
        {
          path: '/admin/products/create',
          element: <CreateProduct />
        },
        {
          path: '/admin/orders',
          element: <OrdersPage />
        },        
      ]
    }
  ])

  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;