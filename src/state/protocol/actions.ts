import { Protocol } from '@digitalnative/standard-protocol-sdk-test';
import { createAction } from '@reduxjs/toolkit';

export const switchProtocol = createAction<{ protocol: Protocol }>(
  'protocol/switchProtocol',
);
