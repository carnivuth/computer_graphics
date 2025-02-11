---
id: ALGORITMI_RASTERIZZAZIONE
aliases:
tags: ["texture mapping","algoritmo di linea incrementale"]
index: 4
---

# Algoritmi di rasterizzazione

La rasterizzazione e un processo che dato un **poligono in coordinate schermo colora i pixel di quel dato poligono con un colore**, esistono due processi principali:

- rasterizzazione per mezzo di coordinate baricentriche
- rasterizzazione per mezzo di scan conversion

Inoltre queste vengono differenziate in base a **come il colore del pixel viene determinato**

- colore omogeneo
- texture (*immagine bidimensionale da applicare sull'oggetto*)

## Sistema di riferimento baricentrico

Dato un poligono in coordinate schermo definito come segue

![](assets/imgs/poligono_baricentrico.png)

allora e possible definire un nuovo sistema di riferimento basato sui **vertici del poligono**

$$
O' = p_1,u = p_2 - p_1,v = p_3 - p_1
$$

in questo sistema di riferimento tutti i punti vengono rappresentati da [combinazioni affini](trasformazioni_geometriche.md#COMBINAZIONE%20AFFINE) dei 3 vertici del poligono

$$
p = \alpha p_1 +\beta p_2 +\gamma p_3, \space con
$$
$$
1= \alpha + \beta + \gamma
$$

In coordinate baricentriche si ha che se un punto fa parte del poligono allora e vero che $\alpha,\beta,\gamma \geq 0$ di conseguenza determinare se un  punto fa parte del poligono si riduce a un confronto

```javascript
if(a >=0 && b >=0 && c >= 0){
	console.log("punto del poligono")
}else{
	console.log("punto non del poligono")
}
```

Inoltre questo approccio può essere implementato in parallelo per mezzo di architetture [SIMD](https://it.wikipedia.org/wiki/SIMD) 

### Recupero dell'informazione colore

Inoltre le coordinate baricentriche possono essere utilizzate per recuperare anche l'informazione del colore di un dato punto, date le coordinate baricentriche $\alpha,\beta,\gamma$ l'informazione colore può essere recuperata dallo spazio RGB dei colori

![](Pasted%20image%2020241214104134.png)

## Scan conversion

L'idea base di questo algoritmo consiste nell'identificare le sequenze orizzontali di pixel che fanno parte del triangolo, l'algoritmo si divide in due fasi

- identificazione delle intersezioni della linea con i lati del triangolo
- colorazione dei pixel fra le due intersezioni

Per identificare il prossimo pixel sulla linea si utilizza l'algoritmo di [linea incrementale](https://it.wikipedia.org/wiki/Algoritmo_della_linea_di_Bresenham)

## [Texture](texture_mapping.md) mapping

Il processo di texture mapping si occupa di applicare a un dato poligono un immagine sulla sua superficie, sfruttando un mapping tra i vertici di un poligono 3D e un immagine

![](Pasted%20image%2020241214154455.png)

Di conseguenza il problema si riduce ad **assegnare a ogni pixel il corretto punto della texture in questione**, questo può essere fatto per mezzo delle [coordinate baricentriche](#Sistema%20di%20riferimento%20baricentrico), costruendo un mapping fra le coordinate del poligono e le coordinate in spazio texture

Tuttavia non e detta che dato un punto del poligono **ci sia una corrispondenza con un pixel esatta della texture**

![](Pasted%20image%2020241214155219.png)

E necessario quindi determinare il colore da assegnare a un dato punto del triangolo,ci sono diverse strategie disponibili:

### Nearest neighbor

Il colore di un dato punto e dato dal pixel della texture più vicino alle coordinate del punto $p$

### Bilinear interpolation

Vengono considerati i 4 punti più vicini al punto $p$ Le cui componenti colore vengono pesate per determinare il colore del punto $p$

data la seguente interpolazione lineare in una dimensione come segue

![](Pasted%20image%2020241214160025.png)

$$
P(x) = f_0(1-x) + f_1x
$$

la interpolazione bilineare e di conseguenza realizzata come un interpolazione lineare di due interpolazioni lineari

![](Pasted%20image%2020241214160210.png)

di conseguenza si ha che:

$$
f_P= f_E(1-y)+ f_Fy
$$

con:

$$
f_E= f_A(1-x)+ f_Bx
$$
$$
f_F= f_D(1-x)+ f_Cx
$$

>[!NOTE] nel caso in cui il punto si trovi al centro dei 4 pixel piu vicini l'interpolazione bilineare si riduce a una media dei 4 pixel $f_P = \frac{f_A +f_B +f_C +f_D}{4}$

### Bi-cubic interpolation

Metodologia che prende in considerazione i $16$ pixel più vicini al punto in questione, le cui componenti vengono pesate per mezzo dell'interpolazione colore

![](Pasted%20image%2020241214160835.png)

>[!NOTE] e il compromesso più ragionevole tra calcolo e qualità nonché quello più utilizzato in molti software di grafica

[PREVIOUS](pages/real_time_rendering.md) [NEXT](pages/proiezione_prospettica.md)
