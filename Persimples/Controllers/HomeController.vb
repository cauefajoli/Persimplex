Imports System.Web.Mvc

Namespace Controllers
    Public Class HomeController
        Inherits Controller

        ' GET: Home
        Function Index() As ActionResult
            Return View()
        End Function
        <HttpPost>
        Public Function Restricoes(qtdVariaveis As String, qtdRestricoes As String, metodo As String, interacoes As Integer) As ActionResult
            Dim opcoes As New Opcoes
            opcoes.variaveis = Convert.ToInt32(qtdVariaveis)
            opcoes.restricoes = Convert.ToInt32(qtdRestricoes)
            opcoes.metodo = metodo
            opcoes.interacoes = Convert.ToInt32(interacoes)
            Session("opcoes") = opcoes
            Return View()
        End Function
        <HttpPost>
        Public Function geraTabela(matriz()() As String, interacao As Integer) As ActionResult
            ViewBag.Matriz = matriz
            ViewBag.Interacao = interacao
            Return View("Tabela")
        End Function
    End Class
End Namespace