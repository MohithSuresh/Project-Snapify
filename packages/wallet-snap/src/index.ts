import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getBTCPublicData, sendBTC } from './wallet';

globalThis.Buffer = globalThis.Buffer || require('buffer').Buffer;

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'getBTCPublicData':
      return await getBTCPublicData();
    case 'sendBTC':
      return await sendBTC(
        (request as any).params[0],
        (request as any).params[1],
      );
    default:
      throw new Error('Method not found.');
  }
};
