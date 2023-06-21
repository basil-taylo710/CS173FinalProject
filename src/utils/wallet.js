import { BeaconWallet } from "@taquito/beacon-wallet";

export const wallet = new BeaconWallet({
    name: "Tezos  Dapp",
    preferredNetwork: "ghostnet"
})

export const connectWallet = async () => {
    await wallet.requestPermissions({network: {type: "ghostnet"}});
};


export const getAccount = async () => {
    const connectWallet = await wallet.client.getActiveAccount();
    if(connectWallet){
        return connectWallet.address;
    }
    else{
        return "";
    }
};
