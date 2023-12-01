// cidade e estado
const cidadesPorEstado = {
    AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Manoel Urbano", "Feijó", "Senador Guiomard", "Xapuri", "Bujari", "Plácido de Castro", "Porto Acre", "Marechal Thaumaturgo", "Assis Brasil", "Epitaciolândia", "Tarauacá", "Porto Walter", "Capixaba", "Jordão", "Acrelândia", "Brasiléia", "Rodrigues Alves", "Santa Rosa do Purus", "Vila Campinas", "Manoel Urbano"],
    AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "Marechal Deodoro", "Penedo", "Delmiro Gouveia", "São Miguel dos Campos", "Coruripe", "União dos Palmares", "Atalaia", "Campo Alegre", "Santana do Ipanema", "Pilar", "São Luís do Quitunde", "Girau do Ponciano", "São Sebastião", "Viçosa", "Junqueiro", "Matriz de Camaragibe", "Boca da Mata", "Murici", "Teotônio Vilela", "Mata Grande", "Pão de Açúcar"],
    AP: ["Macapá", "Santana", "Mazagão", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Cutias", "Ferreira Gomes", "Tartarugalzinho", "Vitória do Jari", "Amapá", "Calçoene", "Pracuúba", "Serra do Navio", "Pedra Branca do Amapari", "Itaubal", "Oiapoque"],
    AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tabatinga", "Tefé", "Humaitá", "Iranduba", "Maués", "Benjamin Constant", "São Gabriel da Cachoeira", "Autazes", "São Paulo de Olivença", "Borba", "Manicoré", "Presidente Figueiredo", "Barreirinha", "Rio Preto da Eva", "Eirunepé", "Careiro da Várzea", "Nova Olinda do Norte", "Lábrea", "Novo Airão", "Boca do Acre", "Tonantins"],
    BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Jequié", "Lauro de Freitas", "Ilhéus", "Teixeira de Freitas", "Barreiras", "Porto Seguro", "Simões Filho", "Alagoinhas", "Paulo Afonso", "Eunápolis", "Santo Antônio de Jesus", "Valença", "Candeias", "Guaratinga", "Jacobina", "Irecê", "Senhor do Bonfim", "Dias d'Ávila", "Serrinha", "Camacan", "Itapetinga"],
    CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá", "Pacajus", "Crateús", "Canindé", "Quixeramobim", "Tianguá", "Aracati", "Russas", "Icó", "Cascavel", "Pacatuba", "Morada Nova", "Caucaia", "Acaraú", "Horizonte", "Camocim"],
    DF: ["Brasília"],
    ES: ["Vitória", "Vila Velha", "Cariacica", "Serra", "Linhares", "São Mateus", "Cachoeiro de Itapemirim", "Guarapari", "Colatina", "Aracruz", "Nova Venécia", "Barra de São Francisco", "Castelo", "Afonso Cláudio", "Viana", "Santa Maria de Jetibá", "Conceição da Barra", "Alegre", "Guaçuí", "Mimoso do Sul"],
    GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás", "Trindade", "Formosa", "Novo Gama", "Catalão", "Jataí", "Itumbiara", "Senador Canedo", "Cristalina", "Luziânia", "Goianésia", "Quirinópolis", "Planaltina", "Itaberaí", "Inhumas", "Mineiros", "Niquelândia", "Santo Antônio do Descoberto"],
    MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Caxias", "Timon", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Barra do Corda", "Santa Inês", "Pinheiro", "Chapadinha", "Grajaú", "Itapecuru Mirim", "São Mateus do Maranhão", "Zé Doca", "Coroatá", "Tutóia", "Vargem Grande", "Barreirinhas", "Coelho Neto", "Presidente Dutra", "Viana"],
    MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde", "Primavera do Leste", "Barra do Garças", "Pontes e Lacerda", "Alta Floresta", "Nova Mutum", "Campo Verde", "Juína", "Rondonópolis", "Cuiabá", "Sorriso", "Tangará da Serra", "Cáceres", "Sinop", "Cuiabá", "Várzea Grande", "Rondonópolis", "Sorriso", "Sinop"],
    MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Sidrolândia", "Naviraí", "Nova Andradina", "Aquidauana", "Maracaju", "Amambai", "Rio Brilhante", "Coxim", "Caarapó", "Bela Vista", "Jardim", "Anastácio", "Itaporã", "Miranda", "Dois Irmãos do Buriti", "Ribas do Rio Pardo", "São Gabriel do Oeste", "Ladário", "Nova Alvorada do Sul", "Paranaíba", "Bonito"],
    MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Santa Luzia", "Ibirité", "Poços de Caldas", "Patos de Minas", "Teófilo Otoni", "Pouso Alegre", "Barbacena", "Sabará", "Varginha", "Itabira", "Lavras", "Ouro Preto", "Igarapé", "Ubá"],
    PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Abaetetuba", "Parauapebas", "Itaituba", "Tucuruí", "Marituba", "Bragança", "Cametá", "Abaiara", "Tailândia", "Breves", "Oriximiná", "Moju", "Igarapé-Miri", "Altamira", "Pacajá", "Tucumã", "Barcarena", "Breu Branco", "Redenção", "Mocajuba", "Novo Repartimento"],
    PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux", "Sousa", "Cajazeiras", "Cabedelo", "Guarabira", "Mamanguape", "Rio Tinto", "Pombal", "Catolé do Rocha", "Queimadas", "Solânea", "São Bento", "Esperança", "Monteiro", "Pedras de Fogo", "Itabaiana", "Alagoa Grande", "Mari", "Itaporanga", "Pedro II", "Princesa Isabel", "Soledade"],
    PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá", "Apucarana", "Toledo", "Araucária", "Campos dos Goytacazes", "Pinhais", "Piraquara", "Umuarama", "Almirante Tamandaré", "Cambé", "Campo Largo", "Arapongas", "Paranavaí", "Cianorte", "Telêmaco Borba", "Marechal Cândido Rondon"],
    PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe", "Garanhuns", "Vitória de Santo Antão", "São Lourenço da Mata", "Igarassu", "Abreu e Lima", "Santa Cruz do Capibaribe", "Ipojuca", "Serra Talhada", "Araripina", "Gravatá", "Carpina", "Goiana", "Belo Jardim", "Pesqueira", "Surubim", "Palmares", "Belo Jardim", "Afogados da Ingazeira"],
    PI: ["Teresina", "Parnaíba", "Picos", "Campo Maior", "Piripiri", "Floriano", "Barras", "Altos", "José de Freitas", "Pio IX", "União", "Esperantina", "Luís Correia", "Oeiras", "São Raimundo Nonato", "Pedro II", "Miguel Alves", "Campo Maior", "Simplício Mendes", "Demerval Lobão", "Batalha", "Luzilândia", "Amarante", "Uruçuí", "Inhuma", "Regeneração"],
    RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Campos dos Goytacazes", "Belford Roxo", "São João de Meriti", "Petrópolis", "Volta Redonda", "Magé", "Macaé", "Itaboraí", "Mesquita", "Cabo Frio", "Nova Friburgo", "Barra Mansa", "Nilópolis", "Teresópolis", "Resende", "Queimados", "Angra dos Reis", "Araruama", "Maricá", "Itaguaí"],
    RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Caicó", "Ceará-Mirim", "Açu", "Currais Novos", "São José de Mipibu", "Santa Cruz", "Nova Cruz", "Apodi", "João Câmara", "Macau", "Areia Branca", "Pau dos Ferros", "Extremoz", "Touros", "Goianinha", "São Paulo do Potengi", "Canguaretama", "Nísia Floresta", "Ipanguaçu", "São Miguel", "Lajes"],
    RS: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo", "São Leopoldo", "Riogrande", "Alvorada", "Passo Fundo", "Sapucaia do Sul", "Uruguaiana", "Cachoeirinha", "Santa Cruz do Sul", "Bagé", "Bento Gonçalves", "Erechim", "Guaíba", "Santana do Livramento", "Ijuí", "Alegrete", "Tramandaí", "Lajeado", "Capão da Canoa"],
    RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Guajará-Mirim", "Jaru", "Pimenta Bueno", "Rolim de Moura", "Acrelândia", "Candeias do Jamari", "Ouro Preto do Oeste", "Machadinho d'Oeste", "Nova Mamoré", "Presidente Médici", "Espigão d'Oeste", "Cujubim", "Nova Brasilândia d'Oeste", "Pimenteiras do Oeste", "Costa Marques", "Monte Negro", "Alto Alegre dos Parecis", "Buritis", "Nova União", "Mirante da Serra"],
    RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Alto Alegre", "Mucajaí", "Cantá", "Pacaraima", "Amajari", "Iracema", "Caroebe", "Uiramutã", "São João da Baliza", "Rorainópolis", "Normandia", "Bonfim", "Iracema", "São Luiz", "Alto Alegre", "Caracaraí", "Amajari", "Pacaraima", "Boa Vista", "São João da Baliza", "Mucajaí", "Cantá", "Uiramutã"],
    SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma", "Chapecó", "Itajaí", "Palhoça", "Lages", "Balneário Camboriú", "Jaraguá do Sul", "Brusque", "São Bento do Sul", "Rio do Sul", "Concórdia", "Navegantes", "Tubarão", "Araranguá", "Campos Novos", "Canoinhas", "Içara", "Biguaçu", "Capivari de Baixo", "Xanxerê", "Indaial", "São Francisco do Sul"],
    SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "São José dos Campos", "Santo André", "Ribeirão Preto", "Osasco", "Sorocaba", "Mauá", "São José do Rio Preto", "Mogi das Cruzes", "Mongaguá", "Itanhaém", "Peruíbe", "Praia Grande", "Diadema", "Jundiaí", "Piracicaba", "Carapicuíba", "Bauru", "Itaquaquecetuba", "Santos", "Franca", "São Vicente", "Barueri", "Taubaté", "Guarujá", "Suzano"],
    SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância", "Nossa Senhora da Glória", "Tobias Barreto", "Itabaianinha", "Simão Dias", "Campo do Brito", "Propriá", "Poço Verde", "Cristinápolis", "Nossa Senhora das Dores", "Boquim", "Poço Redondo", "Canindé de São Francisco", "Nossa Senhora das Dores", "Riachão do Dantas", "Laranjeiras", "Indiaroba", "Capela", "Itaporanga d'Ajuda", "Monte Alegre de Sergipe"],
    TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Araguatins", "Colinas do Tocantins", "Guaraí", "Dianópolis", "Tocantinópolis", "São Sebastião do Tocantins", "Miracema do Tocantins", "Formoso do Araguaia", "Xambioá", "Taguatinga", "Pium", "Sítio Novo do Tocantins", "Marianópolis do Tocantins", "Lagoa da Confusão", "Goiatins", "Peixe", "Araguaçu", "Alvorada", "Augustinópolis", "Santa Fé do Araguaia"]
  };

  function atualizarCidades() {
    const estadoSelecionado = document.getElementById("estados").value;
    const cidadesSelect = document.getElementById("cidades");

    // Limpe as opções anteriores
    cidadesSelect.innerHTML = "";

    if (estadoSelecionado === "selecione") {
      const option = document.createElement("option");
      option.text = "Selecione um Estado primeiro";
      cidadesSelect.add(option);
    } else {
      const cidades = cidadesPorEstado[estadoSelecionado];
      for (const cidade of cidades) {
        const option = document.createElement("option");
        option.text = cidade;
        cidadesSelect.add(option);
      }
    }
  }
  //botao cancelar
  function voltarParaPaginaAnterior() {
    window.history.back();
  }


  // Função para adicionar uma habilidade à lista
