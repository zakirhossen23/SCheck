import React, { useState, useEffect } from "react";
import NavLink from "next/link";
import { Button } from "@heathmont/moon-core-tw";
import { SoftwareLogOut } from "@heathmont/moon-icons-tw";
import "../../../services/contract";
import isServer from "../../../components/isServer";

declare let window: any;

export function Nav(): JSX.Element {
  const [acc, setAcc] = useState('');
  const [accfull, setAccFull] = useState('');
  const [Balance, setBalance] = useState("");
 
  const [isSigned, setSigned] = useState(false);
  async function fetchInfo() {
    if (window.ethereum == null) {
      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "none";
      window.document.getElementById("installMetaMask").style.display = "";
      return;
    }
    if (window.ethereum.selectedAddress != null && window.localStorage.getItem("ConnectedMetaMask") == "true") {
      const Web3 = require("web3")
      const web3 = new Web3(window.ethereum)
      let Balance = await web3.eth.getBalance(window.ethereum.selectedAddress);

      let subbing = 10;

      if (window.innerWidth > 500) {
        subbing = 20;
      }
      setAccFull(window.ethereum.selectedAddress);
      setAcc(window.ethereum.selectedAddress.toString().substring(0, subbing) + "...");

      setBalance(Balance / 1000000000000000000 + " Celo");
      if (!isSigned)
        setSigned(true);

      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "";
    } else {
      setSigned(false);
      window.document.getElementById("withoutSign").style.display = "";
      window.document.getElementById("withSign").style.display = "none";
    }
  }
  useEffect(() => {
    fetchInfo();
  });


  async function onClickDisConnect() {
    window.localStorage.setItem("ConnectedMetaMask", "");
    window.localStorage.setItem("Type", "");
    window.location.href = "/";
  }
  if (isServer()) return <></>;
  return (
    <nav className="main-nav w-full flex justify-between items-center">
      <ul className="flex justify-between items-center w-full">
        {isSigned && !window.location.search.includes("embed") ? (<>

          <li>
            <NavLink href="/CreateCertification" id="gransbtnNav">
              <a>
                <Button style={{ background: "none" }}>Create Certificate</Button>
              </a>
            </NavLink>
          </li>
          <li>
            <NavLink href="/ValidateCertification">
              <a>
                <Button style={{ background: "none" }}>Validate Certificate</Button>
              </a>
            </NavLink>
          </li>
        </>) : (<></>)}

        <li className="Nav walletstatus flex flex-1 justify-end">
          <div className="py-2 px-4 flex row items-center" id="withoutSign">
            <NavLink href="/login?[/]">
              <a>
                <Button variant="tertiary">Log in</Button>
              </a>
            </NavLink>
          </div>
          <div
            id="installMetaMask"
            style={{ display: "none" }}
            className="wallets"
          >
            <div className="wallet">
              <Button variant="tertiary" onClick={() => { window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank") }}> Metamask</Button>
            </div>
          </div>

          <div id="withSign" className={`wallets ${(!window.location.search.includes("embed"))?("text-goten"):("")}`} style={{ display: "none" }}>
            <div
              className="wallet"
              style={{ height: 48, display: "flex", alignItems: "center" }}
            >
              <div className="wallet__wrapper gap-4 flex items-center">
                <div className="wallet__info flex flex-col items-end">
                  <a className="text-primary">
                    <div className="font-light">{acc}</div>
                  </a>
                  <div >{Balance}</div>
                </div>
                <Button iconOnly onClick={onClickDisConnect}>
                  <SoftwareLogOut
                    className="text-moon-24"
                    transform="rotate(180)"
                  ></SoftwareLogOut>
                </Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
