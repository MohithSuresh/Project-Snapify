import * as bitcoin from 'bitcoinjs-lib';
import {
  BIP44CoinTypeNode,
  getBIP44AddressKeyDeriver,
  SLIP10Node,
} from '@metamask/key-tree';
import { ECPair, bip32 } from './noble-ecc-wrapper';

const BTC_API_URL = 'https://blockstream.info/testnet/api/';

export async function getBTCPublicData() {
  const btcPublicKey = (await wallet.request({
    method: 'snap_getBip32PublicKey',
    params: {
      path: ['m', "84'", "0'", "0'", '0', '0'],
      curve: 'secp256k1',
      compressed: true,
    },
  })) as string;

  const address = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(btcPublicKey.replace(/0x/g, ''), 'hex'),
    network: bitcoin.networks.testnet,
  }).address;

  const balance = await fetch(`${BTC_API_URL}/address/${address}`)
    .then((res) => res.json())
    .then((data) => {
      return {
        confirmed:
          data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
        unconfirmed:
          data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum,
        confirmedTransactions: data.chain_stats.tx_count,
        unconfirmedTransactions: data.mempool_stats.tx_count,
      };
    });

  const transactions = await fetch(`${BTC_API_URL}/address/${address}/txs`)
    .then((res) => res.json())
    .then((data) =>
      data.map((tx: any) => {
        let amount = 0;
        if (tx.vin[0].prevout.scriptpubkey_address === address) {
          amount = -tx.vout.reduce((acc: any, curr: any) => {
            if (curr.scriptpubkey_address !== address) {
              return acc + curr.value;
            }
            return acc;
          }, 0);
        } else {
          amount = tx.vout.reduce((acc: any, curr: any) => {
            if (curr.scriptpubkey_address === address) {
              return acc + curr.value;
            }
            return acc;
          }, 0);
        }
        return {
          hash: tx.txid,
          blockHash: tx.status.block_hash || null,
          blockNumber: tx.status.block_height || null,
          timestamp: tx.status.block_time || null,
          status: tx.status.confirmed ? 'confirmed' : 'unconfirmed',
          fee: tx.fee,
          amount,
        };
      }),
    );

  return {
    address,
    balance,
    transactions,
  };
}

export async function sendBTC(toAddress: string, value: number) {
  const bitcoinNode = (await wallet.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "84'", "0'"],
      curve: 'secp256k1',
    },
  })) as BIP44CoinTypeNode;
  const deriveBTCAddress = await SLIP10Node.fromJSON(bitcoinNode);
  const address = await deriveBTCAddress.derive([
    "bip32:0'",
    'bip32:0',
    'bip32:0',
  ]);

  const changeAddress = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(address.compressedPublicKey.replace(/0x/g, ''), 'hex'),
    network: bitcoin.networks.testnet,
  }).address as string;

  value = Math.round(value * 1e8); // Convert to satoshi

  const feeEstimate = await fetch(`${BTC_API_URL}/fee-estimates`)
    .then((res) => res.json())
    .then((data) => data['1']);

  let left = value;
  let utxo = await fetch(`${BTC_API_URL}/address/${changeAddress}/utxo`)
    .then((res) => res.json())
    .then((data) => data.sort((a: any, b: any) => b.value - a.value))
    .then((data) =>
      data.filter((utxo: any) => {
        if (left <= 1000) return false;
        left -= utxo.value;
        return true;
      }),
    );
  if (left > 0) {
    return {
      error: 'Insufficient balance',
    };
  }
  if (utxo.length !== 1) {
    return {
      error: 'Multiple UTXOs not supported',
    };
  }

  await Promise.all(
    utxo.map(async (utxo: any) => {
      const tx = await fetch(`${BTC_API_URL}/tx/${utxo.txid}`);
      const resp = await tx.json();
      utxo.scriptPubKey = resp.vout[utxo.vout].scriptpubkey;
      return utxo;
    }),
  );

  utxo = utxo[0];

  const unusedPsbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
  unusedPsbt.addInput({
    hash: utxo.txid,
    index: utxo.vout,
    witnessUtxo: {
      script: Buffer.from(utxo.scriptPubKey, 'hex'),
      value: utxo.value,
    },
  });
  unusedPsbt.addOutput({
    address: toAddress,
    value,
  });
  unusedPsbt.addOutput({
    address: changeAddress,
    value: utxo.value - value - Math.round(1000 * feeEstimate),
  });
  unusedPsbt.signAllInputs(
    ECPair.fromPrivateKey(
      Buffer.from(address.privateKey?.replace(/0x/g, '') ?? '', 'hex'),
      {
        network: bitcoin.networks.testnet,
      },
    ),
  );
  unusedPsbt.finalizeAllInputs();
  const unusedTx = unusedPsbt.extractTransaction();
  const unusedTxSize = unusedTx.virtualSize();

  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
  psbt.addInput({
    hash: utxo.txid,
    index: utxo.vout,
    witnessUtxo: {
      script: Buffer.from(utxo.scriptPubKey, 'hex'),
      value: utxo.value,
    },
  });
  psbt.addOutput({
    address: toAddress,
    value,
  });
  psbt.addOutput({
    address: changeAddress,
    value: utxo.value - value - Math.round((unusedTxSize + 5) * feeEstimate),
  });
  psbt.signAllInputs(
    ECPair.fromPrivateKey(
      Buffer.from(address.privateKey?.replace(/0x/g, '') ?? '', 'hex'),
      {
        network: bitcoin.networks.testnet,
      },
    ),
  );

  const validator = (
    pubkey: Buffer,
    msghash: Buffer,
    signature: Buffer,
  ): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

  if (!psbt.validateSignaturesOfAllInputs(validator)) {
    return {
      error: 'Invalid signatures',
    };
  }

  psbt.finalizeAllInputs();

  const result = await wallet.request({
    method: 'snap_confirm',
    params: [
      {
        prompt: 'Would you like to send BTC?',
        description: `You are about to send ${value / 1e8} BTC to ${toAddress}`,
        textAreaContent: `Fee: ${
          Math.round((unusedTxSize + 5) * feeEstimate) / 1e8
        }\nTotal: ${
          (Math.round((unusedTxSize + 5) * feeEstimate) + value) / 1e8
        }`,
      },
    ],
  });

  if (!result) return;

  const resp = await fetch(`${BTC_API_URL}/tx`, {
    method: 'POST',
    body: psbt.extractTransaction().toHex(),
  });

  return { data: await resp.text() };
}

//a
