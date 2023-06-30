const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));
const fs = require('fs');

const DATA_FOLDER = './datas';
const FILE_ALL_PROJECTS = DATA_FOLDER + '/projects.json';
const FILE_NAME_DATA = 'data.json';

const ID_DATA_LIGHT = "data";
const OBJ_KEY_LIGHT ={
    "default" : [ "id", "code", "name", "titre" ],
    "fiche" : [ "id", "titre", "description", "isFavoris", "isRemoved" ],
    "dossier" : [ "pages", "subContainer", "isRemoved", "id", "titre" ]
}

//Pour les requetes POST
app.use(express.json())

// All projects ( light version )
var projects;

// All project's datas
var datas = {};


// ========== Gestion des projets ==========

// Lister tous les projets
// resultat :
/*
{
    "projects":{"code":string,"name":string}[]
}
*/
app.get('/', (req,res) => { 
    console.log( "Liste des projets" );

    loadProjectsFiles(); 
    console.log( projects )
    res.status( 200 ).json( projects );
});


// Ajout d'un projet
// Paramètres : 
/*
{
    name : string
    code : string
    // Tous les autres attributs seront sauvegardés
}
*/
// Résultat :
/*
{
    projects : {name : string, code : string}[]
}
*/
app.post( '/newProject', (req,res) => {
    console.log("Creation du pojet " + req.body.name + " (" + req.body.code + ")" );

    loadProjectsFiles();
    // Création du dossier
    
    if( !fs.existsSync( DATA_FOLDER + "/" + req.body.code ) ){
        fs.mkdirSync( DATA_FOLDER + "/" + req.body.code );
    }
    
    // Sauvegarde dans la liste des projets
    projects.projects.push( req.body );
    saveProjectsList();

    // Init des données du projet
    datas[ req.body.code ] = {};

    // Réponse
    res.status( 200 ).json( projects );
});




// ========== Gestion des données ==========


// Get all datas (light version)
// Paramètres (GET):
/*
    idProj : string
    dataType : string
*/
// Résultat :
/*
{ données specifiques }[]
*/
app.get( '/:idProj/:dataType', (req,res) => {

    loadProjectsFiles();

    console.log( "Afficher toutes les données " + req.params.dataType + " du projet " + req.params.idProj );

    let datas = getDatas( req.params.idProj, req.params.dataType );

    if( datas ){
        res.status( 200 ).json( datas[ ID_DATA_LIGHT ] );
    }else{
        res.status( 200 ).json( {} );
    }
});


// liste les datas (light) de la liste donné en paramètre
// Paramètres (GET):
/*
    idProj : string
    dataType : string
*/
// Paramètres (POST):
/*
[
    id datas
]
*/
// Résultat :
/*
{ objet light }[]
*/
app.post( '/:idProj/:dataType', (req,res) => {

    let idProj = req.params.idProj;
    let dataType = req.params.dataType;
    let dataIds = req.body;
    console.log("Affichage des datas " + JSON.stringify( dataIds ) );

    let allDataLight = getData( idProj, dataType, ID_DATA_LIGHT );
    let array = [];
    console.log( " array : " + JSON.stringify(array) );
    if( allDataLight ){
        Object.keys( allDataLight ).forEach( (idObj )=>{
            if( dataIds.indexOf( idObj ) != -1){
                array.push( allDataLight[ idObj ] );
            }
        });
    }

    res.status( 200 ).json( array );
});


// Retourne une donnée en détail
// Paramètres (GET):
/*
    idProj : string
    dataType : string
    idData : string
*/
app.get( '/:idProj/:dataType/:idData', (req,res) => {

    let idProj = req.params.idProj;
    let dataType = req.params.dataType;
    let idData = req.params.idData;

    console.log( "Afficher la donnée " + idData + " de type " + dataType + " du projet " + idProj );

    res.status( 200 ).json( getData( idProj, dataType, idData ) );
});

// Ajout ou mise à jour d'une donnée
// Paramètres (GET):
/*
    idProj : string
    dataType : string
    idData : string
*/
// Paramètres (POST):
/*
{
    datas à sauvegarder
}
*/
app.post( '/:idProj/:dataType/:idData', (req,res) => {

    let idProj = req.params.idProj;
    let dataType = req.params.dataType;
    let idData = req.params.idData;

    console.log("Update data " + idData + " ( projet" + idProj + " data type " + dataType + ")");

    writeData( idProj, dataType, idData, req.body );

    res.status( 200 ).json( getData( idProj, dataType, idData) );
});

