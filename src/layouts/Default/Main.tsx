const Main = ({ children }) => (
  <main
    className={`
        flex flex-col justify-start 
        flex-grow 
        w-full
    `}
  >
    {children}
  </main>
);

export default Main;
