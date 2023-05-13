const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));
const fs = require('fs');


const DATA_FOLDER = './datas';
const FICHES_FOLDER = '/fiches';
const DOSSIER_FOLDER = '/dossiers';
const BLOCS_FOLDER = '/blocs';


//Pour les requetes POST
app.use(express.json())

// All projects
var projects;

// Each projects
var project = {};

var fiches = {};
var fichesFull = {};

var dossiers = {};



// Lister tous les projets
app.get('/', (req,res) => { 
    console.log( "Liste des projets" );

    if( projects == undefined ){
        loadProjectsFiles();
    }
    
    console.log( projects )

    res.status( 200 ).json( projects );
});

app.post( '/newProject', (req,res) => {
    console.log("Creation du pojet " + req.body.name + " (" + req.body.code + ")" );

    // Création du dossier
    fs.mkdirSync( DATA_FOLDER + "/" + req.body.code );
    fs.mkdirSync( DATA_FOLDER + "/" + req.body.code + FICHES_FOLDER );
    fs.mkdirSync( DATA_FOLDER + "/" + req.body.code + DOSSIER_FOLDER );
    fs.mkdirSync( DATA_FOLDER + "/" + req.body.code + BLOCS_FOLDER );

    fiches[ req.body.code ] = {};
    fs.writeFileSync( DATA_FOLDER + "/" + req.body.code + FICHES_FOLDER + '/data.json', JSON.stringify( {} ) );
    fs.writeFileSync( DATA_FOLDER + "/" + req.body.code + DOSSIER_FOLDER + '/data.json', JSON.stringify( {} ) );
    fs.writeFileSync( DATA_FOLDER + "/" + req.body.code + BLOCS_FOLDER + '/data.json', JSON.stringify( {} ) );

    // Init des données du projet
    project[ req.body.code ] = req.body;
    // project[ req.body.code ].blocsDependancies = {};
    fs.writeFileSync( DATA_FOLDER + "/"  + req.body.code + '/data.json', JSON.stringify( project[ req.body.code ] ) );

    // Chargement de la liste des projets
    if( !projects ){
        loadProjectsFiles();
    }

    // Sauvegarde dans la liste des projets
    projects.projects.push( { code : req.body.code, name : req.body.name } );
    fs.writeFileSync(  DATA_FOLDER + "/projects.json", JSON.stringify( projects ) );

    // Réponse
    res.status( 200 ).json( projects );
});

// Ajout / Modif page
app.post( '/:idProj/fiche/:idFiche', (req,res) => {

    let idProj = req.params.idProj;
    let idFiche = req.params.idFiche;

    console.log("Update fiche " + idFiche );

    if( !fiches[ idProj ] ){
        loadFichesFile( idProj );
    }

    writeFiche( idProj, idFiche, req.body );

    res.status( 200 ).json( fiches[ idProj ][ idFiche ] );
});

// Get all pages
app.get( '/:idProj/fiche', (req,res) => {

    let idProj = req.params.idProj;
    console.log( "Afficher toutes les fiches du projet " + idProj )
    loadFichesFile( idProj );
    res.status( 200 ).json( fiches[ idProj ] );
});

// Get page
app.get( '/:idProj/fiche/:idFiche', (req,res) => {

    let idProj = req.params.idProj;
    let idFiche = req.params.idFiche;

    console.log( "Afficher la fiche " + idFiche + " du projet " + idProj )

    loadFiche( idProj, idFiche );

    res.status( 200 ).json( fichesFull[ idProj ][ idFiche ] );
});

// Get pages
app.post( '/:idProj/fiche', (req,res) => {

    let idProj = req.params.idProj;
    let fichesId = req.body;

    console.log("Load fiches " + fichesId );

    let array = [];
    for (const idFiche of fichesId) {  
      console.log( 'Fiche : ', idFiche);
      array.push( loadFiche( idProj, idFiche ) )
    }

    res.status( 200 ).json( array );
});

