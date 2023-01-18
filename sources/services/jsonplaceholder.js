import { fetch } from "undici";

export const fetchTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const responseJson = await response.json();

  return responseJson;
};
