import React, { useState, useEffect } from 'react';
import { getOwnedTokens, burnToken } from './api';
import { Link } from 'react-router-dom';
import { getTokenList } from './api';
import axios from 'axios';
import './Homepage.css';
import { connectWallet, getAccount } from "../utils/wallet";

const MintPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    lot_id: '',
    owner_title: '',
    description: '',
    image_url: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 
      const response = await axios.post('your-api-url', formData); // Replace with your API endpoint to handle minting
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      setError('Error occurred: ' + error.message);
    }
  };

  return (
    <div className="mint-popup">
      <div className="popup-header">
        <h1 className="transfer-page-title">MINT NFT</h1>
        <button className="close-button" onClick={onClose}>
          x
        </button>
      </div>
      <div className="transfer-page-container">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-field">
            <label htmlFor="lot_id" className="form-label">
              Lot ID:   
            </label>
            <input
              type="text"
              id="lot_id"
              name="lot_id"
              value={formData.lot_id}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="owner_title" className="form-label">
              Owner Title:
            </label>
            <input
              type="text"
              id="owner_title"
              name="owner_title"
              value={formData.owner_title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="image_url" className="form-label">
              Image URL:
            </label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="transfer-button">
            Mint
          </button>
        </form>
      </div>
    </div>
  );
};

