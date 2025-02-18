import axois, { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';



const useAxiosWithInterceptor = (): AxiosInstance => {
  const jwtAxios = axois.create({ baseURL: BASE_URL });
  const navigate = useNavigate();

  jwtAxios.interceptors.request.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401) {
        const goRoot = () => navigate('/');
        goRoot();
      }
    }
  )
  return jwtAxios;
}


export default useAxiosWithInterceptor;