import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = nameObject => {
  const request = axios.post(baseUrl, nameObject);
  return request.then(response => response.data);
};

const deleteItem = id => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {getAll, create, deleteItem};
