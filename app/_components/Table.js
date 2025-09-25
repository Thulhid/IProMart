"use client";

import { createContext } from "react";

const TableContext = createContext();
function Table({ children }) {
  return (
    <TableContext.Provider value={{}}>
      <div
        role="table"
        className="overflow-hidden rounded-lg border border-zinc-700 max-w-6xl m-auto"
      >
        {children}
      </div>
    </TableContext.Provider>
  );
}

function Header({ children, styles }) {
  return (
    <div>
      <header role="row" className={styles}>
        {children}
      </header>
    </div>
  );
}

function Body({ data, render }) {
  return <div>{data?.map(render)}</div>;
}

function Row({ children, styles }) {
  return <div className={styles}>{children}</div>;
}

function Footer({ children }) {
  return <footer>{children}</footer>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
export default Table;
