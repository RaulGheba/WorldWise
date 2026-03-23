import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "worldwise-cities";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "city/loaded":
      return { ...state, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    default:
      throw new Error("error...");
  }
}

function init() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return { ...initialState, cities: stored ? JSON.parse(stored) : [] };
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    undefined,
    init
  );

  useEffect(
    function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    },
    [cities]
  );

  function getCity(id) {
    const city = cities.find((c) => c.id === id);
    if (city) dispatch({ type: "city/loaded", payload: city });
  }

  function createCity(newCity) {
    const city = { ...newCity, id: Date.now().toString() };
    dispatch({ type: "city/created", payload: city });
  }

  function deleteCity(id) {
    dispatch({ type: "city/deleted", payload: id });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
