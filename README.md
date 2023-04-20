# Nefturian Hero - JACQUES WEBER

Exercise statement: https://nefture.notion.site/Coding-Exercise-Find-your-Nefturian-Hero-7fd5ff1d4708456abfea8c36cbcd41db

Cet exercice était demandé sur 2H. J'ai pu faire la partie back fonctionelle mais je n'ai pas pu commencer la partie front. Je vais donc ici expliquer ce que j'ai pu faire pendant le temps imparti.
La première partie de l'exercice est la suivante:

`Your first mission is to find an innovative solution to link deterministically any creature to a unique Nefturian. Any address should have an equal probability to be associated to any of the 1240 Nefturians.`

La stratégie que j'ai utilisée est la suivante:

- Générez un identifiant unique pour chaque adresse Ethereum dans la base de données (via sha256).
- Utiliser un algorithme de sélection pseudo-aléatoire pour associer le hachage d'une adresse à un id de Nefturian

Du coup, quand le back reçoit une quête avec dedans une address ETH, celui-ci va soit généré le couple address/nefturianId après avoir vérifié que celuici n'était pas déjà présent dans la base de données.
Nous allons ensuite récupérer les metadata via le endpoint d'API fourni, rajouter une propriété pour indiquer si les attributes du Nefturian ont été révelé (cas du Nefturian loup solitaire), puis renvoyer le tout.

## Améliorations

La partie Front n'étant pas faite, voici comment j'aurais imaginé la chose avec un rapide schéma:

Une première version aurait une barre de recherche. L'utilisateur rentre une address ETH valide et peut ensuite voir sur l'interface les informations renvoyées par le backend.

Une deuxieme version plus secure consisterait à avoir un bouton connect et d'avoir une authentification via metamask ou walletConnect pour que seul le owner d'une address puisse savoir le Nefturian associé à son adresse. Cette seconde version entrainera des modification coté backend également.

## Tech

Serveur NodeJS classique + express
Axios pour les requetes API
MongoDB pour la base de donnée

## Installation

#### Database

Installer Docker [ici](https://docs.docker.com/engine/install/)

```sh
docker pull mongo:latest
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Serveur NodeJS

Cloner ce project git
Install the dependencies and devDependencies and start the server.

```sh
cd nefture-project
npm install
```

Copier/coller le fichier `.example.env` en `.env` et remplir les informations manquantes (INFURA_PROJECT_ID n'étant pas obligatoire).

```sh
npm run start:dev
```

#### Test postman

Installer Postman [ici](https://www.postman.com/)

Faire un query Get sur `http://localhost:3000/me?address=0x721B12044A23835E8EaF10f3c01DcAd8878b6C4A`

Response:

```json
{
  "result": {
    "nefturian": {
      "address": "0x721B12044A23835E8EaF10f3c01DcAd8878b6C4A",
      "nefturianId": 527
    },
    "metadata": {
      "metadata": {
        "name": "ArticWinds - Nefturian #527",
        "image": "http://api.nefturians.io/nefturians/images/527",
        "description": "Nefturians - NFT Collection of 3D assets, Netaverse ready. By Nefture.",
        "attributes": [
          {
            "trait_type": "Location",
            "value": "Grey Halo"
          },
          {
            "trait_type": "Head",
            "value": "Ice Spotter"
          },
          {
            "trait_type": "Shoulders",
            "value": "U-19"
          },
          {
            "trait_type": "Armor",
            "value": "White Naver"
          },
          {
            "trait_type": "N-Color",
            "value": "X-R8 Turquoise"
          },
          {
            "trait_type": "View",
            "value": "sideways"
          },
          {
            "trait_type": "Weapon",
            "value": "White Wings"
          },
          {
            "trait_type": "Clan",
            "value": "Cyberian"
          },
          {
            "trait_type": "Eyes",
            "value": "White"
          },
          {
            "trait_type": "Dexterity",
            "display_type": "boost_number",
            "value": "4"
          },
          {
            "trait_type": "Constitution",
            "display_type": "boost_number",
            "value": "6"
          },
          {
            "trait_type": "Perception",
            "display_type": "boost_number",
            "value": "6"
          },
          {
            "trait_type": "Charisma",
            "display_type": "boost_number",
            "value": "7"
          },
          {
            "trait_type": "Agility",
            "display_type": "boost_number",
            "value": "2"
          },
          {
            "trait_type": "Intelligence",
            "display_type": "boost_number",
            "value": "4"
          },
          {
            "trait_type": "Strength",
            "display_type": "boost_number",
            "value": "4"
          }
        ]
      },
      "isRevealed": true
    }
  }
}
```

Ce micro projet m'a bien plus et je l'ai fait avec plaisir.
Je reste disponible par mail et par téléphone pour toutes demandes/explications et attend votre retour pour un entretien physique.
