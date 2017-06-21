@Code
    ViewData("Title") = "Restricoes"

    Dim qtdRestricoes = Session("opcoes").restricoes
    Dim qtdVariaveis = Session("opcoes").variaveis
    Dim metodo = Session("opcoes").metodo
    Dim interacoes = Session("opcoes").interacoes
End Code
<link href="~/Content/Home/Restricoes.css" rel="stylesheet" />
<script src="~/Scripts/Restricoes.js"></script>
<input id="qtdVariaveis" type="hidden" value="@qtdVariaveis" />
<input id="qtdRestricoes" type="hidden" value="@qtdRestricoes" />
<input id="metodo" type="hidden" value="@metodo" />
<input id="interacoes" type="hidden" value="@interacoes" />
<div class="container" id="principal">
        <div id="funcoes" class="panel panel-success">
            <div class="panel-heading">
                <center>Persimplex</center>
            </div>
            <div class="panel-body">
                <center><h4>@IIf(metodo = "min", "Função Minimizar", "Função Maximizar")</h4></center>
                <br /> 
                <label>Função:</label>
                @for x As Integer = 1 To qtdVariaveis
                    If x <> 1 Then
                        @<span>+</span>
                    End If
                    @<input type="text" class="form-control input-sm input-restricoes restricao"/>
                    @<span>X<small>@x</small></span>
                Next

                <br /><br />
                <label>Restrições:</label>
                @for x As Integer = 1 To qtdRestricoes
                    @<div class="divRestricoes">
                        @for y As Integer = 1 To qtdVariaveis
                            If y <> 1 Then
                                @<span>+</span>
                            End If
                            @<input type="text" data-linha="@x" class="form-control input-sm input-restricoes" />
                            @<span>X<small>@y</small></span>
                        Next
                        <input type="text" class="form-control input-restricoes" disabled value="<=" />
                        <input type="text" data-z="@x" class="form-control input-restricoes z" />
                    </div>
                Next
            </div>
            <div Class="panel-footer">
                <input id="continuar" type = "submit" Class="btn btn-default" value="Continuar" />
            </div>
        </div>
        <div id="panel-resolucao" class="panel panel-success" style="display: none">
            <div class="panel-heading">
                <center>Resolução</center>
            </div>
            <div id="resolucao" class="panel-body"></div>
        </div>
    <div id="panel-solucao" class="panel panel-success" style="display: none">
        <div class="panel-heading">
            <center>Solução e Sensibilidade</center>
        </div>
        <div class="panel-body">
            <div id="solucao"></div>
            <div id="sensibilidade"></div>
        </div>
    </div>
</div>