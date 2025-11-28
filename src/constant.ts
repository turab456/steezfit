// const DEFAULT_API_BASE_URL = "http://localhost:7000/api/v1";

// export const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;


//production
const DEFAULT_API_BASE_URL = "https://server.aesthco.com/api/v1";
  
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
