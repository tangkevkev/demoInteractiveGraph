import { Injectable } from '@angular/core';
import { GraphServiceJson, InteractiveGraph } from './logic/index'

@Injectable({
  providedIn: 'root'
})
export class InteractiveGraphService {

  constructor() { }


  saveGraphEinfachInformatik(graph: InteractiveGraph, json: any) {
    GraphServiceJson.exportGraph(graph, json);
  }

  loadGraphEinfachInformatik(graph: InteractiveGraph, json: any) {
    GraphServiceJson.importGraph(graph, json);
  }


  translate(word: string, language?: string): string {
    switch (word) {
      case "node":
        switch (language) {
          case "de": return "Knoten"
          case "fr": return "Nœud"
          case "en": return "Node"
          default: return "Node"
        }
      case "edge":
        switch (language) {
          case "de": return "Kante"
          case "fr": return "Lien"
          case "en": return "Edge"
          default: return "Edge"
        }
      case "move":
        switch (language) {
          case "de": return "Verschieben"
          case "fr": return "Bouger"
          case "en": return "Move"
          default: return "Move"
        }
      case "delete":
        switch (language) {
          case "de": return "Löschen"
          case "fr": return "Supprimer"
          case "en": return "Delete"
          default: return "Delete"
        }

      case "undo":
        switch (language) {
          case "de": return "Schritt zurück"
          case "fr": return "Un pas en arrière"
          case "en": return "Undo"
          default: return "Undo"
        }

      case "change":
        switch (language) {
          case "de": return "Ändern"
          case "fr": return "Changer"
          case "en": return "Change"
          default: return "Change"
        }
      case "unit":
        switch (language) {
          case "de": return "Einheit"
          case "fr": return "Unité"
          case "en": return "Unit"
          default: return "Unit"
        }
      case "chooseStart":
        switch (language) {
          case "de": return "Startknoten wählen"
          case "fr": return "Nœud de départ"
          case "en": return "Starting node"
          default: return "Starting node"
        }
      case "chooseTarget":
        switch (language) {
          case "de": return "Zielknoten wählen"
          case "fr": return "Nœud de arrivée"
          case "en": return "Targeting node"
          default: return "Starting node"
        }
      case "value":
        switch (language) {
          case "de": return "Wert"
          case "fr": return "Valeur"
          case "en": return "Value"
          default: return "Value"
        }
      case "selectLanguage":
        switch (language) {
          case "de": return "Sprache wählen"
          case "fr": return "Choisir la langue"
          case "en": return "Select language"
          default: return "Select language"
        }
      case "selectGraphType":
        switch (language) {
          case "de": return "Graphtyp wählen"
          case "fr": return "Choisir le modèle du graphe"
          case "en": return "Choose the graph type"
          default: return "Choose the graph type"
        }
      case "directedWeightedGraph":
        switch (language) {
          case "de": return "Gerichteter gewichteter Graph"
          case "fr": return "Graphe orienté pondéré "
          case "en": return "Directed weighted Graph"
          default: return "Directed weighted Graph"
        }
      case "undirectedWeightedGraph":
        switch (language) {
          case "de": return "Ungerichteter gewichteter Graph"
          case "fr": return "Graphe non-orienté pondéré "
          case "en": return "Undirected weighted Graph"
          default: return "Undirected weighted Graph"
        }
      case "directedGraph":
        switch (language) {
          case "de": return "Gerichteter Graph"
          case "fr": return "Graphe orienté"
          case "en": return "Directed Graph"
          default: return "Directed Graph"
        }
      case "undirectedGraph":
        switch (language) {
          case "de": return "Ungerichteter Graph"
          case "fr": return "Graphe non-orienté"
          case "en": return "Undirected Graph"
          default: return "Undirected Graph"
        }

      case "randomGraph":
        switch (language) {
          case "de": return "Zufälliger Graph"
          case "fr": return "Graphe aléatoire"
          case "en": return "Random graph"
          default: return "Random graph"
        }


      case "reset":
        return "Reset";
      default:
        return word;
    }
  }




}
