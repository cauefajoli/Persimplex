var loops = 1;
var MAX_LOOPS = parseInt($("#interacoes").val());
var STOPBYLOOP = MAX_LOOPS + 1;
var matriz = [[]];
var interacao = 0;

$(document).ready(function () {
    var maximo = parseInt($("#interacoes").val());
    $("#continuar").click(function (e) {
        e.preventDefault();
        criaMatriz();
        while (continuarCalculo(maximo)) {
            calcular();
        }
        solucao();
        sensibilidade();
    })
    

})

function criaMatriz() {

    var qtdRestricoes = parseInt($("#qtdRestricoes").val());
    var qtdVariaveis = parseInt($("#qtdVariaveis").val());

    var z = [];
    $(".restricao").each(function () {
        z.push($(this).val());
    })

    
    matriz[0][0] = 'Linha';

    for (var i = 1; i <= z.length; i++)
        matriz[0].push('x' + i);


    for (var i = 1; i <= qtdRestricoes; i++)
        matriz[0].push('f' + i);

    matriz[0][matriz[0].length] = 'b';
    var countCol = 1;

    for (var i = 1; i <= qtdRestricoes; i++) {
        matriz.push(['f' + i]);
        countCol = 1;
        var variaveis = [];

        $('[data-linha="' + i + '"]').each(function () {
            variaveis.push($(this).val());
        })

        for (var j = 0; j < z.length; j++) {
            if (variaveis[j])
                matriz[i][countCol++] = Number(variaveis[j]);
            else
                matriz[i][countCol++] = 0;
        }

        for (var j = 0; j < qtdRestricoes; j++) {
            matriz[i][countCol] = Number((matriz[i][0] == matriz[0][countCol] ? 1 : 0));
            countCol++;
        }

        matriz[i][countCol] = parseInt($('[data-z="' + i + '"]').val());
    }
    matriz.push(['Z']);

    countCol = 1;
    for (var i = 0; i < z.length; i++) {
        if (z[i])
            matriz[matriz.length - 1][countCol++] = Number(-1 * z[i]);
        else
            matriz[matriz.length - 1][countCol++] = 0;
    }

    for (var j = 0; j < qtdRestricoes; j++)
        matriz[matriz.length - 1][countCol++] = 0;
    matriz[matriz.length - 1][countCol] = 0;

    interacao++;

    geraTabela(matriz,interacao);
}

function geraTabela(matriz,interacao) {
    $.ajax({
        url: "/Home/geraTabela",
        data: { matriz: matriz, interacao: interacao },
        type: "POST",
        success: function (data) {
            $("#funcoes").fadeOut();
            $("#resolucao").append(data);
            $("#panel-resolucao").fadeIn();
        }
    })
}

function continuarCalculo(maximo) {
    debugger
    if (interacao >= maximo) {
        return false
    }
    var linhaZ = matriz.length - 1;
    var totalColunas = matriz[linhaZ].length - 1;

    for (var i = 1; i < totalColunas; i++)
        if (matriz[linhaZ][i] < 0)
            return true;

    return false;
}

function calcular() {
    var linhaZ = matriz.length - 1;
    var totalColunas = matriz[linhaZ].length - 2;
    var totalLinhas = matriz.length - 2;
    var entra = 0;
    var minEntraValor = Number.MAX_VALUE;

    for (var i = 1; i <= totalColunas; i++)
        if (matriz[linhaZ][i] < minEntraValor) {
            entra = i;
            minEntraValor = matriz[linhaZ][i];
        }

    var sai = 0;
    var iminSaiValor = Number.MAX_VALUE;

    for (var i = 1; i <= totalLinhas; i++) {
        var bValue = matriz[i][matriz[0].length - 1];
        var colValue = matriz[i][entra];

        if (colValue <= 0)
            continue;

        var result = bValue / colValue;
        if (result < iminSaiValor) {
            sai = i;
            iminSaiValor = result;
        }
    }

    if (sai == 0) {
        loops = STOPBYLOOP;
        return;
    }

    console.log("Entra na base: " + matriz[0][entra]);
    console.log("Sai da base:" + matriz[sai][0]);

    matriz[sai][0] = matriz[0][entra];

    var pivo = matriz[sai][entra];

    for (var i = 1; i < matriz[0].length; i++)
        matriz[sai][i] = matriz[sai][i] / pivo;

    for (var row = 1; row < matriz.length; row++) {
        if (row == sai || matriz[row][entra] == 0)
            continue;

        var fator = -1 * matriz[row][entra];

        for (var column = 1; column < matriz[row].length; column++)
            matriz[row][column] = (matriz[sai][column] * fator) + matriz[row][column];
    }
    interacao++;
    geraTabela(matriz,interacao);
}


