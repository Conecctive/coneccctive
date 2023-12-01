function mascaraCPF(event) {
    const input = event.target;
    const value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
 
    if (value.length <= 10) {
        input.value = value.replace(/(\d{3})(\d{3})?(\d{0,3})?/, (match, p1, p2, p3) => {
            let cpfPart = p1;
            if (p2) cpfPart += `.${p2}`;
            if (p3) cpfPart += `.${p3.padEnd(2, '0')}`; // Garante dois dígitos para os dois últimos números
            return cpfPart;
        });
    } else {
        input.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}


function validarForm() {
    var senha = document.getElementById("senha").value;
    var confSenha = document.getElementById("confSenha").value;
    var email = document.getElementById("email").value;
    var confEmail = document.getElementById("confEmail").value;
    
    var mensagem = document.querySelector('.login-cadastro > p');

    var mensagemErro = ''; // Variável para armazenar a mensagem de erro

    if (senha !== confSenha) {
        mensagemErro = 'As senhas não são iguais';
    } else if (email !== confEmail) {
        mensagemErro = 'Os E-mails não são iguais';
    } else if (email !== confEmail && senha !== confSenha) {
        mensagemErro = 'Os E-mails e senhas não são iguais';
    }

    if (mensagemErro) {
        mensagem.classList.add("erro");
        mensagem.innerHTML = mensagemErro;
        event.preventDefault(); // Impede o envio do formulário
        return false;
    } else {
        // Se não houver erro, limpe a mensagem de erro
        mensagem.classList.remove("erro");
        mensagem.innerHTML = '';
        return true;
    }
}



// Opcao cadastro

document.getElementById('continuarBtn').addEventListener('click', function () {
    // Verifique qual opção foi selecionada
    const contratante = document.getElementById('contratante').checked;
    const trabalhador = document.getElementById('trabalhador').checked;
    const erroSelecao = document.getElementById('erroSelecao');
    // verifica se nenhuma opção foi selecionada
    if (!contratante && !trabalhador) {
        erroSelecao.style.display = 'block'; // Exibe o parágrafo de erro
    } else {
        erroSelecao.style.display = 'none'; // Oculta o parágrafo de erro, se já estiver visível
    }
    // Redirecione com base na escolha
    if (contratante) {
        // Redirecionar para a página do contratante
        window.location.href = '/cadastroContratante';
    } else if (trabalhador) {
        // Redirecionar para a página do trabalhador
        window.location.href = '/cadastroTrabalhador';
    }
});



// recuperação de senha 

function validarRecuSenha(){
    var senha = document.getElementById("senha").value;
    var confSenha = document.getElementById("confSenha").value;
    var mensagem = document.querySelector('.login-cadastro p')
    if (senha !== confSenha){
        mensagem.classList.add("erro");
        mensagem.style.display = 'block'
        mensagem.innerHTML = 'As senhas não são iguais';
        event.preventDefault(); // Impede o envio do formulário
        return false;
        }
}