app.listen(8080, () => {    
    console.log("Serveur à l'écoute");

    loadProjectsFiles();
});


// Projet
function checkProjectsFolder(){
    if( !fs.existsSync( DATA_FOLDER ) ){
        console.log( "Création du dossier " + DATA_FOLDER );
        fs.mkdirSync( DATA_FOLDER );
    }

    if( !fs.existsSync( FILE_ALL_PROJECTS ) ){
        console.log( "Création du fichier " + FILE_ALL_PROJECTS );
        fs.writeFileSync(  FILE_ALL_PROJECTS, "{\"projects\":[]}" );
        projects = {"projects" : []};
    }

}
function loadProjectsFiles(){
    
    if( !projects ){
        checkProjectsFolder();
        console.log("Chargement des projets");
        projects = JSON.parse( fs.readFileSync( FILE_ALL_PROJECTS ) );
    }
}

function saveProjectsList(){
    checkProjectsFolder();
    fs.writeFileSync(  FILE_ALL_PROJECTS, JSON.stringify( projects ) );
}

function getProjectFolder( idProjet ){
    const path = DATA_FOLDER + "/" + idProjet;
    if( !fs.existsSync( path ) ){
        checkProjectsFolder();
        console.log( "Création du dossier " + path );
        fs.mkdirSync( path );
    }
    return path;
}

// Datas

function getDataFolder( idProjet, dataType ){
    const pathData = getProjectFolder( idProjet ) + "/" + dataType;
    if( !fs.existsSync( pathData ) ){
        console.log( "Création du dossier " + pathData );
        fs.mkdirSync( pathData );
    }
    return pathData;
}

function getAllDataProject( idProjet ){


    if( !datas[ idProjet ] ){
        console.log( "Pas de données pour le projet " + idProjet );
        datas[ idProjet ] = {};
    }

    return datas[ idProjet ];
}

function getDatas( idProjet, dataType ){
    let allDatas = getAllDataProject( idProjet );
    
    if( !allDatas[ dataType ] ){
        console.log( "Chargement des données de type " + dataType + " pour le projet " + idProjet );
        loadDatas( idProjet, dataType );
    }
    
    return allDatas[ dataType ];
}

function loadDatas( idProjet, dataType ){

    if( !datas[ idProjet ][dataType] ){
        datas[ idProjet ][dataType] = {};
    }

    let dataFolder = getDataFolder( idProjet, dataType );
    const pathData = dataFolder + "/" + ID_DATA_LIGHT + ".json";

    if( fs.existsSync( pathData ) ){
        datas[ idProjet ][dataType][ ID_DATA_LIGHT ] = JSON.parse( fs.readFileSync( pathData ) );
    }else{
        console.log( "Aucune donnée de type " + dataType + " n'est enregistrée pour le projet " + idProjet );
        datas[ idProjet ][dataType][ ID_DATA_LIGHT ] = {};
    }
}

function writeData( idProj, dataType, idData, newData ){
    let data = getDatas( idProj, dataType );
    data[ idData ] = newData;
    
    let dataLight = getData( idProj, dataType, ID_DATA_LIGHT );
    dataLight[ idData ] = reduceToLightData( dataType, newData );


    const folder = getDataFolder( idProj, dataType );

    fs.writeFileSync(  folder + "/" + idData + ".json", JSON.stringify( newData ) );
    fs.writeFileSync(  folder + "/" + ID_DATA_LIGHT + ".json", JSON.stringify( dataLight ) );
}

function getData( idProj, dataType, idData ){
    let data = getDatas( idProj, dataType );
    
    if( !data[ idData ] ){
        readData( idProj, dataType, idData );
    }

    return data[ idData ];
}

function readData( idProj, dataType, idData ){
    
    let dataFolder = getDataFolder( idProj, dataType );
    const pathData = dataFolder + "/" + idData + ".json";
    if( fs.existsSync( pathData ) ){
        datas[ idProj ][dataType][ idData ] = JSON.parse( fs.readFileSync( pathData ) );
    }
}

function reduceToLightData( dataType, newData ){
    
    let propToKeep = {};
    if( OBJ_KEY_LIGHT[ dataType ] ){
        propToKeep = OBJ_KEY_LIGHT[ dataType ];
    }else{
        propToKeep = OBJ_KEY_LIGHT[ "default" ];
    }

    let result = {}

    propToKeep.forEach( ( key, i )=>{
      if( newData[ key ] ){
        result[ key ] = newData[ key ];
      }  
    } );

    return result;
}