function solucao() {
    debugger
    var header = '<h4 class="text-center">Variáveis e Valores</h4>';
    var paragrafos = '';
    for (var i = 1; i < (matriz[0].length - 1); i++) {
        var solucao = (matriz[0][i][0] == 'x' ? 'Produção de ' : 'Folga da restrição ') + matriz[0][i];
        var val = 0;
        for (var rowIndex = 1; rowIndex < (matriz.length - 1); rowIndex++)
            if (matriz[0][i] == matriz[rowIndex][0])
                val = matriz[rowIndex][matriz[0].length - 1];
        paragrafos += '<div class="item">' + solucao + ' = ' + val + '</div>';
    }
    $("#solucao").html("<div class='ui list'>" + header + paragrafos + "</div>");
    $("#panel-solucao").fadeIn();
};


function sensibilidade() {
    debugger
    var paragraphs = '';
    var paragraphsX = '';
    var qtdRestricoes = parseInt($("#qtdRestricoes").val());
    var subjects = document.querySelectorAll('#subjects .restrictionV');

    //Calcula Sensibilidade das variaveis de folga
    var subjectIndex = (matriz[0].length - qtdRestricoes) - 1;
    console.log(subjectIndex);
    for (var index = 0; index < qtdRestricoes; index++ , subjectIndex++) {
        var restricao = 'f' + (index + 1);
        var original = Number($("[data-z=" + (index + 1) + "]").val());
        var minDelta = Number.POSITIVE_INFINITY;
        var maxDelta = Number.NEGATIVE_INFINITY;

        var shadowPrice = matriz[matriz.length - 1][subjectIndex];

        if (shadowPrice != 0) {
            for (var rowIndex = 1; rowIndex < (matriz.length - 1); rowIndex++) {
                var functionRow = Number(matriz[rowIndex][subjectIndex]);
                var bRow = Number(matriz[rowIndex][matriz[0].length - 1]);

                if (functionRow == 0)
                    continue;

                var delta = (-1 * bRow) / functionRow;

                if (delta > maxDelta)
                    maxDelta = delta;

                if (delta < minDelta)
                    minDelta = delta;
            }
            minDelta += original;
            maxDelta += original;
            paragraphs += '<tr><td>' + restricao + '</td><td>' + original + '</td><td>' + shadowPrice + '</td><td>' + minDelta + '</td><td>' + maxDelta + '</td></tr>';
        } else {
            paragraphs += '<tr><td>' + restricao + '</td><td>' + original + '</td><td>' + shadowPrice + '</td><td>...</td></td>';
        }
    }
    //Calcula Sensibilidade das variaveis de Decisão
    var z = [];
    $(".restricao").each(function () {
        z.push($(this).val());
    })
    var decisionIndex = z.length;
    console.log(decisionIndex);
    jQuery.each(z, function (index, value) {
        var decision = 'x' + (index + 1);
        var originalX = value;
        var minDeltaX = Number.POSITIVE_INFINITY;
        var maxDeltaX = Number.NEGATIVE_INFINITY;
        var shadowPriceX = matriz[matriz.length - 1][index + 1];
        if (shadowPriceX != 0) {
            for (var i = 1; i < (matriz.length - 1); i++) {
                var functionRow = Number(matriz[i][index + 1]);
                var b = Number(matriz[i][matriz[0].length - 1]);

                if (functionRow == 0)
                    continue;

                var deltaX = (-1 * b) / functionRow;

                if (deltaX > maxDeltaX)
                    maxDeltaX = deltaX;

                if (deltaX < minDeltaX)
                    minDeltaX = deltaX;
            }
            minDeltaX += originalX;
            maxDeltaX += originalX;
            paragraphsX += '<tr><td>' + decision + '</td><td>' + originalX + '</td><td>' + shadowPriceX + '</td><td>' + minDeltaX + '</td><td>' + maxDeltaX + '</td></tr>';
        } else {
            paragraphsX += '<tr><td>' + decision + '</td><td>' + originalX + '</td><td>' + shadowPriceX + '</td><td>Alterações são insignificantes</td></td>';
        }
    });


    $("#sensibilidade").html("<table class='ui teal table'>" +
        "<thead><tr><th>Sensibilidade</th>" +
        "<th>Original</th>" +
        "<th>Preço Sombra</th>" +
        "<th>Menor</th>" +
        "<th>Maior</th>" +
        "</tr></thead>" + paragraphs + "" + paragraphsX + "</tables>");
}