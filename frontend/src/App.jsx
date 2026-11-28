import { useState } from "react";
import "./App.css";

function formatarCPF(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function validarCPF(valor) {
  const cpf = valor.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  for (let tamanho = 9; tamanho <= 10; tamanho += 1) {
    let soma = 0;

    for (let i = 0; i < tamanho; i += 1) {
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

  const tamanhoInicial = numeros.length === 11 ? 5 : 4;

  return (
    `(${ddd}) ` +
    restante.slice(0, tamanhoInicial) +
    "-" +
    restante.slice(tamanhoInicial)
  );
}

function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

function validarCelular(valor) {
  const numeros = valor.replace(/\D/g, "");
  return /^\d{2}9\d{8}$/.test(numeros);
}

function validarUsuarioLogin(valor) {
  const texto = valor.trim();

  if (!texto) {
    return false;
  }

  if (validarEmail(texto)) {
    return true;
  }

  const numeros = texto.replace(/\D/g, "");
  return validarCPF(numeros) || validarCelular(numeros);
}

function App() {
  const [telaAtual, setTelaAtual] = useState("login");
  const [etapaCadastro, setEtapaCadastro] = useState(1);

  const [mensagem, setMensagem] = useState("");
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  const [identificador, setIdentificador] = useState("");
  const [identificadorTocado, setIdentificadorTocado] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [altoContraste, setAltoContraste] = useState(false);

  const [dadosCadastro, setDadosCadastro] = useState({
    nome: "",
    cpf: "",
    celular: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [camposTocados, setCamposTocados] = useState({});
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);

  const identificadorInvalido =
    identificadorTocado &&
    !validarUsuarioLogin(identificador);

  function alterarIdentificador(evento) {
    setIdentificador(evento.target.value);
    setMensagem("");
  }

  function entrar(evento) {
    evento.preventDefault();
    setIdentificadorTocado(true);

    if (!validarUsuarioLogin(identificador)) {
      setMensagem("Confira seus dados para continuar.");
      return;
    }

    setMensagem("Dados preenchidos. O login será conectado ao backend.");
  }

  function abrirCadastro() {
    setTelaAtual("cadastro");
    setEtapaCadastro(1);
    setMensagem("");
    setMensagemCadastro("");
  }

  function voltarParaLogin() {
    setTelaAtual("login");
    setEtapaCadastro(1);
    setMensagemCadastro("");
  }

  function atualizarCadastro(evento) {
    const { name, value } = evento.target;
    let novoValor = value;

    if (name === "cpf") {
      novoValor = formatarCPF(value);
    }

    if (name === "celular") {
      novoValor = formatarTelefone(value);
    }

    setDadosCadastro((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: novoValor,
    }));

    setMensagemCadastro("");
  }

  function marcarCampoTocado(campo) {
    setCamposTocados((atuais) => ({
      ...atuais,
      [campo]: true,
    }));
  }

  function obterErroCadastro(campo) {
    if (!camposTocados[campo]) {
      return "";
    }

    if (campo === "nome" && !dadosCadastro.nome.trim()) {
      return "Informe seu nome completo.";
    }

    if (campo === "cpf") {
      const numeros = dadosCadastro.cpf.replace(/\D/g, "");

      if (numeros.length < 11) {
        return "CPF incompleto. Digite os 11 números.";
      }

      if (!validarCPF(numeros)) {
        return "CPF inválido. Confira os números digitados.";
      }
    }

    if (campo === "celular") {
      const numeros = dadosCadastro.celular.replace(/\D/g, "");

      if (numeros.length < 11) {
        return "Celular incompleto. Digite DDD e número.";
      }

      if (!validarCelular(numeros)) {
        return "Informe um celular válido com DDD.";
      }
    }

    if (campo === "email" && !validarEmail(dadosCadastro.email)) {
      return "Informe um e-mail válido.";
    }

    if (campo === "senha" && dadosCadastro.senha.length < 8) {
      return "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (
      campo === "confirmarSenha" &&
      dadosCadastro.confirmarSenha !== dadosCadastro.senha
    ) {
      return "As senhas não conferem.";
    }

    return "";
  }

  function continuarCadastro(evento) {
    evento.preventDefault();

    setCamposTocados((atuais) => ({
      ...atuais,
      nome: true,
      cpf: true,
      celular: true,
      email: true,
    }));

    const dadosValidos =
      Boolean(dadosCadastro.nome.trim()) &&
      validarCPF(dadosCadastro.cpf) &&
      validarCelular(dadosCadastro.celular) &&
      validarEmail(dadosCadastro.email);

    if (dadosValidos) {
      setEtapaCadastro(2);
      setMensagemCadastro("");
    }
  }

  function confirmarCadastro(evento) {
    evento.preventDefault();

    setCamposTocados((atuais) => ({
      ...atuais,
      senha: true,
      confirmarSenha: true,
    }));

    const senhasValidas =
      dadosCadastro.senha.length >= 8 &&
      dadosCadastro.confirmarSenha === dadosCadastro.senha;

    if (!senhasValidas) {
      return;
    }

    setMensagemCadastro(
      "Dados preenchidos. O cadastro será conectado ao backend."
    );
  }

  function aumentarFonte() {
    setTamanhoFonte((anterior) => Math.min(anterior + 1, 20));
  }

  function diminuirFonte() {
    setTamanhoFonte((anterior) => Math.max(anterior - 1, 14));
  }

  return (
    <div
      className={`pagina-login ${altoContraste ? "alto-contraste" : ""}`}
      style={{ fontSize: `${tamanhoFonte}px` }}
    >
      {/* Este cabeçalho aparece nas duas telas */}
      <header className="cabecalho">
        <img
          src="/imagens/logo-agenda-facil.png"
          alt="Agenda Fácil"
          className="logo"
        />

        <div
          className="controles-acessibilidade"
          role="group"
          aria-label="Controles de acessibilidade"
        >
          <span className="rotulo-acessibilidade">Acessibilidade</span>

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
            onClick={() => setAltoContraste((anterior) => !anterior)}
            aria-pressed={altoContraste}
          >
            ◐ Alto contraste
          </button>
        </div>
      </header>

      {/* Uma tela principal inteira aparece de cada vez */}
      {telaAtual === "login" ? (
        <main className="conteudo-login">
          <section className="lado-esquerdo">
            <h1>
              Cuidar de você
              <br />
              pode ser <strong>mais simples</strong>
            </h1>

            <p>
              Agende seu Clínico Geral de forma prática, segura e acessível
            </p>

            <div className="espaco-imagem">
              <img
                src="/imagens/casal-idosos.png"
                alt="Casal de idosos sorrindo"
                className="imagem-idosos"
              />
            </div>
          </section>

          <section className="lado-direito">
            <form className="card-login" onSubmit={entrar}>
              <h2>Acesse sua conta</h2>
              <p>Informe seus dados para entrar no sistema.</p>

              <label htmlFor="identificador">Usuário</label>

              <input
                id="identificador"
                name="identificador"
                type="text"
                autoComplete="username"
                placeholder="Digite seu CPF, e-mail ou telefone"
                aria-label="Digite seu CPF, e-mail ou telefone"
                value={identificador}
                onChange={alterarIdentificador}
                onBlur={() => setIdentificadorTocado(true)}
                aria-invalid={identificadorInvalido}
                aria-describedby={
                  identificadorInvalido ? "erro-identificador" : undefined
                }
                maxLength={254}
                required
              />

              {identificadorInvalido && (
                <p
                  id="erro-identificador"
                  className="erro-identificador"
                  role="alert"
                >
                  Informe um CPF, e-mail ou telefone válido.
                </p>
              )}

              <label htmlFor="senha-login">Senha</label>

              <div className="campo-senha">
                <input
                  id="senha-login"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                />

                <button
                  type="button"
                  className="botao-visualizar-senha"
                  onClick={() => setMostrarSenha((anterior) => !anterior)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Visualizar senha"}
                  aria-pressed={mostrarSenha}
                  title={mostrarSenha ? "Ocultar senha" : "Visualizar senha"}
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

                    {mostrarSenha && <path d="M3 21 21 3" />}
                  </svg>
                </button>
              </div>

              <button
                type="button"
                className="esqueci-senha"
                onClick={() => setMensagem("A recuperação de senha será criada.")}
              >
                Esqueci minha senha
              </button>

              <button type="submit" className="botao-entrar">
                Entrar
              </button>

              <button
                type="button"
                className="botao-cadastro"
                onClick={abrirCadastro}
              >
                Ainda não tenho cadastro
              </button>

              {mensagem && (
                <p role="status" className="mensagem">
                  {mensagem}
                </p>
              )}
            </form>
          </section>
        </main>
      ) : (
        <main className="conteudo-cadastro">
          <nav className="caminho-cadastro" aria-label="Navegação">
            <button type="button" onClick={voltarParaLogin}>
              Início
            </button>
            <span aria-hidden="true">›</span>
            <span>Cadastro</span>
          </nav>

          <h1>Cadastro do beneficiário</h1>
          <p className="descricao-cadastro">
            Preencha os dados abaixo para continuar.
          </p>

          <div className="layout-cadastro">
            <section className="card-login card-cadastro">
              <div className="etapas-cadastro">
                <span className={etapaCadastro === 1 ? "etapa-ativa" : ""}>
                  1. Seus dados
                </span>
                <span className={etapaCadastro === 2 ? "etapa-ativa" : ""}>
                  2. Confirmação
                </span>
              </div>

              {etapaCadastro === 1 ? (
                <form onSubmit={continuarCadastro}>
                  <label htmlFor="nome-cadastro">Nome completo</label>
                  <input
                    id="nome-cadastro"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Digite seu nome completo"
                    value={dadosCadastro.nome}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("nome")}
                    aria-invalid={Boolean(obterErroCadastro("nome"))}
                    required
                  />
                  {obterErroCadastro("nome") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("nome")}
                    </p>
                  )}

                  <label htmlFor="cpf-cadastro">CPF</label>
                  <input
                    id="cpf-cadastro"
                    name="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Digite os 11 números do CPF"
                    maxLength={14}
                    value={dadosCadastro.cpf}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("cpf")}
                    aria-invalid={Boolean(obterErroCadastro("cpf"))}
                    required
                  />
                  {obterErroCadastro("cpf") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("cpf")}
                    </p>
                  )}

                  <label htmlFor="celular-cadastro">Celular</label>
                  <input
                    id="celular-cadastro"
                    name="celular"
                    type="text"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Digite DDD e número do celular"
                    maxLength={15}
                    value={dadosCadastro.celular}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("celular")}
                    aria-invalid={Boolean(obterErroCadastro("celular"))}
                    required
                  />
                  {obterErroCadastro("celular") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("celular")}
                    </p>
                  )}

                  <label htmlFor="email-cadastro">E-mail</label>
                  <input
                    id="email-cadastro"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Digite seu e-mail"
                    value={dadosCadastro.email}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("email")}
                    aria-invalid={Boolean(obterErroCadastro("email"))}
                    required
                  />
                  {obterErroCadastro("email") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("email")}
                    </p>
                  )}

                  <div className="botoes-etapa">
                    <button
                      type="button"
                      className="botao-cadastro"
                      onClick={voltarParaLogin}
                    >
                      Voltar
                    </button>
                    <button type="submit" className="botao-entrar">
                      Continuar
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={confirmarCadastro}>
                  <h2>Confirme seus dados</h2>

                  <div className="resumo-cadastro">
                    <p><strong>Nome:</strong> {dadosCadastro.nome}</p>
                    <p><strong>CPF:</strong> {dadosCadastro.cpf}</p>
                    <p><strong>Celular:</strong> {dadosCadastro.celular}</p>
                    <p><strong>E-mail:</strong> {dadosCadastro.email}</p>
                  </div>

                  <label htmlFor="senha-cadastro">Crie sua senha</label>
                  <input
                    id="senha-cadastro"
                    name="senha"
                    type={mostrarSenhaCadastro ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    value={dadosCadastro.senha}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("senha")}
                    aria-invalid={Boolean(obterErroCadastro("senha"))}
                    required
                  />
                  {obterErroCadastro("senha") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("senha")}
                    </p>
                  )}

                  <label htmlFor="confirmar-senha">Confirme sua senha</label>
                  <input
                    id="confirmar-senha"
                    name="confirmarSenha"
                    type={mostrarSenhaCadastro ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Digite a senha novamente"
                    value={dadosCadastro.confirmarSenha}
                    onChange={atualizarCadastro}
                    onBlur={() => marcarCampoTocado("confirmarSenha")}
                    aria-invalid={Boolean(obterErroCadastro("confirmarSenha"))}
                    required
                  />
                  {obterErroCadastro("confirmarSenha") && (
                    <p className="erro-identificador" role="alert">
                      {obterErroCadastro("confirmarSenha")}
                    </p>
                  )}

                  <label className="mostrar-senha-cadastro">
                    <input
                      type="checkbox"
                      checked={mostrarSenhaCadastro}
                      onChange={(evento) =>
                        setMostrarSenhaCadastro(evento.target.checked)
                      }
                    />
                    Mostrar senha
                  </label>

                  <div className="botoes-etapa">
                    <button
                      type="button"
                      className="botao-cadastro"
                      onClick={() => setEtapaCadastro(1)}
                    >
                      Voltar
                    </button>
                    <button type="submit" className="botao-entrar">
                      Confirmar cadastro
                    </button>
                  </div>

                  {mensagemCadastro && (
                    <p role="status" className="mensagem">
                      {mensagemCadastro}
                    </p>
                  )}
                </form>
              )}
            </section>

            <aside className="apoio-cadastro">
              <img
                src="/imagens/imagens.png"
                alt="Ilustração de cadastro"
                className="imagem-apoio-cadastro"
              />

              <div className="aviso-cadastro">
                <h2>Importante</h2>
                <p>
                  O preenchimento dos dados é obrigatório para concluir o
                  cadastro.
                </p>
              </div>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;