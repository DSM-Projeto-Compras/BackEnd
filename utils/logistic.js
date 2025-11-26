// Importa a classe Matrix da biblioteca 'ml-matrix'
import { Matrix } from "ml-matrix";

// Importa a classe LogisticRegression da biblioteca 'ml-logistic-regression'
import LogisticRegression from "ml-logistic-regression";

let logreg = null;  // Variável global para armazenar o modelo treinado

// Função para treinar o modelo de regressão logística
export function train(X_array, y_array) {
  const X = new Matrix(X_array);
  const Y = Matrix.columnVector(y_array);

  logreg = new LogisticRegression({ numSteps: 1000, learningRate: 5e-3 });

  logreg.train(X, Y);

  return logreg;
}

// Função para fazer previsões com o modelo treinado
export function predict(X_array_new) {
  if (!logreg) throw new Error("Modelo não treinado!");

  let X_new;

  if (!Array.isArray(X_array_new[0])) {
    X_new = new Matrix([X_array_new]);
  } else {
    X_new = new Matrix(X_array_new);
  }

  return logreg.predict(X_new);
}
