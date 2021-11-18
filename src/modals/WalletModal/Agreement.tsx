export default function Agreement({
  agreed,
  agree,
  disagree,
}: {
  agreed: boolean;
  agree: () => void;
  disagree: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        className="checkbox"
        name="agreed"
        // className="checkbox"
        type="checkbox"
        checked={agreed}
        onChange={(cb: any) => {
          cb.target.checked ? agree() : disagree();
        }}
      />
      <div>I read and accept</div>
    </div>
  );
}
