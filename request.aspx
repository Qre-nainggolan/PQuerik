<<<<<<< HEAD
<%@ Page Language="vb" Debug="true" aspcompat=true %>
<%
	Dim requestResponse = ""
	Dim total = """total"":""2"""
	Dim results = "{""erik"":""Jakarta"",""yeni"":""Sumut"",""erikyeni"":""AMIN1""}," & _
				"{""erik"":""JakBar"",""yeni"":""Medan"",""erikyeni"":""AMIN2""}," & _
				"{""erik"":""Programmer"",""yeni"":""Bidan"",""erikyeni"":""AMIN3""}"
	requestResponse = "{" & total & ",""results"":[" & results & "]}"
	Response.Write(requestResponse)
=======
<%@ Page Language="vb" Debug="true" aspcompat=true %>
<%
	Dim requestResponse = ""
	Dim total = """total"":""2"""
	Dim results = "{""Check1"":""Jakarta"",""Check2"":""Barat""}," & _
				"{""Check1"":""Kapuk"",""Check2"":""Cengkareng""}"
	requestResponse = "{" & total & ",""results"":[" & results & "]}"
	Response.Write(requestResponse)
>>>>>>> edca36fe4e62d8e01a5a533188528fef4274d5bc
%>