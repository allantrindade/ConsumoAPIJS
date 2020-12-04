// URL usada como base para consumo via API
const URL_BASE = 'https://wllsistemas.com.br/api/v3/cliente/'

//Função Para Limpar Todos os Campos
const Limpar = () => {id.value = ''
    nome.value = ''
    email.value = ''
    tipo.value = ''
    ErroNome.innerHTML = ''
    ErroEmail.innerHTML = ''
    ErroTipo.innerHTML = ''
    acao.value = 'incluir'
}

//Função para iniciar o loader
const AbrirLoader = () => loader.innerHTML = "AGUARDE, CARREGANDO DADOS ...<i class='ml-3 spinner-border text-success'></i>"

//Função para finalizar o loader
const FecharLoader = () => loader.innerHTML = ''

//Função para Carregar Todos as Pessoas Através de uma API
const Carregar = () => {
	//Chama a função AbrirLoader() para mostrar a mensagem do loader
    AbrirLoader()
/* Acessando a API através da URL_BASE, passando uma política de cache RELOAD,
para ignorar o cache HTTP no caminho para da rede local, mas atualizá-lo com a resposta recém-baixada da URL_BASE */
    fetch(URL_BASE, { cache: 'reload' })
        .then(response => response.json())
        .then(json => {
            let Linha = ''
			//Foreach para construir a tabela e seus dados
            json.forEach(pessoa => {
                Linha += '<tr id="linha' + pessoa.ID + '">' +
                    '<td>' + pessoa.ID + '</td>' +
                    '<td>' + pessoa.NOME + '</td>' +
                    '<td>' + pessoa.EMAIL + '</td>' +
                    '<td>' + pessoa.TIPO + '</td>' +
                    '<td>' +
					//Criação dos botões Editar e Excluir
                    '<button type="button" id="btn-editar-' + pessoa.ID + 
                    '" class="m-2 btn btn-info btn-sm">Editar</button>' +
                    '<button type="button" id="btn-excluir-' + pessoa.ID + 
                    '" class="btn btn-danger btn-sm">Excluir</button>' +
                    '</td>' +
                    '</tr>'
            })                             
            tabela.innerHTML = Linha

			//Foreach para criação do evento dos botões Editar e Excluir
            json.forEach(pessoa => {

                var btnEditar = document.getElementById('btn-editar-' + pessoa.ID)
                btnEditar.addEventListener('click', function () {
                    CarregarReg(pessoa.ID)
                })

                var btnExcluir = document.getElementById('btn-excluir-' + pessoa.ID)
                btnExcluir.addEventListener('click', function () {
                    Deletar(pessoa.ID)
                })

            })
			//Chama a função FercharLoader() para apagar a mensagem do loader
          FecharLoader()
        })
}

//Função Para Deletar uma Pessoa através do ID
const Deletar = i_d => {
    swal({
        title: "Voce tem certeza?",
        text: "Depois de excluído, você não será capaz de restaurar o ID " + i_d + "!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
			//Chama a função AbrirLoader() para mostrar a mensagem do loader
            AbrirLoader()
			// Acessando a API através da URL_BASE, passando o ID da pessoa a ser excluida
	        fetch(URL_BASE + i_d, {
            method:'DELETE',
            cache:'reload'
        })
        .then(response => {
			// Removendo o dado através do ID da pessoa
            response.status == 202 ? document.getElementById('linha' + i_d).remove() : false
            return response.json()
        })
        .then(json => {
			//Chamando a função Limpar() para limpar os dados nos inputs após exclusão
            Limpar()
			//Chama a função FercharLoader() para apagar a mensagem do loader
            FecharLoader()
			//Mensagem de sucesso após exclusão
            swal("ID " + i_d + " " + json.mensagem, {
                icon: "success",
            })
        })
        } else {
			//Mensagem de retorno caso não exclua a pessoa
            swal("ID " + i_d + " não foi excluído");
        }
    })

}

//Função Para Gravar Dados Alterado
const GravarDados = () => {
    acao.value == 'incluir' ? Gravar() : Alterar()
}

