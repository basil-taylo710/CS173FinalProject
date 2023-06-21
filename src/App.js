import { useState, useEffect } from "react";

import Homepage from "./components/Homepage";
import { addBalanceOwnerOperation, addBalanceCounterpartyOperation, claimOwnerOperation, claimCounterpartyOperation, revertFundOperation } from "./utils/operation";
import { fetchStorage } from "./utils/tzkt";

const App = () => {
  
  return (
    <div className="h-100">
      <Homepage/>
      
    </div>
    
  );
};

export default App;
