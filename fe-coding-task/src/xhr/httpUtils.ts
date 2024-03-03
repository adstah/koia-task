import { toast } from "react-toastify";

const interceptedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> => {
  try {
    const response = await fetch(input, init);
    const { status, ok } = response;
    switch (status) {
      case 200: {
        toast.success("Data loaded");
        break;
      }
      case 400: {
        toast.error("Inproper data");
        break;
      }
      case 403: {
        toast.error("Too large query");
        break;
      }
      case 404: {
        toast.error("Couldn't find any results");
        break;
      }
      case 429: {
        toast.error("Too many requests");
        break;
      }
      case 503: {
        toast.error("Timed out");
        break;
      }
    }
    if (!ok) {
      toast.error("Unknown error");
      Promise.reject();
    }
    return response;
  } catch (e) {
    toast.error("Something went wrong");
    return Promise.reject();
  }
};

export const POST = (
  url: RequestInfo | URL,
  body: any,
  options?: RequestInit
) =>
  interceptedFetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    method: "POST",
  });

// DISCLAIMER: Below ones are not needed at this point to meet the business needs, but for the case of showing general set up, its especially good if we had some headers to be constantly added like x-api-key, or auth bearer token:
// export const GET = (url: RequestInfo | URL, options?: RequestInit) =>
//   interceptedFetch(url, {
//     ...options,
//     headers: { ...options?.headers },
//     method: "GET",
//   });

// export const DELETE = (url: RequestInfo | URL, options?: RequestInit) =>
//   interceptedFetch(url, {
//     ...options,
//     headers: { ...options?.headers },
//     method: "DELETE",
//   });

// export const PATCH = (
//   url: RequestInfo | URL,
//   body: any,
//   options?: RequestInit
// ) =>
//   interceptedFetch(url, {
//     ...options,
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//     method: "PATCH",
//   });
