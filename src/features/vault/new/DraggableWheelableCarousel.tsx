import { useContext, useEffect, useRef, useState } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import useDrag from '../../../hooks/useDrag';
// type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

export function DraggableWheelableCarousel({
  items,
  mapFn,
  onClick = undefined,
  auto = false,
}) {
  //   const carouselRef = useRef<scrollVisibilityApiType>(null);
  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const handleDrag = ({ scrollContainer }) => (ev: React.MouseEvent) =>
    dragMove(ev, (posDiff) => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += posDiff;
      }
    });

  const [selected, setSelected] = useState<string>('');
  const handleItemClick = (itemId: string) => () => {
    if (dragging) {
      return false;
    }
    onClick && onClick();
  };

  function onWheel(apiObj, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
  }

  //   const autoScroll = () => {
  //     const {
  //       scrollNext,
  //       getItemByIndex,
  //       scrollToItem,
  //       isLastItemVisible,
  //     } = useContext(VisibilityContext);
  //     console.log(isLastItemVisible);
  //     if (isLastItemVisible) {
  //       console.log('sss');
  //       const item = getItemByIndex(0);
  //       if (item) {
  //         console.log('ggg');
  //         scrollToItem(item);
  //       }
  //     } else scrollNext();
  //   };

  //   useEffect(() => {
  //     let interval;
  //     if (auto) {
  //       clearInterval(interval);
  //       interval = setInterval(autoScroll, 2000);
  //     }
  //     return clearInterval(interval);
  //   }, [auto]);

  return (
    <div onMouseLeave={() => dragStop()} className="w-full">
      <ScrollMenu
        scrollContainerClassName="space-x-2 scroll no-scrollbar !w-[1px] flex-1"
        LeftArrow={null}
        RightArrow={null}
        onWheel={onWheel}
        onMouseDown={() => dragStart}
        onMouseUp={() => dragStop}
        onMouseMove={handleDrag}
        //   onMouseLeave={() => dragStop}
      >
        {items.map(mapFn)}
      </ScrollMenu>
    </div>
  );
}
