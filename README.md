# Redacteur
Ce projet permet d'assister un auteur lors de la création d'une histoire. Pour cela le programme est divisé en 4 parties :
* Encyclopédie
* Axes
* Structure
* Rédaction

## Installation

### Serveur
Un serveur simple est fournit dans le dossier `Serveur/`
Avant de l'utliser, assurez vous que NodeJs est installé sur votre PC. Si ce n'est pas le cas, vous pouvez le télécharger [ici](https://nodejs.org/en)

Pour l'executer, récupérer les dépendances avec `npm install`
Puis lancer le serveur à l'aide de la commande `node serveur.js`

### Client
Dans un premier temps, il est nécessaire de récupérer les dépendances avec la commande `npm install`
Pour lancer le client, executer la commande `npm start`

## Fonctionnement

Lorsque le client et un serveur sont lancés, ouvrir le navigateur à l'adresse [localhost:4200](http://localhost:4200/)
Vous arriverez alors sur l'écran de sélection des projets. Chaque projet s'affiche dans un cercle contenant le première lettre de son nom.
L'affichage s'adapte au nombre du projet existant. 
Cliquer sur un projet pour l'ouvrir. L'IHM est alors divisée en 4 parties : Encyclopédie, les Axes, la Structure et la Rédaction.

### Création d'un projet
Avant de pouvoir utiliser l'application, vous devez créer un projet. pour cela, rendez-vous sur l'écran d'accueil. pour créer un projet, cliquer sur le **+** au centre de l'écran, et renseigner un nom.
Un cercle apparait alors, contenant la première lettre du nom du projet. Cliquer sur le cercle pur ouvrir le projet.

### Encyclopédie
Cette fonctionnalité permet de compiler le lore de votre univers sous forme de fiche. Chaque fiche est constituée d'un titre, d'une description, d'un identifiant et d'un ensemble de rublique.
Les informations à afficher étant différente en fonction du sujet de la fiche (personnage, lieux, évenement, objet, ...), il n'y a pas de rublique prédéfinie. Vous pouvez ajouter des rubriques en fonction de vos besoins.

Lors de la rédaction de la fiche, il est possible de faire référence à une autre fiche. Pour cela, au milieux du texte, vous pouvez ajouter le caractère **@** suivi de l'identifiant de la fiche. Une liste apparaitra, vous proposant les fiches disponibles. Lorsque vous validerez le texte, l'identifiant sera remplacé par son nom. Au survol de la sourie, une bulle apparaitra, affichant le contenu du la déscription de la fiche.

Si vous souhaitez mettre en forme votre texte, le format **Markdown** est supporté. Un rappelle de fonctionnalités basiques proposé par ce format est disponible sur le bouton **?** lorsque vous modifiez une rubrique.

### Axes
Fonction non implémentée

### Structure
Fonction non implémentée

### Rédaction
Fonction non implémentée

## Corrections à venir
[Le lien vers la backlog se trouve ici](https://github.com/AllanRENOU/Redacteur/blob/main/TODO.md)

