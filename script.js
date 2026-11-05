
"use strict";

const WHATSAPP_VITTA_CAKES = "5586998525470";
const CHAVE_CARRINHO = "vittaCakesCarrinho";

const produtos = {
  "prestigio": {
    nome: "Prestígio",
    preco: 14.00
  },
  "chocolate-meio-amargo": {
    nome: "Chocolate meio amargo",
    preco: 14.00
  },
  "casadinho": {
    nome: "Casadinho",
    preco: 15.00
  },
  "ninho-geleia-morango": {
    nome: "Ninho com geleia de morango",
    preco: 15.00
  },
  "creme-ninho": {
    nome: "Creme de Ninho",
    preco: 14.00
  },
  "tortinha-limao": {
    nome: "Tortinha de limão",
    preco: 15.00
  },
  "mousse-maracuja-trufado": {
    nome: "Mousse de maracujá trufado",
    preco: 15.00
  }
};

/* Lê o carrinho */
function obterCarrinho() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_CARRINHO) || "{}"
    );

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return {};
    }

    const carrinho = {};

    for (const [id, quantidade] of Object.entries(dados)) {
      if (
        produtos[id] &&
        Number.isInteger(quantidade) &&
        quantidade > 0
      ) {
        carrinho[id] = quantidade;
      }
    }

    return carrinho;
  } catch (erro) {
    console.error("Erro ao ler carrinho:", erro);
    return {};
  }
}

/* Salva o carrinho */
function salvarCarrinho(carrinho) {
  try {
    localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify(carrinho)
    );

    atualizarContadores();
    mostrarCarrinho();

    return true;
  } catch (erro) {
    console.error("Erro ao salvar carrinho:", erro);
    alert("Não foi possível salvar seu pedido.");
    return false;
  }
}

/* Formata valores */
function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* Adiciona produto */
function adicionarProduto(id) {
  if (!produtos[id]) {
    alert("Produto não encontrado.");
    return;
  }

  const carrinho = obterCarrinho();

  carrinho[id] = (carrinho[id] || 0) + 1;

  if (salvarCarrinho(carrinho)) {
    alert(produtos[id].nome + " foi adicionado ao pedido!");
  }
}

/* Altera quantidade */
function alterarQuantidade(id, alteracao) {
  if (!produtos[id] || !Number.isInteger(alteracao)) {
    return;
  }

  const carrinho = obterCarrinho();

  if (!carrinho[id]) {
    return;
  }

  carrinho[id] += alteracao;

  if (carrinho[id] <= 0) {
    delete carrinho[id];
  }

  salvarCarrinho(carrinho);
}

/* Remove produto */
function removerProduto(id) {
  const carrinho = obterCarrinho();

  if (!carrinho[id]) {
    return;
  }

  delete carrinho[id];

  salvarCarrinho(carrinho);
}

/* Atualiza contadores */
function atualizarContadores() {
  const carrinho = obterCarrinho();

  const quantidadeTotal = Object.values(carrinho).reduce(
    (total, quantidade) => total + quantidade,
    0
  );

  document.querySelectorAll(".contador").forEach((elemento) => {
    elemento.textContent = quantidadeTotal;
  });
}