// Ajout / Maj dossier
app.post( '/:idProj/dossier/:idDossier', (req,res) => {

    let idProj = req.params.idProj;
    let idDossier = req.params.idDossier;

    console.log("Update dossier " + idDossier );

    writeFolder( idProj, req.body );

    res.status( 200 ).json( dossiers[ idProj ][ idDossier ] );
});

// Get All Dossiers
app.get( '/:idProj/dossier', (req,res) => {

    let idProj = req.params.idProj;
    console.log( "Afficher toutes les dossiers du projet " + idProj )
    loadFolders( idProj );
    res.status( 200 ).json( dossiers[ idProj ] );
});


app.listen(8080, () => {    
    console.log("Serveur à l'écoute");

    loadProjectsFiles();
});


function loadProjectsFiles(){
    console.log("Chargement des projets");
    projects = JSON.parse( fs.readFileSync( DATA_FOLDER + '/projects.json' ) );
}

function loadFichesFile( idProjet ){
    console.log("Chargement des fiches du projet " + idProjet );
    let path = DATA_FOLDER + '/' + idProjet + FICHES_FOLDER + "/data.json";
    fiches[ idProjet ] = JSON.parse( fs.readFileSync( path ) );
    
    if( !fichesFull[ idProjet ] ){
        fichesFull[ idProjet ] = {};
    }
}

function saveFichesFile( idProjet ){
    console.log("Sauvegarde des fiches du projet " + idProjet );
    let path = DATA_FOLDER + '/' + idProjet + FICHES_FOLDER + "/data.json";
    fs.writeFileSync(  path, JSON.stringify( fiches[ idProjet ] ) );
    
}

function writeFiche( idProjet, idFiche, data ){

    console.log( "writeFiche( ", idProjet, ", ", idFiche, ", ", data );

    if( !fiches[idProjet] ){
        loadFichesFile( idProjet );
    }

    if( !fiches[idProjet][idFiche] || fiches[idProjet][idFiche].titre != data.titre ){
        console.log( "Creation de la fiche ", data );
        fiches[ idProjet ][ idFiche ] = { id : data.id, titre : data.titre };
        saveFichesFile( idProjet );
    }

    if( !fichesFull[ idProjet ] ){
        fichesFull[ idProjet ] = {};
    }

    fichesFull[ idProjet ][ idFiche ] = data;

    let path = DATA_FOLDER + "/" + idProjet + FICHES_FOLDER + "/" + idFiche + ".json";
    console.log( "Write fiche dans ", path, data );
    fs.writeFileSync(  path, JSON.stringify( data ) );
}

function loadFiche( idProjet, idFiche ){
    
    if( !fiches[idProjet] ){
        loadFichesFile( idProjet );
    }

    try{
        if( !fichesFull[idProjet][idFiche] ){
            let path = DATA_FOLDER + "/" + idProjet + FICHES_FOLDER + "/" + idFiche + ".json";
            fichesFull[idProjet][idFiche] = JSON.parse( fs.readFileSync( path ) );
        }
    }catch( e ){
        console.error( "File ", idFiche, " not exists" )
    }
    

    return fichesFull[idProjet][idFiche];
}

function loadFolders( idProjet ){
    console.log("Chargement des dossiers du projet " + idProjet );

    if( !dossiers[ idProjet ] ){
        let path = DATA_FOLDER + "/" + idProjet + DOSSIER_FOLDER + "/data.json";
        dossiers[ idProjet ] = JSON.parse( fs.readFileSync( path ) );
    }

    return dossiers[ idProjet ];
}

function writeFolder( idProjet, dossier ){
    
    if( !dossiers[ idProjet ] ){
        loadFolders( idProjet );
    }

    dossiers[ idProjet ][ dossier.id ] = dossier;


    let path = DATA_FOLDER + "/" + idProjet + DOSSIER_FOLDER + "/data.json";
    fs.writeFileSync(  path, JSON.stringify( dossiers[ idProjet ] ) );
}
