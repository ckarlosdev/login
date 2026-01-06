import axios from "axios";
import { useEffect, useState } from "react";

export default <T>(url?: string) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let aborted = false;
    if (!url) {
      setData(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get<T>(url, { signal })
      .then(({ data }) => {
        if (!aborted) {
          setData(data);
        }
      })
      .catch((e) => {
        if (!aborted) {
          console.log(e);
          setError(e);
          setData(undefined);
        }
      })
      .finally(() => {
        if (!aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
      aborted = true;
    };
  }, [url]);

  const search = (url: string) => {
    setLoading(true);
    axios
      .get(url)
      .then(({ data }) => {
        setData(data);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };

  const postData = async (
    url: string,
    payload: any
  ): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<T>(url, payload);
      setData(response.data);
      return response.data;
    } catch (e: any) {
      // Renombramos 'e' a 'error' aquí para que coincida con el resto del código
      const error = e;

      if (axios.isAxiosError(error)) {
        // Verifica si hubo respuesta del servidor (error 4xx/5xx)
        if (error.response) {
          // 1. Obtener los datos del cuerpo del error de forma segura
          const responseData = error.response.data;
          let serverErrorMessage: string;

          if (
            responseData &&
            typeof responseData === "object" &&
            !Array.isArray(responseData)
          ) {
            // 2. Si es un objeto, intentar leer las propiedades conocidas
            serverErrorMessage =
              (responseData as any).message ||
              (responseData as any).error ||
              "Unknown error: Object without filed 'message' or 'error'.";
          } else if (error.response.status === 401) {
            // 3. Fallback específico para 401 si el cuerpo está vacío o es inválido
            serverErrorMessage = "Wrong credentials. Try again.";
          } else {
            // 4. Si es un error de otro tipo (500) y el cuerpo es ilegible
            // serverErrorMessage = `Error del servidor con código ${error.response.status}.`;
            serverErrorMessage = `Server error code ${error.response.status}.`;
          }

          // Establece el objeto de error en el hook
          setError({
            status: error.response.status,
            message: serverErrorMessage,
          });
        } else if (error.request) {
          // No hubo respuesta (problema de red, timeout, CORS)
          setError({
            status: 0,
            // message: "No se pudo conectar al servidor. Verifique la red.",
            message: "No server connection. Check network.",
          });
        } else {
          // Error al configurar la solicitud
          setError({ status: 0, message: "Error configuring the request." });
        }
      } else {
        // Error que no es de Axios
        setError({ status: 0, message: "An unexpected error occurred." });
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const putData = async (url: string, payload: any): Promise<T | undefined> => {
    // console.log("updating url: ", url);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<T>(url, payload);
      setData(response.data); // Opcional: actualizar 'data' con la respuesta del PUT
      return response.data;
    } catch (e: any) {
      console.error("PUT request error:", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, search, postData, putData };
};
