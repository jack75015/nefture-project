import express from "express";
import { ethers } from "ethers";
import { MongoClient, Collection, WithId } from "mongodb";
import contractABI from "./contractABI.json";
import { Nefturian, ResponseMe } from "./types";
import * as dotenv from "dotenv";
import { generateUniqueId, getNefturianMetadata } from "./nefturian";
import { logger } from "./logger";

const app = express();
dotenv.config({ path: __dirname + "/.env" });

const port = process.env.PORT || 3000;
const mongoDbName = process.env.MONGO_DB_NAME || "";
const mongoDbCollectionName = process.env.MONGO_COLLECTION_NAME || "";
const mongoDbUri = process.env.MONGO_URI || "";
const apiMetadata = process.env.API_METADATA || "";

const network = process.env.ETHEREUM_NETWORK || "";
const infuraAPIKey = process.env.INFURA_PROJECT_ID || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

const client = new MongoClient(mongoDbUri);
let nefturianCollection: Collection<Nefturian>;

async function initialize() {
  await client.connect();
  const database = client.db(mongoDbName);
  nefturianCollection = database.collection<Nefturian>(mongoDbCollectionName);

  // Cette partie consiste a listen le contract et a rajouter les nouveaux owners directement en DB pour eviter d'avoir à le faire
  // le jour où ils souhaitent se connecter. Mais j'ai pu le tester car le contract est sur le mainnet
  // const provider = new ethers.InfuraProvider(network, infuraAPIKey);
  // const contract = new ethers.Contract(contractAddress, contractABI, provider);
  // contract.on("Transfer", async (from, to, tokenId) => {
  //   const nefturian = await getOrCreateNefturian(to);
  //   logger.info(
  //     `Nefturian ${nefturian?.nefturianId} associated with ${to} added to database`
  //   );
  // });
}

// Fonction pour obtenir ou créer le Nefturian associé à une adresse Ethereum
async function getOrCreateNefturian(address: string) {
  const nefturianFound: WithId<Nefturian> | null =
    await nefturianCollection.findOne({ address });
  let nefturian: Nefturian;

  if (!nefturianFound) {
    const uniqueId = generateUniqueId(address);
    const nefturianId = parseInt(uniqueId.slice(0, 8), 16) % 1240;
    nefturian = { address, nefturianId };
    await nefturianCollection.insertOne(nefturian);
  } else {
    nefturian = {
      address: nefturianFound.address,
      nefturianId: nefturianFound.nefturianId,
    };
  }
  return nefturian;
}

async function getAllNefturians(): Promise<Nefturian[]> {
  const nefturians = await nefturianCollection.find().toArray();
  return nefturians;
}

app.get("/me", async (req, res) => {
  const address = req.query.address;
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }
  try {
    const nefturian = await getOrCreateNefturian(address);
    const metadata = await getNefturianMetadata(
      nefturian.nefturianId,
      apiMetadata
    );
    if (!metadata) {
      return res.status(500).json({ error: "Failed to fetch metadata API" });
    }
    const result: ResponseMe = {
      nefturian,
      metadata,
    };
    return res.json({ result });
  } catch (err) {
    logger.error(err);
    return res
      .status(500)
      .json({ error: "Failed to get or create Nefturian ID" });
  }
});

// Ces 2 endpoints peuvent servir pour les tests. Le premier renvoit tous les elements de la db
// et le deuxieme permet de faire un clean de la db

// app.get("/nefturians", async (req, res) => {
//   try {
//     const nefturians = await getAllNefturians();
//     return res.json(nefturians);
//   } catch (err) {
//     logger.error(err);
//     return res.status(500).json({ error: "Failed to get Nefturians" });
//   }
// });

// app.get("/delete", async (req, res) => {
//   try {
//     await nefturianCollection.deleteMany({});
//     return res.json("Delete many");
//   } catch (err) {
//     logger.error(err);
//     return res.status(500).json({ error: "Failed to get Nefturians" });
//   }
// });

initialize()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.error("Initialization error:", err);
  });