//Função Para Gravar Uma Pessoa
const Gravar = () => {
     if (ValidarCampos()){
		 //Chama a função AbrirLoader() para mostrar a mensagem do loader
        AbrirLoader()
		// Acessando a API através da URL_BASE
        fetch(URL_BASE, {
            cache: 'reload',
            method: 'POST',
            body: 'nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }    
        })
        .then(response => {
            if (response.status == 201) {
                Carregar()
				//Chamando a função Limpar() para limpar os dados nos inputs após gravar
                Limpar()        
            }
            return response.json()
        })
            .then(json => {
				//Chama a função FercharLoader() para apagar a mensagem do loader
                FecharLoader()      
                swal("Bom trabalho!",json.mensagem, "success")
            })
    }
}

//Função Para Alterar um Registro
const Alterar = () => {
    if (ValidarCampos()){
		//Chama a função AbrirLoader() para mostrar a mensagem do loader
        AbrirLoader()
	// Acessando a API através da URL_BASE
    fetch(URL_BASE, {
        cache: 'reload',
        method: 'PUT',
        body: 'id=' + id.value + '&nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => {
            if (response.status == 202) {
                Carregar()
				//Chamando a função Limpar() para limpar os dados nos inputs após alterar
                Limpar()
            }
            return response.json()
        })
        .then(json => {
			//Chama a função FercharLoader() para apagar a mensagem do loader
            FecharLoader() 
            swal("Bom trabalho!",json.mensagem, "success")
        })
    }
}

//Função Para Recarregar as Informações de uma Pessoa no Input para Edição de Dados
const CarregarReg = i_d => {
	//Chama a função AbrirLoader() para mostrar a mensagem do loader
    AbrirLoader()
	//Acessando a API através da URL_BASE mais o ID para carregar o registro nos inputs	
    fetch(URL_BASE + i_d, { cache: 'reload' })
        .then(response => response.json())
        .then(pessoa => {
            id.value = pessoa[0].ID
            nome.value = pessoa[0].NOME
            email.value = pessoa[0].EMAIL
            tipo.value = pessoa[0].TIPO
            acao.value = 'editar'
			//Chama a função FercharLoader() para apagar a mensagem do loader
            FecharLoader() 
        })
    
 }

 // Função para validar se os campos não estão vazios, caso esteja retorna false caso contrário retorna true
 const ValidarCampos = () => {
		//Se o valor do input NOME for menor 1 caractere ele retorna falso
    if (nome.value.length < 1){
        ErroNome.innerHTML = 'Por favor, preencha o campo nome!<BR><BR>'
        ErroNome.style.color = 'red'
        ErroEmail.innerHTML = ''
        ErroTipo.innerHTML = ''
        nome.focus()
        return false
	//Senao Se o valor do input EMAIL for menor 1 caractere ele retorna falso		
    } else if (email.value.length < 1){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = 'Por favor, preencha o campo email!<BR><BR>'
        ErroEmail.style.color = 'red'
        ErroTipo.innerHTML = ''
        email.focus()
        return false
	//Senao Se o valor do input EMAIL não tiver no formato de email com " . " e " @ " retorna falso	
    } else if (email.value.indexOf('@') == -1 || email.value.indexOf('.') == -1 ){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = 'Por favor, informe um E-MAIL válido!<BR><BR>'
        ErroEmail.style.color = 'red'
        ErroTipo.innerHTML = ''
        email.focus()
        return false
	//Senao Se o valor do input TIPO for menor 1 caractere ele retorna falso        
    } else if (tipo.value.length < 1){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = ''
        ErroTipo.innerHTML = 'Por favor, selecione o tipo!<BR><BR>'
        ErroTipo.style.color = 'red'
        tipo.focus()
        return false
	//Senao ele retorna verdadeiro		
    } else { return true }
 }

//Evento Botão Gravar
btnGravar.addEventListener('click', GravarDados)

//Evento Botão Carregar
btnCarregar.addEventListener('click', Carregar)

//Evento Botão Limpar
btnLimpar.addEventListener('click', Limpar)
Carregar()
Limpar()