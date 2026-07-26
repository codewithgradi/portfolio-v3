import { useState } from "react";
import "./App.css";
import Experience from "./components/ui/Experience";

function App() {
  const handleSelectItem = (item: string) => console.log(item);
  return (
    <>
      <div>Hello World</div>
      <Experience
        onSelectItem={handleSelectItem}
        items={["One", "Two", "Three"]}
        heading='Numbers'
      />
    </>
  );
}

export default App;
