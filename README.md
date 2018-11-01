# The Real Donald Trump

## Sommaire
- [Description du projet](#description-du-projet)
- [Démonstration](#démonstration)
- [Code](#code)
    - [Architecture](#architecture)
    - [Convention](#convention)
    - [Outils](#outils)
- [Installation du projet](#installation-du-projet)
    - [Téléchargement](#téléchargement)
    - [Installation du serveur Node](#installation-et-lancement-du-serveur-node)
    - [Installation des applications](#installation-des-applications)
    - [Lancement](#lancement)
- [TO DO](#to-do)

## Description du projet
**The Real Donald Trump** est un projet WebGL réalisé dans le cadre de la formation *Design et management de l'innovation interactive* de l'école des Gobelins.

On incarne un agent secret dont le but est d'infiltrer le réseau informatique d'un bâtiment où a lieu une rencontre entre Donald Trump et Vladimir Poutine.

Grâce à notre smartphone, nous pouvons contrôler les différentes caméras de surveillance dans la pièce. L'objectif est de récolter 6 enveloppes dissimulées dans la pièce avant que nous soyons repérés. Une fois les 6 enveloppes récoltées, nous pouvons appeler un numéro de téléphone caché pour passer un coup de fil à Trump.

## Démonstration
[https://trump.vincentriva.fr](https://trump.vincentriva.fr)

## Code

### Architecture
Le projet est divisé en 3 sous-projets, un pour le site de bureau, un pour le site mobile et le dernier est le serveur qui relie les deux.

### Convention
Nous avons choisi d'utiliser [Typescript](https://www.typescriptlang.org/) afin de pouvoir typer nos variables et méthodes. Egalement, nous utilisons [Eslint](https://eslint.org/) avec la [configuration utilisée par Airbnb](https://github.com/airbnb/javascript) pour un code homogène.

### Outils
Nos projets utilisent [Webpack](https://webpack.js.org/) pour compiler notre code en temps réel lors de la phase de développement, et pour le minifier pour le déploiement.

## Installation du projet

Pour installer le projet, une version récente de [NodeJS](https://nodejs.org/en/) est nécessaire. Nous recommandons au moins la version 10.12.0.

### Téléchargement
#### Par Git

```
git clone https://github.com/Treast/webgl-trump.git
```

#### Manuellement
Télécharger la branche `master` [ici](https://github.com/Treast/webgl-trump/archive/master.zip).

### Installation et lancement du serveur Node
- Ouvrer un terminal dans le dossier *TrumpRussiaServer*
- Installer les dépendances : 
`npm install`
- Lancer le serveur Node :
`node app.js`


### Installation des applications
**Les prochaines manipulations sont à effectuer à l'intérieur des dossiers *"TrumpRussiaDesktopApp"* et *"TrumpRussiaMobileApp"* téléchargés précédemment.**

- Installer les dépendances NPM
`npm install`
- Renommer le fichier `.env.example` en `.env` et changer l'adresse IP présente par la vôtre. *(Pour connaître votre adresse IP, ouvrez un terminal et tapez `ifconfig /all` sous Windows ou bien `ipconfig` sous Unix/MacOS)*
- **Attention ! Il faut ouvrir le port 9001 de votre ordinateur pour y avoir accès depuis le téléphone.**

### Lancement
#### En mode développement
- Ouvrir un terminal dans le dossier, et lancer le serveur Webpack :
`npm run dev`
- Une fenêtre de navigateur devrait s'ouvrir avec l'URL du projet. *(Si jamais cela n'arrive pas, ouvrez vous-même votre navigateur et aller sur [http://0.0.0.0:9001](http://0.0.0.0:9001))*
#### En mode production
- Ouvrir un terminal dans le dossier, et lancer la compilation des assets avec Webpack :
`npm run build`
- Les fichiers compilés se trouvent dans le dossier `dist`.


## TO DO
*Voir également le Trello.*

 - [x] Création du projet
 - [x] Intégration de la scène
 - [x] Création du serveur Node
 - [x] Gestion des caméras
 - [x] Gestion du timer
 - [x] Gestion des enveloppes
 - [x] Sélection des enveloppes
 - [x] Intégration des maquettes Desktop
 - [x] Intégration des maquettes Mobile
 - [x] Rotation de la caméra selon l'orientation du mobile
 - [x] Effets visuels sur la caméra
 - [ ] Lecture des enveloppes
 - [ ] Interface clavier de téléphone
 - [ ] Appel téléphonique
