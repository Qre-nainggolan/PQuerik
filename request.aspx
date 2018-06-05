<%@ Page Language="vb" Debug="true" aspcompat=true %>
<%
	Dim requestResponse = ""
	Dim total = """total"":""2"""
	Dim results = "{""erik"":""Jakarta"",""yeni"":""Sumut"",""erikyeni"":""AMIN1""}," & _
				"{""erik"":""JakBar"",""yeni"":""Medan"",""erikyeni"":""AMIN2""}," & _
				"{""erik"":""Programmer"",""yeni"":""Bidan"",""erikyeni"":""AMIN3""}"
	requestResponse = "{" & total & ",""results"":[" & results & "]}"
	Response.Write(requestResponse)
%>