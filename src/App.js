import React, { useCallback, useState } from "react";
import { debounce } from "lodash";
import { DebounceInput } from "react-debounce-input";

const App = () => {
  const [suggestions, setSuggestions] = useState("");

  const debouncefun = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (value) => {
    fetch(`https://demo.dataverse.org/api/search?q=${value}`)
      .then((res) => res.json())
      .then((json) => setSuggestions(json.data.items));
  };
  // Make debounce function way
  const optimizedFn = useCallback(debouncefun(handleChange), []);

  // Make loadash method
  const handleChangeWithLib = debounce((value) => {
    fetch(`https://demo.dataverse.org/api/search?q=${value}`)
      .then((res) => res.json())
      .then((json) => setSuggestions(json.data.items));
  }, 500);

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Debouncing in React JS</h2>
      <label>Make debounce function way : </label>
      <input
        type="text"
        className="search"
        placeholder="Enter something here..."
        onChange={(e) => optimizedFn(e.target.value)}
      />
      <br />
      <br />
      <label>Make loadash method : </label>
      <input
        type="text"
        className="search"
        placeholder="Enter something here..."
        onChange={(e) => handleChangeWithLib(e.target.value)}
      />
      <br />
      <br />
      <label>Make DebounceInput method : </label>
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        onChange={(e) => handleChangeWithLib(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="autocomplete">
          {suggestions.map((el, i) => (
            <div key={i} className="autocompleteItems">
              <span>{el.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default App;
