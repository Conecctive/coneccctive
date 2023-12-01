
const initAnimaScroll = () => {

  const sections = document.querySelectorAll('.js-scroll');
  if (sections.length) {

    const windowMetade = window.innerHeight * 0.8;
    const animaScroll = () => {
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const isSectionVisible = (sectionTop - windowMetade) < 0
        if (isSectionVisible) {
          section.classList.add('ativado');
        }
      })
    }
    animaScroll();

    window.addEventListener('scroll', animaScroll)

  }
}

initAnimaScroll();




const destaque = document.querySelector('#descricao');
const trabalhadorButton = document.getElementById('trabalhadorButton');
const contratanteButton = document.getElementById('contratanteButton');
const conteudoDescricao = document.querySelector('.conteudo-descricao');

// Conteúdo para Trabalhador e Contratante
const conteudoTrabalhador = {
  titulo: 'Ser Trabalhador é:',
  descricao: 'Ser trabalhador no site envolve oferecer suas habilidades e serviços, destacando competências e experiência no perfil. Isso facilita a busca por contratantes. Com liberdade para escolher projetos e ritmo de trabalho, é uma forma eficaz de ampliar a rede profissional e ganhar experiência variada.'
};

const conteudoContratante = {
  titulo: 'Ser Contratante é:',
  descricao: 'Como contratante, você tem a oportunidade de encontrar profissionais qualificados para solucionar os desafios específicos que você enfrenta. Você pode escolher entre uma variedade de habilidades e experiências para garantir o sucesso do seu projeto.'
};

trabalhadorButton.addEventListener('click', () => {
  conteudoDescricao.querySelector('h1').textContent = conteudoTrabalhador.titulo;
  conteudoDescricao.querySelector('p').textContent = conteudoTrabalhador.descricao;
});

contratanteButton.addEventListener('click', () => {
  conteudoDescricao.querySelector('h1').textContent = conteudoContratante.titulo;
  conteudoDescricao.querySelector('p').textContent = conteudoContratante.descricao;
});


const linkTrabalhador = document.querySelector('#linkTrabalhador');


linkTrabalhador.addEventListener('click', function(event){
  event.preventDefault();
  linkTrabalhador.scrollIntoView({
  behavior: 'smooth',
  block: 'start',
});
conteudoDescricao.querySelector('h1').textContent = conteudoTrabalhador.titulo;
conteudoDescricao.querySelector('p').textContent = conteudoTrabalhador.descricao;

});



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calcula a posição do elemento de destino
        const targetOffset = targetElement.getBoundingClientRect().top;
        const scrollOffset = window.pageYOffset;
        const finalOffset = targetOffset + scrollOffset;

        // Rola suavemente até o elemento de destino
        window.scrollTo({
          top: finalOffset,
          behavior: 'smooth'
        });
      }
    });
  });