function adicionarHabilidade() {
  // Obtenha o elemento select e a lista de habilidades
  var select = document.getElementById("areasTecnologia");
  var listaHabilidades = document.querySelector(".lista-habilidades");

  // Obtenha o valor selecionado no select
  var habilidadeSelecionada = select.value;

  // Verifique se a habilidade já está na lista
  var habilidadesNaLista = listaHabilidades.getElementsByTagName("li");
  for (var i = 0; i < habilidadesNaLista.length; i++) {
    if (habilidadesNaLista[i].textContent === habilidadeSelecionada) {
      alert("Essa habilidade já foi adicionada.");
      return; // Evite a adição duplicada
    }
  }

  // Crie um novo elemento li
  var novoItem = document.createElement("li");
  
  // Adicione a habilidade selecionada e o ícone de lixeira
  novoItem.innerHTML = habilidadeSelecionada + ' <i class="fas fa-trash-alt remover"></i>';
  
  // Adicione o novo item à lista de habilidades
  listaHabilidades.appendChild(novoItem);
  
  // Adicione um ouvinte de evento para remover o item quando o ícone de lixeira é clicado
  novoItem.querySelector(".remover").addEventListener("click", function() {
    listaHabilidades.removeChild(novoItem);
  });
}

// Adicione um ouvinte de evento ao ícone de adição
var botaoAdicionar = document.querySelector(".adicionar");
botaoAdicionar.addEventListener("click", adicionarHabilidade);


// Seletor para o input de arquivo
const inputImagemPerfil = document.getElementById("colocar-imagem-perfil");

// Seletor para a imagem de perfil
const imagemPerfil = document.getElementById("imagem-perfil");

// Adicionar um ouvinte de evento para o input de arquivo
inputImagemPerfil.addEventListener("change", function (event) {
  const arquivo = event.target.files[0];

  if (arquivo) {
    const leitor = new FileReader();

    leitor.onload = function (e) {
      // Define o atributo src da imagem para a imagem carregada
      imagemPerfil.src = e.target.result;
    };

    // Lê o arquivo como um URL de dados
    leitor.readAsDataURL(arquivo);
  } else {
    // Caso o usuário cancele a seleção do arquivo
    imagemPerfil.src = ""; // Limpa a imagem
  }
});

