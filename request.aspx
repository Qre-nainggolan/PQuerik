<%@ Page Language="vb" Debug="true" aspcompat=true %>
<%
	Dim requestResponse = ""
	Dim total = """total"":""2"""
	Dim results = "{""Check1"":""Jakarta"",""Check2"":""Barat""}," & _
				"{""Check1"":""Kapuk"",""Check2"":""Cengkareng""}"
	requestResponse = "{" & total & ",""results"":[" & results & "]}"
	Response.Write(requestResponse)
%>