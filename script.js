const URL_BASE = 'https://wllsistemas.com.br/api/v3/cliente/'


//Função Para Limpar Todos os Campos
const Limpar = () => {
    id.value = ''
    nome.value = ''
    email.value = ''
    tipo.value = ''
    ErroNome.innerHTML = ''
    ErroEmail.innerHTML = ''
    ErroTipo.innerHTML = ''

}

//Função para Carregar Todos as Pessoas Através de uma API
const Carregar = () => {
    fetch(URL_BASE)
        .then(response => response.json())
        .then(json => {
            let Linha = ''
            json.forEach(pessoa => {
                Linha += '<tr id="linha' + pessoa.ID + '">' +
                    '<td>' + pessoa.ID + '</td>' +
                    '<td>' + pessoa.NOME + '</td>' +
                    '<td>' + pessoa.EMAIL + '</td>' +
                    '<td>' + pessoa.TIPO + '</td>' +
                    '<td>' +
                    '<a href="javascript:void(0)" id="btn-editar-' + pessoa.ID + '" class="btn btn-primary">Editar</a>' + ' ' +
                    '<a href="javascript:void(0)" id="btn-excluir-' + pessoa.ID + '" class="btn btn-danger">Excluir</a>' +
                    '</td>' +
                    '</tr>'
            })                             
            tabela.innerHTML = Linha

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
	        fetch(URL_BASE + i_d, {
            method:'DELETE'
        })
        .then(response => {
            response.status == 202 ? document.getElementById('linha' + i_d).remove() : false
            return response.json()
        })
        .then(json => {
            Limpar()
            swal("ID " + i_d + " " + json.mensagem, {
                icon: "success",
            })
        })
        } else {
            swal("ID " + i_d + " não foi excluído");
        }
    })

}


//Função Para Gravar Dados Alterado
const GravarDados = () => {
    acao.value == 'incluir' ? Gravar() : Alterar()
    acao.value = 'incluir'
}


//Função Para Gravar Uma Pessoa
const Gravar = () => {
    if (nome.value.length < 1){
        ErroNome.innerHTML = 'Por favor, preencha o campo nome<BR><BR>'
        ErroNome.style.color = 'red'
        ErroEmail.innerHTML = ''
        ErroTipo.innerHTML = ''
        nome.focus()
        return false       
    }
    else if (email.value.length < 1){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = 'Por favor, preencha o campo email<BR><BR>'
        ErroEmail.style.color = 'red'
        ErroTipo.innerHTML = ''
        email.focus()
        return false
    }
    else if (email.value.indexOf('@') == -1 || email.value.indexOf('.') == -1 ){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = 'Por favor, informe um E-MAIL válido!<BR><BR>'
        ErroEmail.style.color = 'red'
        ErroTipo.innerHTML = ''
        email.focus()
        return false        
    }
    else if (tipo.value.length < 1){
        ErroNome.innerHTML = ''
        ErroEmail.innerHTML = ''
        ErroTipo.innerHTML = 'Por favor, selecione o tipo<BR><BR>'
        ErroTipo.style.color = 'red'
        tipo.focus()
        return false       
    } else {
        fetch(URL_BASE, {
            method: 'POST',
            body: 'nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }    
        })
        .then(response => {
            if (response.status == 201) {
                Carregar()
                Limpar()        
            }
            return response.json()
        })
            .then(json => {      
                swal("Bom trabalho!",json.mensagem, "success")
            })
    }
}


//Função Para Alterar um Registro
const Alterar = () => {
    fetch(URL_BASE, {
        method: 'PUT',
        body: 'id=' + id.value + '&nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => {
            if (response.status == 202) {
                CarregarReg()
                Limpar()
            }
            return response.json()
        })
        .then(json => {
            swal("Bom trabalho!",json.mensagem, "success")
        })
}


//Função Para Recarregar as Informações de uma Pessoa no Input para Edição de Dados
const CarregarReg = i_d => {
    fetch(URL_BASE + i_d)
        .then(response => response.json())
        .then(pessoa => {
            id.value = pessoa[0].ID
            nome.value = pessoa[0].NOME
            email.value = pessoa[0].EMAIL
            tipo.value = pessoa[0].TIPO
            acao.value = 'editar'
        })
 }


//Evento Botão Gravar
btnGravar.addEventListener('click', GravarDados)

//Evento Botão Carregar
btnCarregar.addEventListener('click', Carregar)

//Evento Botão Limpar
btnLimpar.addEventListener('click', Limpar)

Carregar()
Limpar()