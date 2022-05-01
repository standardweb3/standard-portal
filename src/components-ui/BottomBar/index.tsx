import Switchere from '../Switchere';

export function BottomBar() {
  return (
    <div className="absolute bottom-0 z-10 w-full">
      <div className="w-full flex justify-end pb-4 px-4">
        <Switchere />
      </div>
    </div>
  );
}