/* Mostra carrinho */
function mostrarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalElemento = document.getElementById("total-pedido");

  if (!lista || !totalElemento) {
    atualizarContadores();
    return;
  }

  const carrinho = obterCarrinho();
  let total = 0;

  lista.replaceChildren();

  const ids = Object.keys(carrinho);

  if (ids.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "vazio";

    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu pedido ainda está vazio.";

    const orientacao = document.createElement("p");
    orientacao.textContent =
      "Escolha suas delícias no cardápio para começar!";

    vazio.append(mensagem, orientacao);
    lista.appendChild(vazio);

    totalElemento.textContent = formatarPreco(0);

    atualizarContadores();
    return;
  }

  ids.forEach((id) => {
    const produto = produtos[id];
    const quantidade = carrinho[id];
    const subtotal = produto.preco * quantidade;

    total += subtotal;

    const artigo = document.createElement("article");
    artigo.className = "item-carrinho";

    const informacoes = document.createElement("div");

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.textContent =
      formatarPreco(produto.preco) + " por unidade";

    const controles = document.createElement("div");
    controles.className = "controles-quantidade";

    const diminuir = document.createElement("button");
    diminuir.type = "button";
    diminuir.textContent = "−";
    diminuir.setAttribute(
      "aria-label",
      "Diminuir " + produto.nome
    );
    diminuir.addEventListener("click", () => {
      alterarQuantidade(id, -1);
    });

    const numero = document.createElement("span");
    numero.textContent = quantidade;

    const aumentar = document.createElement("button");
    aumentar.type = "button";
    aumentar.textContent = "+";
    aumentar.setAttribute(
      "aria-label",
      "Aumentar " + produto.nome
    );
    aumentar.addEventListener("click", () => {
      alterarQuantidade(id, 1);
    });

    controles.append(diminuir, numero, aumentar);
    informacoes.append(nome, preco, controles);

    const ladoDireito = document.createElement("div");

    const valor = document.createElement("strong");
    valor.textContent = formatarPreco(subtotal);

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => {
      removerProduto(id);
    });

    ladoDireito.append(valor, botaoRemover);

    artigo.append(informacoes, ladoDireito);
    lista.appendChild(artigo);
  });

  totalElemento.textContent = formatarPreco(total);

  atualizarContadores();
}

/* Abre WhatsApp */
function abrirWhatsApp(mensagem) {
  const url =
    "https://wa.me/" +
    WHATSAPP_VITTA_CAKES +
    "?text=" +
    encodeURIComponent(mensagem);

  window.location.href = url;
}

/* Encomendas especiais */
function encomendarProduto(nome) {
  const mensagem =
    "Olá! Gostaria de informações sobre uma encomenda na Vitta Cakes.\n\n" +
    "Produto: " + nome + "\n\n" +
    "Poderia me informar os sabores, valores e disponibilidade?";

  abrirWhatsApp(mensagem);
}

/* Finaliza pedido pelo WhatsApp */
function finalizarPedidoWhatsApp() {
  const carrinho = obterCarrinho();

  const ids = Object.keys(carrinho).filter(
    (id) => produtos[id]
  );

  if (ids.length === 0) {
    alert(
      "Seu pedido está vazio. Adicione produtos pelo cardápio."
    );
    return;
  }

  let total = 0;

  let mensagem =
    "Olá! Gostaria de fazer um pedido na Vitta Cakes. 🍰\n\n";

  mensagem += "MEU PEDIDO:\n\n";

  ids.forEach((id) => {
    const produto = produtos[id];
    const quantidade = carrinho[id];
    const subtotal = produto.preco * quantidade;

    total += subtotal;

    mensagem +=
      "• " + produto.nome +
      "\n  Quantidade: " + quantidade + " unidade(s)" +
      "\n  Subtotal: " + formatarPreco(subtotal) +
      "\n\n";
  });

  mensagem +=
    "TOTAL DOS PRODUTOS: " + formatarPreco(total);

  mensagem +=
    "\n\nAguardo a confirmação da disponibilidade. Obrigado(a)! ❤️";

  abrirWhatsApp(mensagem);
}

/* Disponibiliza funções para os botões HTML */
window.adicionarProduto = adicionarProduto;
window.alterarQuantidade = alterarQuantidade;
window.removerProduto = removerProduto;
window.encomendarProduto = encomendarProduto;
window.finalizarPedidoWhatsApp = finalizarPedidoWhatsApp;

/* Inicialização */
document.addEventListener("DOMContentLoaded", () => {
  atualizarContadores();
  mostrarCarrinho();
});

/* Sincroniza outras abas */
window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_CARRINHO) {
    atualizarContadores();
    mostrarCarrinho();
  }
});
