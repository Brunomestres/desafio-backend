const { v4 } = require("uuid");
const punters = [];
const raffles = [];

exports.createPunter = (req, res) => {
  const { nome, saldo } = req.body;
  let punter = {
    id: 1,
    nome,
    saldo,
  };
  punters.push(punter);
  return res.json({
    mensagem: "Apostador registrado com sucesso",
    status: "sucesso",
    apostador: punter,
  });
};

exports.createRaffle = (req, res) => {
  let raffle = {
    id: 1,
    premio: 0,
    aberto: true,
    apostadores: [],
  };
  raffles.push(raffle);

  return res.json({
    mensagem: "Sorteio criado com sucesso",
    status: "sucesso",
    sorteio: raffle,
  });
};

exports.raffleLogin = (req, res) => {
  const { apostador, sorteio, aposta } = req.body;

  const apostadorFind = punters.find((item) => item.id === apostador);

  if (!apostadorFind) {
    return res.status(404).json({ message: "Apostador não encontrado!" });
  }

  if (apostadorFind.saldo < aposta) {
    return res.status(400).json({ message: "Saldo insuficiente!" });
  }
  const sorteioFind = raffles.find((item) => item.id === sorteio);

  if (!sorteioFind) {
    return res.status(404).json({ message: "Sorteio não encontrado!" });
  }

  if (!sorteioFind.aberto) {
    return res.json({ message: "Este sorteio já foi realizado!" });
  }

  sorteioFind.premio += aposta;
  sorteioFind.apostadores.push(apostadorFind);

  console.log(sorteioFind);
  return res.json({
    mensagem: "Aposta realizada com sucesso",
    status: "sucesso",
    aposta: {
      valor: aposta,
      sorteio,
      apostador: apostadorFind,
    },
  });
};

exports.draw = (req, res) => {
  const { sorteio } = req.body;
  const sorteioFind = raffles.find((item) => item.id === sorteio);
  if (!sorteioFind) {
    return res.status(404).json({ message: "Sorteio não encontrado!" });
  }
  let numeroSorteado = Math.floor(
    Math.random(2) * sorteioFind.apostadores.length
  );
  let ganhador = punters.find(
    (item) => item.id === sorteioFind.apostadores[numeroSorteado].id
  );
  ganhador.saldo += sorteioFind.premio;
  sorteioFind.aberto = false;

  return res.json({
    punters,
    premio: sorteioFind.premio,
    ganhador: sorteioFind.apostadores[numeroSorteado],
  });
};
