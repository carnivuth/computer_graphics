---
index: 1
id: trasformazioni_geometriche
tags: ["trasformazioni geometriche di base","rotazione","traslazione","scala","trasformazione affine","spazio affine"]
aliases: 
---

# Trasformazioni geometriche

Le trasformazioni geometriche sono operazioni che prendono in input un oggetto e ne modificano **posizione orientazione e dimensione** (*ovvero la geometria dello stesso*)

>[!NOTE] Ma cos'e' un oggetto 3D?

## Oggetto 3D

Un oggetto 3D e un elemento di uno spazio cartesiano tridimensionale con sistema di riferimento destrorso **descritto dalle coordinate dei suoi vertici**

## Trasformazioni bidimensionali

Di seguito le trasformazioni bidimensionali di base

| **TRASFORMAZIONE** | DESCRIZIONE                                                                                                              | OPERAZIONE MATRICIALE IN AMBIENTE 2D                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TRASLAZIONE**    | modifica le coordinate dei vertici per far si che l'oggetto si trovi in una posizione diversa nel sistema di riferimento | $\begin{bmatrix} p_x^{'} \\ p_y^{'} \\ \end{bmatrix} =  \begin{bmatrix} p_x \\ p_y \\ \end{bmatrix} + \begin{bmatrix} d_x \\ d_y \\ \end{bmatrix}$                                                 |
| **SCALA**          | varia le dimensioni dell'oggetto                                                                                         | $\begin{bmatrix} p_x^{'} \\ p_y^{'} \\ \end{bmatrix} =  \begin{bmatrix} s_x & 0\\ 0&s_y \\ \end{bmatrix} \bullet \begin{bmatrix} p_x \\ p_y \\ \end{bmatrix}$                                      |
| **ROTAZIONE**      | Rotazione rispetto all'origine degli assi                                                                                | $\begin{bmatrix} p_x^{'} \\ p_y^{'} \\ \end{bmatrix} =  \begin{bmatrix} cos(\theta) & -sin(\theta)\\ sin(\theta)&cos(\theta) \\ \end{bmatrix} \bullet \begin{bmatrix} p_x \\ p_y \\ \end{bmatrix}$ |

## Trasformazione lineare

Dall'algebra, una trasformazione lineare in uno spazio vettoriale a 3 dimensioni può essere descritta come segue

$$
\begin{bmatrix}
u_x^{'} \\
u_y^{'} \\
u_z^{'} \\
\end{bmatrix} =
\begin{bmatrix}
a_{1,1} & a_{1,2} & a_{1,3} \\
a_{2,1} & a_{2,2} & a_{2,3} \\
a_{3,1} & a_{3,2} & a_{3,3} \\
\end{bmatrix} \bullet
\begin{bmatrix}
u_x \\
u_y \\
u_z \\
\end{bmatrix}
$$

## Trasformazione affine

Una trasformazione affine e una [trasformazione lineare](#trasformazione%20lineare) seguita da una traslazione

$$
\begin{bmatrix}
u_x^{'} \\
u_y^{'} \\
u_z^{'} \\
\end{bmatrix} =
\begin{bmatrix}
a_{1,1} & a_{1,2} & a_{1,3} \\
a_{2,1} & a_{2,2} & a_{2,3} \\
a_{3,1} & a_{3,2} & a_{3,3} \\
\end{bmatrix} \bullet
\begin{bmatrix}
u_x \\
u_y \\
u_z \\
\end{bmatrix} +
\begin{bmatrix}
\delta_x \\
\delta_y \\
\delta_z \\
\end{bmatrix}
$$

## Spazio affine

Per permettere la rappresentazione in uno spazio vettoriale dei punti si introduce lo spazio affine, con le seguenti operazioni aggiuntive:

- $q = p+v$ con $p$ punto e $v$ vettore
- $u = q - p$
- $v = p - q$

> [!ERROR] l'operazione punto + punto non e' definita

# Combinazione affine

[combinazione lineare](#Trasformazione%20lineare) che prende in input dei punti e restituisce in output dei punti in cui **i coefficienti hanno somma $1$**

$$
p = a_1p_1 +a_2p_2 +a_3p_3 + \space ... \space a_np_n \space con\\
$$
$$
a_1 + a_2 +a_3 + \space ... \space a_n = 1
$$

>[!NOTE] nel caso in cui $a_i \in [0-1) \forall \space i$ allora si parla di **combinazione convessa**

### Sistema di riferimento in uno spazio affine (frame)

per rappresentare in maniera non ambigua punti e vettori si definisce un sistema di riferimento (*coordinate omogenee*) dove viene eletta una quadrupla $<v1,v2,v3,\Theta>$ dove:

- $<v1,v2,v3>$ sono una **base vettoriale dello spazio**
- $\Theta$ e il **punto di origine**

si ha di conseguenza che i vettori sono rappresentati dalla tripletta delle coordinate $v = a_1v_1 +a_2v_2 +a_3v_3$, mentre un punto e rappresentato considerando anche il punto di origine $p = a_1v_1 +a_2v_2 +a_3v_3 + O$

Si ottiene di conseguenza uno spazio dove punti e vettori sono caratterizzati da quadruple (*dove il 4 elemento ammette solo valori $0/1$*), e possono essere rappresentati dal prodotto tra la quadrupla di origine e il vettore delle coordinate

$$
punto/vettore=
\begin{bmatrix}
v_{1,1} & v_{1,2} & v_{1,3} & 0 \\
v_{2,1} & v_{2,2} & v_{2,3} & 0 \\
v_{3,1} & v_{3,2} & v_{3,3} & 0 \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \bullet
\begin{bmatrix}
u_x \\
u_y \\
u_z \\
0/1 \\
\end{bmatrix}
$$

>[!NOTE] in questa rappresentazione i vettori non mostrano nella 4 riga il valore $0$ in modo da annullare il punto originario

## Trasformazioni affini in spazi affini

Per mezzo della rappresentazione in coordinate omogenee le trasformazioni affini diventano tutte trasformazioni lineari

$$
\begin{bmatrix}
u_x^{'} \\
u_y^{'} \\
u_z^{'} \\
\end{bmatrix} =
\begin{bmatrix}
a_{1,1} & a_{1,2} & a_{1,3} \\
a_{2,1} & a_{2,2} & a_{2,3} \\
a_{3,1} & a_{3,2} & a_{3,3} \\
\end{bmatrix} \bullet
\begin{bmatrix}
u_x \\
u_y \\
u_z \\
\end{bmatrix} +
\begin{bmatrix}
\delta_x \\
\delta_y \\
\delta_z \\
\end{bmatrix} \Rightarrow
\begin{bmatrix}
p_x^{'} \\
p_y^{'} \\
p_z^{'} \\
1 \\
\end{bmatrix} =
\begin{bmatrix}
a_{11} &a_{12} &a_{13} & d_x \\
a_{21} &a_{22} &a_{23} & d_y \\
a_{31} &a_{32} &a_{33} & d_z \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \bullet
\begin{bmatrix}
p_x \\
p_y \\
p_z \\
1 \\
\end{bmatrix} 
$$

I vantaggi di poter utilizzare trasformazioni lineari sono molteplici, si può ottimizzare la computazione sfruttando le proprietà di linearità, inoltre le trasformazioni possono essere combinate in un unica matrice che può essere applicata in più punti

 [NEXT](pages/trasformazioni_vista.md)
