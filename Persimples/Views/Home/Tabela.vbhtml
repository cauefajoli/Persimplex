@Code
    Layout = Nothing

    Dim matriz = ViewBag.Matriz
End Code
<center><h4>@(ViewBag.Interacao & "ª") Interação</h4></center>
<table class="table">
    <thead>
        <tr>
            @For x As Integer = 0 To (matriz(0).Length - 1)
                @<th>@matriz(0)(x)</th>
            Next
        </tr>
    </thead>
    <tbody>
        @For linha As Integer = 1 To (matriz.Length - 1)
            @<tr>
                @For coluna As Integer = 0 To (matriz(linha).Length - 1)
                    @<td>@matriz(linha)(coluna)</td>
                Next
            </tr>
        Next
    </tbody>
</table>
