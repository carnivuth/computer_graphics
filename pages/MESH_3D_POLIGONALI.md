---
id: MESH_3D_POLIGONALI
tags: []
aliases: 
index: 10
---

# MESH 3D POLIGONALI

In computer graphics gli oggetti 3D vengono approssimati da una rappresentazione della loro superficie detta **B-Rep** (*Boundary representation*) 
La superficie si assume sia una **[varietà](https://it.wikipedia.org/wiki/Variet%C3%A0_(geometria)) due-dimensionale(two-manifold)** (*l’intorno di ogni punto della superficie è omeomorfo ad un disco piano*)

Data questa rappresentazione di un oggetto 3D una Mesh 3D e una **approssimazione** per mezzo di poligoni (*in genere triangoli per semplificazione implementativa*)

## MESH TWO-MANIFOLD: VINCOLI

Per far si che anche la mesh che approssima la superficie sia two-manifold un lato non può essere condiviso da 3 o più facce, e $n$ facce che condividono un vertice devono formare un ventaglio

![](Pasted%20image%2020250102185820.png)

![](Pasted%20image%2020250102185829.png)

### NORMALE AD UNA FACCIA

La normale di una faccia e definita come il prodotto vettoriale fra due lati **consecutivi e non collineari**

$$
n= (V_3 - V_2)\times(V_2 - V_1)
$$

![](Pasted%20image%2020250102190013.png)

>[!WARNING] la normale e uscente dal front della faccia, occhio al verso

## MESH ORIENTABILE

Se la normale di tutti i poligoni di una mesh e rivolta verso la stessa direzione (*esterno/interno di una mesh*) allora si dice che la **mesh e orientabile**

![](Pasted%20image%2020250102190226.png)

>[!WARNING] Le facce di una mesh devono essere descritte in maniera coerente

## COERENZA DELLE FACCE

L’orientazione di due facce adiacenti è coerente **se i due vertici del loro lato in comune sono in ordine inverso**. Vuol dire che l’orientazione non cambia attraversando il lato in comune.

## MESH CHIUSA VS MESH APERTA

Una mesh aperta si contraddistingue da una mesh chiusa perché **presenta lati vertici e facce di bordo** 

![](Pasted%20image%2020250102191003.png)

## TOPOLOGIA E GEOMETRIA DI UNA MESH

Una mesh poligonale e' caratterizzata da una **geometria e da una topologia**:

| GEOMETRIA                                     | TOPOLOGIA                                    |
| --------------------------------------------- | -------------------------------------------- |
| come sono disposti i vertici nello spazio<br> | come i vertici sono connessi da lati e facce |

>[!WARNING] due mesh possono condividere la stessa geometria ma descrivere due modelli diversi per mezzo della loro topologia!

## MESH STORING

Le informazioni per comporre una mesh vengono salvate in maniera indicizzata

```mermaid
flowchart TD
A[Mesh]
B[lista di vertici]
C[coordinate di un vertice]
D[lista di facce]
E[riferimento ai vertici]
F[coordinate nello spazio texture]
G[informazione colore]
A --> B & D
B --> C & F & G
D --> E & G
```

### FORMATO [OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file)

Formato per il salvataggio di mesh 3D su disco commercializzato dalla Alias-Wavefront


## EDITING DI MESH 3D

L'editing di una mesh 3D e quel processo attraverso il quale si applicano modifiche a una mesh 3D aggiungendo rimuovendo facce/vertici/poligoni 

Le operazioni di editing che non alterano la topologia della mesh vengono detti **operatori di Eulero** alcuni esempi di tali operazioni sono:

- aggiunta/rimozione di un vertice
- aggiunta/rimozione di una faccia aggiungendo o eliminando un lato

### RAPPRESENTAZIONE COMODA PER L'EDITING: ADIACENZE

In fase di editing la rappresentazione per mezzo di facce e vertici non e ottimale in quanto ci si ritrova spesso a accedere a vertici e facce adiacenti ad altre, risulta comoda una struttura dati che tenga conto delle adiacenze

> struttura dati per la rappresentazione di lati

| name | start | end | left | right | pred | succ | pred | succ |
| ---- | ----- | --- | ---- | ----- | ---- | ---- | ---- | ---- |
| $a$  | $X$   | $Y$ | 1    | 2     | $b$  | $d$  | $e$  | $c$  |

![](Pasted%20image%2020250102194324.png)

[PREVIOUS](pages/SHADOWING.md) [NEXT](pages/XWINDOW_SYSTEM.md)