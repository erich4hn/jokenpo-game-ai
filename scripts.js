/**
 ** Esse jogo foi programado com que a IA sempre ganhe, utilizando a biblioteca
 ** Brain.js para uso das Redes Neurais.
 */

/**
 ** Variável constante declarada como "net" para chamada da classe.
 *? A propriedade do objeto chamada "hiddenLayers" recebe um array
 *? com o valor de 20, onde 20 é o número de viés/nós da Rede Neural. 
 */
const net = new brain.NeuralNetwork({ hiddenLayers: [20] });

/**
 ** Pegando o elemento "img" dos três objetos do jogo que o usuário poderá
 ** escolher.
 */
const elements = document.getElementById('main-elements').getElementsByTagName('img');

/**
 ** Variável do tipo "array" onde receberá o tipo do objeto do jogo.
 */
let getElementGame = new Array();

/**
 ** Variável que irá armazenar o número flutuante com a resposta da IA.
 */
let robotResponse;

/**
 ** Armazenará o destino da imagem do objeto escolhido pelo usuário.
 *? Exemplo: "assets/img/"
 */
let imageSrc;

/**
 ** Armazenará o destino da imagem do objeto escolhido pela IA.
 *? Exemplo: "assets/img/"
 */
let imageSrcIA;

/**
 ** Pegará o nome do objeto escolhido pelo usuário.
 */
let objectChoosed;

/**
 ** Pegará o nome do objeto escolhido pela IA.
 */
let objectChoosedIA;

/**
 ** Essa variável do tipo boolean será responsável por atualizar a página
 ** que no caso ela será setada como "true" no final do jogo.
 */
let gameEnd = false;

/**
 ** O método train será responsável de treinar a IA com os dados fornecidos
 ** fornecemos dois dados de input passará pelo treinamento da IA com 20 viés/nós
 ** como foi setado na declaração da classe no início da página e sairá em apenas
 ** um output.
 *? entrada de [0, 0] e saída de [0] = O usuário ganhará o jogo.
 *? entrada de [0, 1] e saída de [1] = A IA ganhará o jogo.
 *? entrada de [1, 0] e saída de [1] = A IA ganhará o jogo.
 *? entrada de [1, 1] e saída de [0] = O usuário ganhará o jogo.
 */
net.train([
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
]);

/**
 ** Para cada element "img" tera uma escuta do evento "click".
 */
for (const element of elements) {
    element.addEventListener('click', () => {
        /**
         ** Se a variável tiver mais de um elemento, será deletado todos os outros
         ** permanecendo apenas o último que o usuário clicou recentemente.
         */
        if (getElementGame.length > 0) {
            for (const element of getElementGame) {
                getElementGame.shift(element.index);
            }
        }

        /**
         ** Se o objeto não existir dentro do array ele será adicionado, senão será
         ** excluido e adicionado em seguida.
         */
        if (getElementGame.indexOf(element.getAttribute('data-element-game')) === -1) {
            getElementGame.push(element.getAttribute('data-element-game'));
        } else {
            getElementGame.shift(element.getAttribute('data-element-game'));
        }

        /**
         ** Se o objeto escolhido for Pedra, Papel, Tesoura será atribuido nas
         ** variáveis.
         *? robotResponse = Atribuirá o valor próximo de 1.
         *? imageSrc = Receberá o diretório da imagem do objeto.
         *? objectChoosed = Receberá o nome do objeto.
         *? imageSrcIA = Receberá o diretório da imagem do objeto para a IA.
         *? objectChoosedIA = Receberá o nome do objeto pela IA.
         */
        switch (getElementGame[0]) {
            case "stone":
                robotResponse = net.run([0, 1]);
                imageSrc = "assets/img/stone.png";
                objectChoosed = "Pedra";
                imageSrcIA = "assets/img/paper.png";
                objectChoosedIA = "Papel";
                break;

            case "paper":
                robotResponse = net.run([1, 0]);
                imageSrc = "assets/img/paper.png";
                objectChoosed = "Papel";
                imageSrcIA = "assets/img/scissor.png";
                objectChoosedIA = "Tesoura";
                break;

            case "scissor":
                robotResponse = net.run([0, 1]);
                imageSrc = "assets/img/scissor.png";
                objectChoosed = "Tesoura";
                imageSrcIA = "assets/img/stone.png";
                objectChoosedIA = "Pedra";
                break;

            default:
                break;
        }

        /**
         ** Criará o elemento "img" setará os atributos "src" e "id".
         */
        let imageObjectChoosed = document.createElement("img");
        imageObjectChoosed.setAttribute("src", imageSrc);
        imageObjectChoosed.setAttribute("id", "image-choosed-user");
        let parentUser = document.getElementById('response_choose_user');

        /**
         ** Se o elemento existir será deletado e adicionado novamente.
         */
        if (parentUser.querySelector('img')) {
            let childToRemove = document.getElementById('image-choosed-user');
            document.getElementById('response_choose_user').removeChild(childToRemove);
            document.getElementById('response_choose_user').appendChild(imageObjectChoosed);
        } else {
            document.getElementById('response_choose_user').appendChild(imageObjectChoosed);
        }

        /**
         ** Criará o elemento "p" e setará o atributo "id".
         */
        let responseText = document.createElement("p");
        responseText.setAttribute('id', "text-choosed");

        /**
         ** Se o valor da resposta da IA será próximo de 1, o usuário perderá
         ** o jogo e a IA ganhará. Caso contrário o usuário ganharia.
         */
        if (robotResponse > 0.7) {
            responseText.innerHTML = "Infelizmente você perdeu o jogo!";

            let imageObjectChoosed = document.createElement("img");
            imageObjectChoosed.setAttribute("src", imageSrcIA);
            imageObjectChoosed.setAttribute("id", "image-choosed-ia");
            let parentUser = document.getElementById('response_choose_ia');

            if (parentUser.querySelector('img')) {
                let childToRemove = document.getElementById('image-choosed-ia');
                document.getElementById('response_choose_ia').removeChild(childToRemove);
                document.getElementById('response_choose_ia').appendChild(imageObjectChoosed);
            } else {
                document.getElementById('response_choose_ia').appendChild(imageObjectChoosed);
            }
        } else {
            responseText.innerHTML = "Você ganhou o jogo, parabéns!";
        }

        /**
         ** Colocará o texto mostrando que o usuário perdeu o jogo.
         */
        let responseGame = document.getElementById('response_game');
        if (responseGame.querySelector('p')) {
            let childToRemove = document.getElementById('text-choosed');
            responseGame.removeChild(childToRemove);
            responseGame.appendChild(responseText);
        } else {
            responseGame.appendChild(responseText);
        }

        let textChoosedUser = document.getElementById('object-choosed-user');
        textChoosedUser.innerHTML = objectChoosed;

        let textChoosedIA = document.getElementById('object-choosed-ia')
        textChoosedIA.innerHTML = objectChoosedIA;

        /**
         ** Setará o fim do jogo para ter a atualização da página.
         */
        gameEnd = true;
    })
}

/**
 ** Após o jogo ter encerrado e ter se passado 7 segundos a página atualizará.
 */
setInterval(() => {
    if (gameEnd === true) {
        document.location.reload();
    }
}, 7000);
