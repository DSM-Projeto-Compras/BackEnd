import natural from "natural";
import { preprocess } from "./preprocess.js";

const TfIdf = natural.TfIdf;
export const tfidf = new TfIdf();
let isTrained = false;

export function addDocuments(docs) {
  docs.forEach(doc => tfidf.addDocument(preprocess(doc)));
  isTrained = true;
}

export function vectorize(text) {
  if (!isTrained) throw new Error("Adicione os documentos antes de vetorizar!");

  const vec = [];
  for (let i = 0; i < tfidf.documents.length; i++) {
    vec.push(tfidf.tfidf(preprocess(text), i));
  }
  return vec;
}
