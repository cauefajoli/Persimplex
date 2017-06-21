@Code
    ViewData("Title") = "Persimples"
End Code
<link href="~/Content/Home/Home.css" rel="stylesheet" />
<div class="container" id="principal">
    <form method="post" action="/Home/Restricoes">
        <div class="panel panel-success">
            <div class="panel-heading">
                <center>Persimplex</center>
            </div>
            <div class="panel-body">
                <span>Método:</span>
                <input value="min" type="radio" name="metodo" />
                <span>Minimizar</span>
                <input value="max" type="radio" name="metodo" checked/>
                <span>Maximizar</span>
                <br />
                <br />
                <span>Quantidade de interações:</span>
                <input type="number" class="form-control" name="interacoes" />
                <br />
                    <span>Quantidade de variáveis de decisão:</span>
                    <input type="number" class="form-control" name="qtdVariaveis" />
                <br />
                
                    <span>Quantidade de restrições:</span>
                    <input type="number" class="form-control" name="qtdRestricoes" />
            </div>
            <div class="panel-footer">
                <input type="submit" class="btn btn-default" value="Continuar" />
            </div>
        </div>
    </form>
</div>