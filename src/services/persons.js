import axios from "axios";
const baseUrl = "http://localhost:3001/persons";
// const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = nameObject => {
  const request = axios.post(baseUrl, nameObject);
  return request.then(response => response.data);
};

const updateItem = (id, changedNumber) => {
  const request = axios.put(`${baseUrl}/${id}`, changedNumber);
  return request.then(response => response.data);
};

const deleteItem = id => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {getAll, create, updateItem, deleteItem};
