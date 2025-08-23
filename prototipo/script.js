let tarefas = JSON.parse(localStorage.getItem("tarefas")) || {};
let diaSelecionado = null;

const calendario = document.getElementById("calendario");
const listaTarefas = document.getElementById("listaTarefas");
const modal = document.getElementById("modal");
const salvarBtn = document.getElementById("salvar");
const cancelarBtn = document.getElementById("cancelar");
const tituloDia = document.getElementById("tituloDia");

const nomeMesEl = document.getElementById("nomeMes");
const mesAnterior = document.getElementById("mesAnterior");
const mesProximo = document.getElementById("mesProximo");

const meses = [
  { nome: "AGOSTO DE 2025", dias: 31 },
  { nome: "SETEMBRO DE 2025", dias: 30 },
  { nome: "OUTUBRO DE 2025", dias: 31 },
  { nome: "NOVEMBRO DE 2025", dias: 30 },
  { nome: "DEZEMBRO DE 2025", dias: 31 },
];

let mesAtualIndex = 0; 

function renderizarMes() {
  calendario.innerHTML = "";
  const mes = meses[mesAtualIndex];
  nomeMesEl.innerText = mes.nome;

  for (let i = 1; i <= mes.dias; i++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.innerText = i;
    dia.onclick = () => abrirModal(`${mes.nome}-${i}`);
    calendario.appendChild(dia);

    if (tarefas[`${mes.nome}-${i}`]) dia.classList.add("com-tarefa");
  }
}

mesAnterior.onclick = () => {
  mesAtualIndex = (mesAtualIndex - 1 + meses.length) % meses.length;
  renderizarMes();
};

mesProximo.onclick = () => {
  mesAtualIndex = (mesAtualIndex + 1) % meses.length;
  renderizarMes();
};

renderizarMes();

function abrirModal(dia) {
  diaSelecionado = dia;
  tituloDia.innerText = `Tarefas do Dia ${dia}`;
  modal.style.display = "block";
  exibirTarefas();
}

function exibirTarefas() {
  listaTarefas.innerHTML = "";
  if (tarefas[diaSelecionado]) {
    tarefas[diaSelecionado].forEach((tarefa, index) => {
      const li = document.createElement("li");
      li.textContent = `${tarefa.hora} - ${tarefa.desc} (Responsável: ${tarefa.resp})`;

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "❌";
      btnExcluir.className = "btn-excluir";
      btnExcluir.onclick = () => excluirTarefa(index);

      li.appendChild(btnExcluir);
      listaTarefas.appendChild(li);
    });
  }
}

salvarBtn.onclick = () => {
  const desc = document.getElementById("descricao").value;
  const resp = document.getElementById("responsavel").value;
  const hora = document.getElementById("hora").value;

  if (!desc || !hora) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  if (!tarefas[diaSelecionado]) tarefas[diaSelecionado] = [];

  const rodizio = ["Diogo Berçocano", "Thiago Henrique", "Vinicius Lordron", "Wendell Ramos"];
  let responsavel = resp || rodizio[tarefas[diaSelecionado].length % rodizio.length];

  tarefas[diaSelecionado].push({ desc, resp: responsavel, hora, notificado: false });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  renderizarMes();

  document.getElementById("descricao").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("responsavel").value = "";

  exibirTarefas();
};

cancelarBtn.onclick = () => {
  modal.style.display = "none";
};

function excluirTarefa(index) {
  tarefas[diaSelecionado].splice(index, 1);
  if (tarefas[diaSelecionado].length === 0) {
    delete tarefas[diaSelecionado];
  }
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderizarMes();
  exibirTarefas();
}

window.onclick = function(event) {
  if (event.target == modal) modal.style.display = "none";
};