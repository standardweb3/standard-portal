import Switchere from '../Switchere';

export function BottomBar() {
  return (
    <div className="absolute bottom-0 w-full">
      <div className="w-full flex justify-end pb-4 px-4">
        <div className="z-10">
          <Switchere />
        </div>
      </div>
    </div>
  );
}
