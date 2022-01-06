const Main = ({ children }) => (
  <main
    className={`
        flex flex-col justify-start 
        flex-grow 
        overflow-auto
        w-full
    `}
  >
    {children}
  </main>
);

export default Main;