const TransferPopup = ({ onClose }) => {
  const [ownedTokens, setOwnedTokens] = useState([]); // State to hold the list of owned tokens
  const [destination, setDestination] = useState('');
  const [tokenID, setTokenID] = useState('');

  useEffect(() => {
    fetchOwnedTokens();
  }, []);

  // Function to fetch the list of owned tokens
  const fetchOwnedTokens = () => {
    // Call your API function to fetch the token list
    getTokenList()
      .then((response) => {
        setOwnedTokens(response.data);
      })
      .catch((error) => {
        console.log('Error fetching owned tokens:', error);
      });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform the transfer logic here, e.g., call an API endpoint
    // with the destination and token ID values

    // Reset the form fields
    setDestination('');
    setTokenID('');
  };

  return (
    <div className="transfer-popup">
      <div className="popup-header">
        <h1 className="transfer-page-title">TRANSFER NFT</h1>
        <button className="close-button" onClick={onClose}>
          x
        </button>
      </div>
      <div className="transfer-page-container">
        <h2 className="form-heading">My Tokens</h2>
        {ownedTokens.length > 0 ? (
          <table className="owned-tokens-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {ownedTokens.map((token) => (
                <tr key={token.tokenID}>
                  <td>{token.tokenID}</td>
                  <td>{token.metadata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tokens owned.</p>
        )}
      </div>

      {/* Transfer Form */}
      <div className="transfer-page-container">
        <h2 className="form-heading">Transfer Token</h2>
        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-field">
            <label htmlFor="destination" className="form-label">
              Destination:
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="tokenID" className="form-label">
              Token ID:
            </label>
            <input
              type="text"
              id="tokenID"
              value={tokenID}
              onChange={(event) => setTokenID(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="transfer-button">Transfer</button>
        </form>
      </div>
    </div>
  );
};

const BurnPopup = ({ onClose }) => {
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [tokenID, setTokenID] = useState('');

  useEffect(() => {
    fetchOwnedTokens();
  }, []);

  const fetchOwnedTokens = () => {
    getOwnedTokens()
      .then((response) => {
        setOwnedTokens(response.data);
      })
      .catch((error) => {
        console.log('Error fetching owned tokens:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    burnToken(tokenID)
      .then(() => {
        fetchOwnedTokens();
        setTokenID('');
      })
      .catch((error) => {
        console.log('Error burning token:', error);
      });
  };

  return (
    <div className="burn-popup">
            <div className="popup-header">
        <h1 className="transfer-page-title">BURN NFT</h1>
        <button className="close-button" onClick={onClose}>
          x
        </button>
      </div>
      <div className="transfer-page-container">
        <div className="owned-tokens-container">
          <h2 className="form-heading">My Tokens</h2>
          {ownedTokens.length > 0 ? (
            <table className="owned-tokens-table">
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {ownedTokens.map((token) => (
                  <tr key={token.tokenID}>
                    <td>{token.tokenID}</td>
                    <td>{token.metadata}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tokens owned.</p>
          )}
        </div>
        <div className="transfer-form-container">
          <h2 className="form-heading">Burn Token</h2>
          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-field">
              <label htmlFor="tokenID" className="form-label">
                Token ID:
              </label>
              <input
                type="text"
                id="tokenID"
                value={tokenID}
                onChange={(event) => setTokenID(event.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="transfer-button">Burn</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMintPopupOpen, setIsMintPopupOpen] = useState(false);
  const [isTransferPopupOpen, setTransferPopupOpen] = useState(false);
  const [isBurnPopupOpen, setIsBurnPopupOpen] = useState(false);
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);

  const handleMintPopupToggle = () => {
    setIsMintPopupOpen(!isMintPopupOpen);
  };

  const handleTransferPopupToggle = () => {
    setTransferPopupOpen(!isTransferPopupOpen);
  };

  const handleBurnPopupToggle = () => {
    setIsBurnPopupOpen(!isBurnPopupOpen);
  };

  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccount();
    setAccount(account);
  };

  const landLots = [
    { id: 1, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 2, image: 'https://wallpapers.com/images/hd/white-full-screen-with-stripes-k6sqdizwumrl3y8h.jpg' },
    { id: 3, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 4, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 5, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 6, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 7, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 8, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 9, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 10, image: 'https://static.displate.com/857x1200/displate/2021-09-28/8bca6cff2358ae58c211ab0eb59397b9_16bd59d22032d9a9ab2829465c54e644.jpg' },
    { id: 11, image: 'https://w0.peakpx.com/wallpaper/878/518/HD-wallpaper-tokito-muichiro-anime-anime-thumbnail.jpg' },
    { id: 12, image: 'https://w.forfun.com/fetch/ed/edb27dd8428cb1a435e72b7fcae344d0.jpeg' },
    { id: 13, image: 'https://e0.pxfuel.com/wallpapers/30/717/desktop-wallpaper-akaza-kimetsu-no-yaiba-edits-animes-artes-thumbnail.jpg' },
    { id: 14, image: 'https://w0.peakpx.com/wallpaper/500/176/HD-wallpaper-genya-shinazugawa-kimetsu-no-yaiba.jpg' },
    { id: 15, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 16, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 17, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg' },
    { id: 18, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 19, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 20, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 21, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 22, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 23, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 24, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 25, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 26, image: 'https://wallpapers.com/images/hd/white-full-screen-with-stripes-k6sqdizwumrl3y8h.jpg'},
    { id: 27, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 28, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 29, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 30, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 31, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 32, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 33, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 34, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 35, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 36, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 37, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 38, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 39, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 40, image: 'https://static.displate.com/857x1200/displate/2021-09-28/8bca6cff2358ae58c211ab0eb59397b9_16bd59d22032d9a9ab2829465c54e644.jpg' },
    { id: 41, image: 'https://w0.peakpx.com/wallpaper/878/518/HD-wallpaper-tokito-muichiro-anime-anime-thumbnail.jpg' },
    { id: 42, image: 'https://w.forfun.com/fetch/ed/edb27dd8428cb1a435e72b7fcae344d0.jpeg' },
    { id: 43, image: 'https://e0.pxfuel.com/wallpapers/30/717/desktop-wallpaper-akaza-kimetsu-no-yaiba-edits-animes-artes-thumbnail.jpg' },
    { id: 44, image: 'https://w0.peakpx.com/wallpaper/500/176/HD-wallpaper-genya-shinazugawa-kimetsu-no-yaiba.jpg' },
    { id: 45, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 46, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 47, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg' },
    { id: 48, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 49, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 50, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 51, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 52, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 53, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 54, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 55, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 56, image: 'https://wallpapers.com/images/hd/white-full-screen-with-stripes-k6sqdizwumrl3y8h.jpg'},
    { id: 57, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 58, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 59, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 60, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 61, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 62, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 63, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 64, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 65, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 66, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 67, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 68, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 69, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 70, image: 'https://static.displate.com/857x1200/displate/2021-09-28/8bca6cff2358ae58c211ab0eb59397b9_16bd59d22032d9a9ab2829465c54e644.jpg' },
    { id: 71, image: 'https://w0.peakpx.com/wallpaper/878/518/HD-wallpaper-tokito-muichiro-anime-anime-thumbnail.jpg' },
    { id: 72, image: 'https://w.forfun.com/fetch/ed/edb27dd8428cb1a435e72b7fcae344d0.jpeg' },
    { id: 73, image: 'https://e0.pxfuel.com/wallpapers/30/717/desktop-wallpaper-akaza-kimetsu-no-yaiba-edits-animes-artes-thumbnail.jpg' },
    { id: 74, image: 'https://w0.peakpx.com/wallpaper/500/176/HD-wallpaper-genya-shinazugawa-kimetsu-no-yaiba.jpg' },
    { id: 75, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 76, image: 'https://e1.pxfuel.com/desktop-wallpaper/838/403/desktop-wallpaper-hotaru-haganezuka-thumbnail.jpg' },
    { id: 77, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg' },
    { id: 78, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 79, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 80, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 81, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 82, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 83, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 84, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 85, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 86, image: 'https://wallpapers.com/images/hd/white-full-screen-with-stripes-k6sqdizwumrl3y8h.jpg'},
    { id: 87, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 88, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 89, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 90, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 91, image: 'https://e0.pxfuel.com/wallpapers/460/541/desktop-wallpaper-tanjiro-fire-mode.jpg'},
    { id: 92, image: 'https://wallpapers.com/images/featured/3tg32q5lcq0aaljj.jpg' },
    { id: 93, image: 'https://wallpapercrafter.com/desktop/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg' },
    { id: 94, image: 'https://e1.pxfuel.com/desktop-wallpaper/466/936/desktop-wallpaper-kyojuro-rengoku-by-akhileshy10-rengoku-vs-akaza-thumbnail.jpg' },
    { id: 95, image: 'https://images2.alphacoders.com/121/1217745.png' },
    { id: 96, image: 'https://wallpapercrafter.com/desktop/358802-Anime-Demon-Slayer-Kimetsu-no-Yaiba-Phone-Wallpaper.jpg' },
    { id: 97, image: 'https://cdn.wallpapersafari.com/29/82/zZYmkM.png' },
    { id: 98, image: 'https://wallpapercave.com/wp/wp4934603.jpg' },
    { id: 99, image: 'https://rare-gallery.com/uploads/posts/327591-Sanemi-Shinazugawa-Kimetsu-no-Yaiba-4K-iphone-wallpaper.jpg' },
    { id: 100, image: 'https://static.displate.com/857x1200/displate/2021-09-28/8bca6cff2358ae58c211ab0eb59397b9_16bd59d22032d9a9ab2829465c54e644.jpg' },
  ];

  return (
    <div className="homepage"> 
    
      {/* <button className="menu-button" onClick={handleMenuToggle}>
        Menu
      </button> */}
      <div className={`menu-panel ${isMenuOpen ? 'open' : ''}`}>
        <h2 className="tab-title">LAND DEEDS</h2>
        <hr className="menu-divider" /> {/* Horizontal line */}
        <button className="menu-link" onClick={handleMintPopupToggle}>
          Mint
        </button>
        <button className="menu-link" onClick={handleTransferPopupToggle}>
          Transfer
        </button>
        <button className="menu-link" onClick={handleBurnPopupToggle}>
          Burn
        </button> 
      </div>

      <div className="container py-4">
        <h1 class="project-title"></h1>
          <button  onClick={onConnectWallet} className="btn btn-outline-info" >
            { account ? account : "CONNECT WALLET"}
          </button>
      </div>

      <div className="land-lots-container">
        {landLots.map((landLot) => (
          <div className="land-lot-wrapper" key={landLot.id}>
            <div className="land-lot-image-crop">
              <img
                src={landLot.image}
                alt={`Land Lot ${landLot.id}`}
                className="land-lot-image"
              />
            </div>
          </div>
        ))}
      </div>  


      {isMintPopupOpen && <MintPopup onClose={handleMintPopupToggle} />}
      {isTransferPopupOpen && <TransferPopup onClose={handleTransferPopupToggle} />}
      {isBurnPopupOpen && <BurnPopup onClose={handleBurnPopupToggle} />}
    </div>

  );
};

export default Homepage;
