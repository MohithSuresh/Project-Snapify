import { OnRpcRequestHandler } from '@metamask/snap-types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let state: any = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = {
      avatarLink:
        "https://assets.vogue.com/photos/62acdde59b61460d58cb83a1/master/w_1600,c_limit/Avatar%20Store_V11_Carousel%203.jpeg",
      twitterLink: 'twitter',
      redditLink: 'reddit',
      instagramLink: 'instagram',
      username: 'ArthurDent',
      userbio:
        "I went to Eaton House Prep, where I encountered Blisters Smyth, a bullying head boy who filled my slippers with tapioca pudding. Would it save you a lot of time if I just gave up and went mad now?",
    };

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
    case 'updateUserData':
      state = request.params;
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
    case 'getUserData':
      return state;
    default:
      throw new Error('Method not found.');
  }
};
