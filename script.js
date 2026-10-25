"use strict";

const WHATSAPP_VITA_CAKES = "5586998525470";
const CHAVE_CARRINHO = "vitaCakesCarrinho";

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

/* Lê o carrinho salvo no navegador. */
function obterCarrinho() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_CARRINHO) || "{}"
    );

    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return {};
    }

    const carrinhoValido = {};

    for (const [id, quantidade] of Object.entries(dados)) {
      if (
        produtos[id] &&
        Number.isInteger(quantidade) &&
        quantidade > 0
      ) {
        carrinhoValido[id] = quantidade;
      }
    }

    return carrinhoValido;
  } catch (erro) {
    console.error("Não foi possível ler o carrinho:", erro);
    return {};
  }
}

/* Salva e atualiza a página após uma alteração. */
function salvarCarrinho(carrinho) {
  try {
    localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify(carrinho)
    );
  } catch (erro) {
    console.error("Não foi possível salvar o carrinho:", erro);
    alert("Não foi possível salvar seu pedido neste navegador.");
    return false;
  }

  atualizarContadores();
  mostrarCarrinho();
  return true;
}

/* Formata os preços em reais. */
function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* Adiciona um produto ao carrinho. */
function adicionarProduto(id) {
  if (!produtos[id]) {
    alert("Este produto não foi encontrado. Atualize a página e tente novamente.");
    return;
  }

  const carrinho = obterCarrinho();
  carrinho[id] = (carrinho[id] || 0) + 1;

  if (salvarCarrinho(carrinho)) {
    alert(produtos[id].nome + " foi adicionado ao seu pedido!");
  }
}

/* Altera a quantidade de um produto. */
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

/* Remove um produto inteiro do carrinho. */
function removerProduto(id) {
  const carrinho = obterCarrinho();

  if (!carrinho[id]) {
    return;
  }

  delete carrinho[id];
  salvarCarrinho(carrinho);
}

/* Atualiza todos os contadores do site. */
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

/* Mostra os produtos e o total na página do pedido. */
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

  const ids = Object.keys(carrinho).filter((id) => produtos[id]);

  if (ids.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "vazio";

    const mensagem = document.createElement("p");
    mensagem.textContent = "Seu pedido ainda está vazio.";

    const orientacao = document.createElement("p");
    orientacao.textContent = "Escolha suas delícias no cardápio para começar!";

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
    preco.textContent = formatarPreco(produto.preco) + " por unidade";

    const controles = document.createElement("div");
    controles.className = "controles-quantidade";

    const diminuir = document.createElement("button");
    diminuir.type = "button";
    diminuir.textContent = "−";
    diminuir.setAttribute("aria-label", "Diminuir " + produto.nome);
    diminuir.addEventListener("click", () => alterarQuantidade(id, -1));

    const numero = document.createElement("span");
    numero.textContent = quantidade;

    const aumentar = document.createElement("button");
    aumentar.type = "button";
    aumentar.textContent = "+";
    aumentar.setAttribute("aria-label", "Aumentar " + produto.nome);
    aumentar.addEventListener("click", () => alterarQuantidade(id, 1));

    controles.append(diminuir, numero, aumentar);
    informacoes.append(nome, preco, controles);

    const ladoDireito = document.createElement("div");

    const valor = document.createElement("strong");
    valor.textContent = formatarPreco(subtotal);

    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => removerProduto(id));

    ladoDireito.append(valor, botaoRemover);
    artigo.append(informacoes, ladoDireito);
    lista.appendChild(artigo);
  });

  totalElemento.textContent = formatarPreco(total);
  atualizarContadores();
}

/* Abre o WhatsApp para consultar uma encomenda especial. */
function encomendarProduto(nome) {
  const mensagem =
    "Olá! Gostaria de informações sobre uma encomenda na Vitta Cakes.\n" +
    "Produto: " + nome + "\n" +
    "Poderia me informar os sabores, valores e disponibilidade?";

  const url =
    "https://wa.me/" +
    WHATSAPP_VITA_CAKES +
    "?text=" +
    encodeURIComponent(mensagem);

  window.location.href = url;
}

/* Envia o resumo do carrinho para o WhatsApp. */
function finalizarPedidoWhatsApp() {
  const carrinho = obterCarrinho();
  const ids = Object.keys(carrinho).filter((id) => produtos[id]);

  if (ids.length === 0) {
    alert("Seu pedido está vazio. Adicione produtos pelo cardápio.");
    return;
  }

  let total = 0;
  let mensagem = "Olá! Gostaria de fazer um pedido na Vitta Cakes. 🍰\n\n";
  mensagem += "MEU PEDIDO:\n";

  ids.forEach((id) => {
    const produto = produtos[id];
    const quantidade = carrinho[id];
    const subtotal = produto.preco * quantidade;

    total += subtotal;

    mensagem +=
      "• " + produto.nome +
      " — " + quantidade + " unidade(s)" +
      " — " + formatarPreco(subtotal) + "\n";
  });

  mensagem += "\nTotal dos produtos: " + formatarPreco(total);

  mensagem += "\n\nAguardo a confirmação da disponibilidade. Obrigado(a)!";

  const url =
    "https://wa.me/" +
    WHATSAPP_VITTA_CAKES +
    "?text=" +
    encodeURIComponent(mensagem);

  window.location.href = url;
}

/* Mantém as funções acessíveis aos botões HTML. */
window.adicionarProduto = adicionarProduto;
window.alterarQuantidade = alterarQuantidade;
window.removerProduto = removerProduto;
window.encomendarProduto = encomendarProduto;
window.finalizarPedidoWhatsApp = finalizarPedidoWhatsApp;

/* Inicializa o site quando o HTML estiver pronto. */
document.addEventListener("DOMContentLoaded", () => {
  atualizarContadores();
  mostrarCarrinho();
});

/* Atualiza o carrinho caso ele seja alterado em outra aba. */
window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_CARRINHO) {
    atualizarContadores();
    mostrarCarrinho();
  }
});