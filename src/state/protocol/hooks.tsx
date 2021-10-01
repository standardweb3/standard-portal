import { Protocol } from '@digitalnative/standard-protocol-sdk-test';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { switchProtocol as switchProtocolAction } from './actions';

export function useProtocol(): Protocol {
  const state = useAppSelector((state) => state.protocol);
  return state.protocol;
}

export function useSwitchProtocol(): [Protocol, (protocol: Protocol) => void] {
  const dispatch = useAppDispatch();
  const currentProtocol = useProtocol();

  const switchProtocol = useCallback(
    (protocol: Protocol) => {
      dispatch(switchProtocolAction({ protocol }));
    },
    [dispatch],
  );
  return [currentProtocol, switchProtocol];
}
