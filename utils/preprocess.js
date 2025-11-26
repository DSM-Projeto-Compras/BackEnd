import natural from "natural";
import stopword from "stopword";

export function preprocess(text) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const filtered = stopword.removeStopwords(tokens);
  return filtered.join(" ");
}
