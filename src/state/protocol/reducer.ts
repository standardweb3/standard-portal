import { Protocol } from '@digitalnative/standard-protocol-sdk-test';
import { switchProtocol } from './actions';

import { createReducer } from '@reduxjs/toolkit';

export interface ProtocolState {
  protocol: Protocol;
}

export const initialState: ProtocolState = {
  protocol: Protocol.STANDARD_PROTOCOL,
};

export default createReducer(initialState, (builder) =>
  builder.addCase(switchProtocol, (state, action) => {
    state.protocol = action.payload.protocol;
  }),
);
