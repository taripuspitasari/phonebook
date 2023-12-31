import {useState, useMemo} from "react";

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

const Persons = ({person}) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    {name: "Arto Hellas", number: "040-123456", id: 1},
    {name: "Ada Lovelace", number: "39-44-5323523", id: 2},
    {name: "Dan Abramov", number: "12-43-234345", id: 3},
    {name: "Mary Poppendieck", number: "39-23-6423122", id: 4},
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");

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

    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");
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
        <Persons key={person.id} person={person} />
      ))}
    </div>
  );
};

export default App;
