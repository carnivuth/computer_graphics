# <%tp.file.title%>

## CONTENTS
<%* 
files=tp.app.vault.getFiles()
for (file of files){
	if((file.parent!=undefined && file.parent.name == "pages") || (file.parent.parent !=undefined && file.parent.parent.name== "pages")){
%>
- [<% file.basename%>](<% file.path%>)
<%*
}
}
%>