import { ethers } from 'ethers';

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask is not installed.');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  return { provider, signer, address, chainId: Number(network.chainId) };
}

export async function switchToPolygonMumbai() {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x13881' }],
  });
}

export async function signAuthMessage(signer, nonce) {
  const message = `Sign in to AIToolHub DAO\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
  return signer.signMessage(message);
}
