import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/abi.json";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";

const contractAddress = "0x1198a5A605aA9e330C0e5abaEeB947E302d4ADB0";
const abi = contract;

function App() {
  const [address, setAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [amount, setAmount] = useState("-");

  //(where: { addr: "${currentAccount}" })

  const _QUERY_COFFEE = gql`
    query MyQuery {
      coffees {
        id
        addr
        amount
      }
    }
  `;

  const Coffee = useQuery(_QUERY_COFFEE);

  useEffect(() => {
    if (!Coffee.loading) {
      const result = Coffee.data.coffees.find(
        (item) => item.addr === currentAccount
      );
      setAmount(result.amount);
    }
  }, [Coffee.loading, Coffee.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      Coffee.refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const make = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeeContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        let Txn = await coffeeContract.make();

        console.log("Making... please wait");
        await Txn.wait();

        console.log(
          `Made, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
      Coffee.refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const drink = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeeContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        let Txn = await coffeeContract.drink();

        console.log("Drinking... please wait");
        await Txn.wait();

        console.log(
          `Drunk, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
      Coffee.refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const give = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeeContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        let Txn = await coffeeContract.give(address);

        console.log("Giving... please wait");
        await Txn.wait();

        console.log(
          `Given, see transaction: https://rinkeby.etherscan.io/tx/${Txn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
      Coffee.refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  const handleChange = (event) => {
    setAddress(event.target.value);
  };
  return (
    <div className="main-app">
      <h1>CoffeeManager</h1>
      <div>{currentAccount ? currentAccount : connectWalletButton()}</div>
      <div style={{ marginTop: "100px", fontSize: "24px" }}>
        Coffee Count: {amount}
      </div>
      <div style={{ marginTop: "50px" }}>
        Address:{" "}
        <input
          type="text"
          id="address"
          name="address"
          style={{ fontSize: "16px", width: "400px" }}
          onChange={handleChange}
          value={address}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <button onClick={make} className="cta-button connect-wallet-button">
          Make
        </button>
        <button onClick={drink} className="cta-button connect-wallet-button">
          Drink
        </button>
        <button onClick={give} className="cta-button connect-wallet-button">
          Give
        </button>
      </div>
    </div>
  );
}

export default App;
