import {useState, useMemo, useEffect} from "react";
import personService from "./services/persons";

const Filter = ({value, onChange}) => {
  return (
    <div>
      <input
        placeholder="filter shown with"
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      "
        value={value}
        onChange={onChange}
      />
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
        name:{" "}
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          "
          value={valName}
          onChange={onChangeName}
        />
      </div>
      <div>
        number:{" "}
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          "
          value={valNumber}
          onChange={onChangeNumber}
        />
      </div>
      <div>
        <button
          className="my-6 w-full rounded py-1 bg-sky-500 hover:bg-sky-700"
          type="submit"
        >
          add
        </button>
      </div>
    </form>
  );
};

const Persons = ({person, onClick}) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button className="rounded p-1 hover:bg-red-500" onClick={onClick}>
        delete
      </button>
    </div>
  );
};

const Notification = ({message}) => {
  if (message === null) {
    return null;
  }
  return (
    <div className="text-center text-green-700 bg-green-200 p-1 rounded ring-1 ring-green-400">
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [query, setQuery] = useState("");
  const [confirmMessage, setConfirmMessage] = useState(null);

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
    if (
      persons.findIndex(x => x.name.toLowerCase() === newName.toLowerCase()) !==
      -1
    ) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find(
          x => x.name.toLowerCase() === newName.toLowerCase()
        );
        const personId = person.id;
        const personNumber = person.number;
        let updateNumber = prompt("Please enter your new number", personNumber);
        const changedNumber = {...person, number: updateNumber};

        personService
          .updateItem(personId, changedNumber)
          .then(returnedNumber => {
            setPersons(
              persons.map(person =>
                person.id !== personId ? person : returnedNumber
              )
            );
            setConfirmMessage(`updated ${newName}`);
            setTimeout(() => {
              setConfirmMessage(null);
            }, 5000);
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }
    const nameObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(nameObject)
      .then(returnedName => {
        setPersons(persons.concat(returnedName));
        setNewName("");
        setNewNumber("");
        setConfirmMessage(`added ${newName}`);
        setTimeout(() => {
          setConfirmMessage(null);
        }, 5000);
      })
      .catch(error => {
        setConfirmMessage(error.response.data.error);
        setTimeout(() => {
          setConfirmMessage(null);
        }, 5000);
      });
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
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-center m-2">Phonebook</h2>
      <Filter value={query} onChange={handlerSearchChange} />
      <h2 className="text-3xl font-medium text-center mt-3">add a new</h2>
      <Notification message={confirmMessage} />
      <PersonForm
        onSubmit={handlerSubmit}
        valName={newName}
        onChangeName={handlerNameChange}
        valNumber={newNumber}
        onChangeNumber={handlerNumberChange}
      />
      <h2 className="text-3xl font-medium text-center mb-3">Numbers</h2>
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
