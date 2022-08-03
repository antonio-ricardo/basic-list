import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3333;

app.use(bodyParser.json());

interface Request<T> {
  body: T;
}

interface Add {
  name: string;
  timeout: number;
}

const queue: Add[] = [];

app.post("/add", (req: Request<Add>, res) => {
  queue.push({ name: req.body.name, timeout: req.body.timeout * 1000 });

  res.json({ message: "adicionado com sucesso" });
});

app.get("/show", (req, res) => {
  res.json({ fila: queue });
});

app.listen(port, () => {
  listenQueue();
  console.log(`rodando na porta ${port}`);
});

const listenQueue = (): void => {
  if (queue.length > 0) {
    const processToAnalyse = queue[0];
    console.log(`analisando processo de nome - ${processToAnalyse.name}`);
    setTimeout(() => {
      console.log(
        `processo de nome - ${processToAnalyse.name} foi analisado e será removido da fila`
      );
      queue.splice(0, 1);
      console.log("--------------------------------------------------");
      console.log("--- checando se ainda existe processos na fila ---");
      console.log("--------------------------------------------------");
      listenQueue();
    }, processToAnalyse.timeout);
  } else {
    console.log(
      "não tem processos na fila no momento, aguardarei por 10 segundos"
    );

    setTimeout(() => listenQueue(), 10000);
  }
};
