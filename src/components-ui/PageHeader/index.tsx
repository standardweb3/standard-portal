export const PageHeader = ({ title }) => {
  return (
    <div
      className={`
    flex p-8 
    text-2xl font-semibold capitalize
    text-text
    z-[1]
    `}
    >
      <h1>{title}</h1>
    </div>
  );
};
