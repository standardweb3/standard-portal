import { useState } from 'react';

export enum View {
  List,
  Card,
}

export function useViewSwitcher() {
  const [view, setView] = useState(View.Card);

  const setListView = () => {
    setView(View.List);
  };

  const setCardView = () => {
    setView(View.Card);
  };

  return {
    view,
    setListView,
    setCardView,
  };
}
