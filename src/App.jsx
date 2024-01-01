import {useState, useMemo, useEffect} from "react";
import personService from "./services/persons";

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  );
};

const PersonForm = ({
  onSubmit,
  valName,
  onChangeName,
  valNumber,
  onChangeNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={valName} onChange={onChangeName} />
      </div>
      <div>
        number: <input value={valNumber} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({person, onClick}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={onClick}>delete</button>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  const filteredNames = useMemo(() => {
    return persons.filter(person => {
      return person.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [persons, query]);

  const handlerSubmit = event => {
    event.preventDefault();
    if (persons.findIndex(x => x.name === newName) !== -1) {
      return alert(`${newName} is already added to phonebook`);
    }
    const nameObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(nameObject).then(returnedName => {
      setPersons(persons.concat(returnedName));
      setNewName("");
      setNewNumber("");
    });
  };

  const handlerNameChange = event => {
    setNewName(event.target.value);
  };

  const handlerNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handlerSearchChange = event => {
    setQuery(event.target.value);
  };

  const handlerDeleteName = id => {
    const deletedItem = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${deletedItem.name}?`)) {
      personService
        .deleteItem(id)
        .then(() => {
          console.log(`Deleted post with ID ${id}`);
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={query} onChange={handlerSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={handlerSubmit}
        valName={newName}
        onChangeName={handlerNameChange}
        valNumber={newNumber}
        onChangeNumber={handlerNumberChange}
      />
      <h2>Numbers</h2>
      {filteredNames.map(person => (
        <Persons
          key={person.id}
          person={person}
          onClick={() => handlerDeleteName(person.id)}
        />
      ))}
    </div>
  );
};

export default App;
