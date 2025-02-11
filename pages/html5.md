---
id: HTML5
tags: ["canvas","webgl context"]
aliases: 
index: 11
---

# HTML5 funzioni grafiche 

HTML5 introdi estende e migliora le versioni HTML precedenti e introduce delle API (Application Programming Interface) per applicazioni
WEB complesse.

>Un documento HTML5
```html
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Example</title>
		<style>  </style>
	</head>
	<body>
		<p>Some text</p>
		<script> </script>
	</body>
</html>
```

## Elemento `<canvas>`

Per la programmazione grafica con un browser, la differenza più importante rispetto alle versioni precedenti di HTML è l’elemento Questo nuovo elemento permette un rendering all'interno di un browser.

##  Contesto di rendering

L'elemento `<canvas>`  supporta multiple API per il rendering grafico, e necessario specificarne una con il metodo

```javascript
canvas.getContext(contextId, args...)
// contensto di rendering bidimensionale
var context = canvas.getContext('2d');
// contesto di rendering webgl
var context = canvas.getContext('webgl');
```

## Sistema di Coordinate

All'elemento `<canvas>` (*area rettangolare all'interno del browser*) è associato un sistema di coordinate cartesiane ortogonali.
Il vertice alto a sinistra del canvas è l’origine $(0,0)$, l’asse $x$ punta a destra, l’asse $y$ punta in basso.

```text
// area del canvas
---------------------> // asse x
|
|
|
|
|
|
|
// asse y
```

>[!WARNING] Anche alla pagina del browser viene associato un sistema di coordinate cartesiane con origine in alto a sinistra.

### `<canvas>` vs superficie di disegno

La dimensione dell'elemento canvas non e la stessa della dimensione dell'area di disegno, in particolare se la prima viene modificata per mezzo di stili `css`

```html
<!DOCTYPE html>
<html>
<head>
	<title> </title>
	<style>
		#canvas {
			width: 600px;
			height: 300px;
		}
	</style>
</head>
<body>
	<!--in questo caso il canvas e grande 600x300 
	mentre l'area di disegno 300x150-->
	<canvas id='canvas' width='300' height='150'>
	Canvas not supported
	</canvas>
</body>
</html>
```

>[!ERROR] Se il canvas è più piccolo della superficie di disegno, punti a coordinate differenti potrebbero essere visualizzati come lo stesso pixel;

>[!ERROR] Se invece il canvas è più grande della superficie di disegno, il disegno di un punto potrebbe essere reso come più pixel.

[PREVIOUS](pages/mesh_poligonali.md) [NEXT](pages/xwindow_system.md)
