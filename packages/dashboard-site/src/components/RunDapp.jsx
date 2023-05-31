import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { defaultSnapOrigin } from '../config';
import styles from '../styles/rundapp.module.css';
import data from './currency_data.json';
import Transaction from './Transaction';

export default function RunDapp() {
  const params = useParams();
  const currencyName = params.id;
  // This function can be used to fetch the data from the backend

  // useEffect(()=>{
  //     fetch(`http://localhost:8000/dapps/${currency_name}`)
  //     .then(res=>res.json())
  //     .then(data=>{
  //         setData(data)
  //     })
  // },[])
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [address, setPublicKey] = useState('');
  const [transactionCount, setTransactionCount] = useState('');

  const [inpAddress, setInpAddress] = useState('');
  const [inpAmount, setInpAmount] = useState('');
  const [inpErr, setInpErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let response = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: [
            defaultSnapOrigin,
            {
              method: 'getBTCPublicData',
            },
          ],
        });
        const { address, balance, transactions } = response;
        setPublicKey(address);
        setBalance(
          `${balance.confirmed / 1e8} BTC (${
            balance.unconfirmed / 1e8
          } BTC pending)`,
        );
        setTransactionCount(
          `${balance.confirmedTransactions} (${balance.unconfirmedTransactions} pending)`,
        );
        setTransactions(
          transactions.map((item, idx) => {
            return {
              id: idx,
              type: item.amount > 0 ? 'Received' : 'Sent',
              amount: item.amount / 1e8,
              address: item.hash,
              currency: 'BTC',
              status: item.status,
              created_at: item.timestamp
                ? new Date(item.timestamp * 1e3).toLocaleString()
                : '',
              fee: item.fee / 1e8,
            };
          }),
        );
      } catch (err) {
        console.error(err);
        alert('Problem happened: ' + err.message || err);
        return undefined;
      }
    })();
  }, []);

  const sendTx = () => {
    setInpErr('Sending transaction....');
    (async () => {
      if (!inpAddress || !/^\d+(\.\d+)?$/.test(inpAmount)) {
        setInpErr('Invalid Input');
        return;
      }
      const amt = parseFloat(inpAmount);
      if (amt < 0.00001) {
        setInpErr('Amount should be greater than 0.00001');
        return;
      }
      if (amt > parseFloat(inpAmount)) {
        setInpErr('Insufficient Balance');
        return;
      }
      try {
        let response = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: [
            defaultSnapOrigin,
            {
              method: 'sendBTC',
              params: [inpAddress, amt],
            },
          ],
        });
        if (response.error) {
          setInpErr(response.error);
          return;
        }
        setInpErr('');
        window.location.reload();
      } catch (err) {
        let error = err.message || err;
        if (error.includes('has no matching Script'))
          setInpErr('Invalid Address');
        else setInpErr(error);
        return undefined;
      }
    })();
  };

  return (
    <div
      style={{ width: '75.5%', margin: '0px auto 0px', position: 'relative' }}
    >
      <h2 className={styles.heading}>{currencyName}</h2>
      <div style={{ fontSize: '20px' }}>Your Balance : {balance}</div>
      <div style={{ fontSize: '20px' }}>
        Your Address : {address} (View on{' '}
        <a
          href={`https://blockstream.info/testnet/address/${address}`}
          target="_blank"
          style={{ color: '#fff' }}
        >
          Block Explorer
        </a>
        )
      </div>
      <div style={{ fontSize: '20px' }}>
        Transaction Count : {transactionCount}
      </div>
      <br></br>
      <div style={{ fontSize: '20px' }}>Send Your {currencyName}</div>
      <div className={styles.sendbox}>
        <input
          className={styles.inputbox}
          placeholder="To Address"
          value={inpAddress}
          onChange={(e) => setInpAddress(e.currentTarget.value)}
        ></input>
        <input
          className={styles.inputbox}
          placeholder="Amount in BTC"
          value={inpAmount}
          type="number"
          onChange={(e) => setInpAmount(e.currentTarget.value)}
        ></input>
        <button className={styles.buttonn} onClick={sendTx}>
          Send
        </button>
      </div>
      <div style={{ color: 'red', textAlign: 'center' }}>{inpErr}</div>
      <hr></hr>
      <div style={{ fontSize: '20px' }}>Transactions</div>
      <div className={styles.transactions}>
        {transactions.map((item) => {
          return (
            <Transaction
              id={item.id}
              type={item.type}
              amount={item.amount}
              address={item.address}
              currency={item.currency}
              status={item.status}
              time={item.created_at}
              fee={item.fee}
            />
          );
        })}
      </div>
    </div>
  );
}
