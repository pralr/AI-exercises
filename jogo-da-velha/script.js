let tabuleiro; 
let humano = 'X';
let IA = 'O';

let combinacoes_que_ganha = [
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

let posicoes = document.querySelectorAll('.posicao');

function iniciaJogo() {
    document.querySelector('.fim-de-jogo').style.display = 'none'; 

    tabuleiro = Array.from(Array(9).keys()) 

    for (let i = 0; i < posicoes.length; i++) {
        posicoes[i].innerText = '';
        posicoes[i].style.removeProperty('background-color');
        posicoes[i].addEventListener('click', alteraComClique, false);
    }

}

function alteraComClique(e) {
    if(typeof tabuleiro[e.target.id] == 'number') { /* se é número, significa que o lugar tá vazio */
        passaVez(e.target.id, humano);
        if(!temEmpate()) passaVez(melhorPosicao(), IA);

    }

    
}

function passaVez(posicao, jogador) {
    tabuleiro[posicao] = jogador; 
    document.getElementById(posicao).innerText = jogador;

    /* vê se alguém já ganhou */
    let temVencedor = confereVencedor(tabuleiro, jogador);
    if(temVencedor) {
        fimDeJogo(temVencedor);
    }
}

function confereVencedor(tabuleiro, jogador) {
    let jogadas = tabuleiro.reduce((a, e, i) => (e === jogador) ? a.concat(i) : a, []);

    let temVencedor  = null;

    /* percorre por todas as posicoes e vê se existe alguma combinação "vencedora" */ 
    for(let [index, vence] of combinacoes_que_ganha.entries()) {
        if(vence.every(elem => jogadas.indexOf(elem) > -1 )) {
            temVencedor = {index: index, jogador: jogador};
            break;
        }
    }
    return temVencedor;
}

function fimDeJogo(temVencedor) {
    for(let index of combinacoes_que_ganha[temVencedor.index]) {
        document.getElementById(index).style.backgroundColor = 'green';
    }

    for(let i = 0; i < posicoes.length; i++) {
        posicoes[i].removeEventListener('click', alteraComClique, false); /* não pode mais brincar */
    }

    obtemVencedor(temVencedor.jogador == humano ? "Você ganhou!" : "Você perdeu, hahaha");
}

function posicoesVazias() {
    return tabuleiro.filter(s => typeof s == 'number');
}


function melhorPosicao() {
    /*nível fácil, sem o MINIMAX, pois ele pega a primeira posição livre!*/ 
    //return posicoesVazias()[0];

    return MINIMAX(tabuleiro, IA).index;
}

function obtemVencedor(alguem) {
    document.querySelector(".fim-de-jogo").style.display = "block";
    document.querySelector(".fim-de-jogo .texto").innerText = alguem;
}
function temEmpate() {
    if(posicoesVazias().length == 0) {
        for(let i = 0; i < posicoes.length; i++) {
            posicoes[i].style.backgroundColor = 'pink';
            posicoes[i].removeEventListener('click', alteraComClique, false);
        }
        obtemVencedor("Teve empate!");
        return true;
    }
    return false;
}

function MINIMAX(novoTabuleiro, jogador) {
    let posicoesDisponiveis = posicoesVazias(novoTabuleiro);

    if(confereVencedor(novoTabuleiro, jogador)) {
        return {pontuacao: -10};
    } else if(confereVencedor(novoTabuleiro, IA)) {
            return {pontuacao: 10}; 
    } else if (posicoesDisponiveis.length === 0) {
        return {pontuacao:0};
    }

    let jogadas = [];

    for(let i = 0; i < posicoesDisponiveis.length; i++) {
        let jogada = {};
        jogada.index = novoTabuleiro[posicoesDisponiveis[i]];
        novoTabuleiro[posicoesDisponiveis[i]] = jogador;

        if(jogador == IA) {
            let resultado = MINIMAX(tabuleiro, humano);
            jogada.pontuacao = resultado.pontuacao;
        } else {
            let resultado = MINIMAX(novoTabuleiro, IA);
            jogada.pontuacao = resultado.pontuacao;
        }

        novoTabuleiro[posicoesDisponiveis[i]] = jogada.index;

        jogadas.push(jogada);
    }

    let melhorJogada;  /*deve ser a que proporciona a melhor PONTUACAO quando a IA está jogando e a menor pontuacao quando 
    a gnt tá jogando */ 
    if(jogador === IA) {
        let melhorPontuacao = -1000;

        for(let i = 0; i < jogadas.length; i++) {
            if(jogadas[i].pontuacao > melhorPontuacao) {
                melhorPontuacao = jogadas[i].pontuacao;
                melhorJogada = i;
            }
        }
    } else {

        let melhorPontuacao = 1000;

        for(let i = 0; i < jogadas.length; i++) {
            if(jogadas[i].pontuacao < melhorPontuacao) {
                melhorPontuacao = jogadas[i].pontuacao;
                melhorJogada = i;
            }
        }
    }

    return jogadas[melhorJogada]; 
}

iniciaJogo(); 