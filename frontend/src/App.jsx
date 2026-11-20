
import { useState } from "react";
import "./App.css";

/* =====================================
   FORMATAÇÃO DO CPF
===================================== */

function formatarCPF(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

/* =====================================
   VALIDAÇÃO DO CPF
===================================== */

function validarCPF(valor) {
  const cpf = valor.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;
    const digito = resto === 10 ? 0 : resto;

    if (digito !== Number(cpf[tamanho])) {
      return false;
    }
  }

  return true;
}

/* =====================================
   FORMATAÇÃO DO TELEFONE
===================================== */

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros.length ? `(${numeros}` : "";
  }

  const ddd = numeros.slice(0, 2);
  const restante = numeros.slice(2);

  if (restante.length <= 4) {
    return `(${ddd}) ${restante}`;
  }

  const quantidadeInicial = numeros.length === 11 ? 5 : 4;

  return (
    `(${ddd}) ` +
    restante.slice(0, quantidadeInicial) +
    "-" +
    restante.slice(quantidadeInicial)
  );
}

/* =====================================
   VALIDAÇÃO DA IDENTIFICAÇÃO
===================================== */

function validarIdentificador(tipo, valor) {
  const texto = valor.trim();

  if (!texto) return false;

  switch (tipo) {
    case "cpf":
      return validarCPF(texto);

    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);

    case "telefone": {
      const numeros = texto.replace(/\D/g, "");
      return numeros.length === 10 || numeros.length === 11;
    }

    case "usuario":
      return texto.length >= 3 && texto.length <= 30;

    default:
      return false;
  }
}

/* =====================================
   COMPONENTE PRINCIPAL
===================================== */

