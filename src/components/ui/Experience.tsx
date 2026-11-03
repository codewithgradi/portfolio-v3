// import { MouseEvent } from "react";

import { useState } from "react";
interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}
export default function Experience({ items, heading, onSelectItem }: Props) {
  const name = "Gradi";
  const [selectedIndex, setSelectedIndex] = useState(-1);

  //   const handleClick = (e: MouseEvent) => {
  //     console.log(e);
  //   };
  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>"No items found"</p>}
      {items.map((item, index) => (
        <li
          key={item}
          onClick={() => {
            setSelectedIndex(index);
            onSelectItem(item);
          }}
        >
          {item}
        </li>
      ))}
      <h1>This is Experience for {name}</h1>
    </>
  );
}