function App() {
  const [mensagem, setMensagem] = useState("");

  // Forma de entrar no sistema
  const [tipoLogin, setTipoLogin] = useState("cpf");

  // Identificação digitada
  const [identificador, setIdentificador] = useState("");
  const [identificadorTocado, setIdentificadorTocado] =
    useState(false);

  // Mostrar e ocultar senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Acessibilidade
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [altoContraste, setAltoContraste] = useState(false);

  const identificadorInvalido =
    identificadorTocado &&
    !validarIdentificador(tipoLogin, identificador);

  const nomes = {
    cpf: "CPF",
    email: "E-mail",
    telefone: "Telefone",
    usuario: "Nome de usuário",
  };

  const placeholders = {
    cpf: "Digite seu CPF",
    email: "Digite seu e-mail",
    telefone: "Digite seu telefone",
    usuario: "Digite seu nome de usuário",
  };

  /* TROCAR FORMA DE LOGIN */

  function alterarTipoLogin(evento) {
    setTipoLogin(evento.target.value);
    setIdentificador("");
    setIdentificadorTocado(false);
    setMensagem("");
  }

  /* DIGITAR IDENTIFICAÇÃO */

  function alterarIdentificador(evento) {
    let valor = evento.target.value;

    if (tipoLogin === "cpf") {
      valor = formatarCPF(valor);
    }

    if (tipoLogin === "telefone") {
      valor = formatarTelefone(valor);
    }

    setIdentificador(valor);
    setMensagem("");
  }

  /* ENTRAR NO SISTEMA */

  function entrar(evento) {
    evento.preventDefault();

    setIdentificadorTocado(true);

    if (!validarIdentificador(tipoLogin, identificador)) {
      setMensagem("Confira seus dados para continuar.");
      return;
    }

    setMensagem(
      "Dados preenchidos. O login será conectado ao backend."
    );
  }

  /* MOSTRAR E OCULTAR SENHA */

  function alternarSenha() {
    setMostrarSenha((anterior) => !anterior);
  }

  /* ACESSIBILIDADE */

  function aumentarFonte() {
    setTamanhoFonte((anterior) =>
      Math.min(anterior + 1, 20)
    );
  }

  function diminuirFonte() {
    setTamanhoFonte((anterior) =>
      Math.max(anterior - 1, 14)
    );
  }

  function alternarContraste() {
    setAltoContraste((anterior) => !anterior);
  }

  return (
    <div
      className={`pagina-login ${
        altoContraste ? "alto-contraste" : ""
      }`}
      style={{ fontSize: `${tamanhoFonte}px` }}
    >

      {/* CABEÇALHO */}
      <header className="cabecalho">

        <div className="logo">
          ♡ Atende Você
        </div>

        <div
          className="controles-acessibilidade"
          role="group"
          aria-label="Controles de acessibilidade"
        >

          <span className="rotulo-acessibilidade">
            Acessibilidade
          </span>

          <button
            type="button"
            className="botao-acessibilidade"
            onClick={diminuirFonte}
            disabled={tamanhoFonte <= 14}
            aria-label="Diminuir tamanho das letras"
          >
            A−
          </button>

          <button
            type="button"
            className="botao-acessibilidade"
            onClick={aumentarFonte}
            disabled={tamanhoFonte >= 20}
            aria-label="Aumentar tamanho das letras"
          >
            A+
          </button>

          <button
            type="button"
            className="botao-acessibilidade botao-contraste"
            onClick={alternarContraste}
            aria-pressed={altoContraste}
          >
            ◐ Alto contraste
          </button>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo-login">

        {/* LADO ESQUERDO */}
        <section className="lado-esquerdo">

          <h1>Bem-vindo ao Atende Você</h1>

          <p>
            Acompanhe suas consultas, exames e
            atendimentos de forma simples,
            segura e acessível.
          </p>

          <div className="espaco-imagem">
            <img
              src="/imagens/casal-idosos.png"
              alt="Casal de idosos sorrindo"
              className="imagem-idosos"
            />
          </div>

        </section>

        {/* LADO DIREITO */}
        <section className="lado-direito">

          <form className="card-login" onSubmit={entrar}>

            <h2>Acesse sua conta</h2>

            <p>
              Informe seus dados para entrar no sistema.
            </p>

            {/* SELETOR DE FORMA DE LOGIN */}
            <div className="linha-tipo-login">

              <select
                id="tipo-login"
                className="seletor-login"
                value={tipoLogin}
                onChange={alterarTipoLogin}
                aria-label="Escolher forma de acesso"
              >
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="usuario">
                  Nome de usuário
                </option>
              </select>

            </div>

            {/* CAMPO DE IDENTIFICAÇÃO */}
            <input
              id="identificador"
              name="identificador"
              type="text"
              inputMode={
                tipoLogin === "cpf" ||
                tipoLogin === "telefone"
                  ? "numeric"
                  : tipoLogin === "email"
                    ? "email"
                    : "text"
              }
              autoComplete={
                tipoLogin === "email"
                  ? "email"
                  : tipoLogin === "telefone"
                    ? "tel"
                    : "username"
              }
              placeholder={placeholders[tipoLogin]}
              aria-label={`Digite seu ${nomes[tipoLogin]}`}
              value={identificador}
              onChange={alterarIdentificador}
              onBlur={() => setIdentificadorTocado(true)}
              aria-invalid={identificadorInvalido}
              aria-describedby={
                identificadorInvalido
                  ? "erro-identificador"
                  : undefined
              }
              maxLength={
                tipoLogin === "cpf"
                  ? 14
                  : tipoLogin === "telefone"
                    ? 15
                    : tipoLogin === "usuario"
                      ? 30
                      : 254
              }
              required
            />

            {/* MENSAGEM DE ERRO */}
            {identificadorInvalido && (
              <p
                id="erro-identificador"
                className="erro-identificador"
                role="alert"
              >
                Informe um {nomes[tipoLogin].toLowerCase()} válido.
              </p>
            )}

            {/* CAMPO DE SENHA */}
            <label htmlFor="senha">Senha</label>

            <div className="campo-senha">

              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
              />

              {/* BOTÃO DO OLHO */}
              <button
                type="button"
                className="botao-visualizar-senha"
                onClick={alternarSenha}
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                aria-pressed={mostrarSenha}
                title={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />

                  {mostrarSenha && (
                    <path d="M3 21 21 3" />
                  )}
                </svg>
              </button>

            </div>

            {/* ESQUECI MINHA SENHA */}
            <button
              type="button"
              className="esqueci-senha"
              onClick={() =>
                setMensagem(
                  "A recuperação de senha será criada."
                )
              }
            >
              Esqueci minha senha
            </button>

            {/* ENTRAR */}
            <button
              type="submit"
              className="botao-entrar"
            >
              Entrar
            </button>

            {/* CADASTRO */}
            <button
              type="button"
              className="botao-cadastro"
              onClick={() =>
                setMensagem(
                  "A tela de cadastro será criada."
                )
              }
            >
              Ainda não tenho cadastro
            </button>

            {/* MENSAGENS */}
            {mensagem && (
              <p role="status" className="mensagem">
                {mensagem}
              </p>
            )}

          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
