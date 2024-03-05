# TRASFORMAZIONI GEOMETRICHE

*richiamo algebra lineare di base*

operazioni che prendono in input un oggetto geometrico modificandone **posizione orientazione e dimensione** (ovvero la geometria dello stesso)

## TRASLAZIONE 

L'oggetto vede le proprie dimensioni aumentate rispetto all'origine del sistema di riferimento

$$
\begin{bmatrix}
p_x^{'} \\
p_y^{'} \\
\end{bmatrix} = 
\begin{bmatrix}
p_x \\
p_y \\
\end{bmatrix} +
\begin{bmatrix}
d_x \\
d_y \\
\end{bmatrix}
$$

![](Pasted%20image%2020240305164007.png)

## SCALA

ingrandimento di un oggetto in riferimento all'origine

$$
\begin{bmatrix}
p_x^{'} \\
p_y^{'} \\
\end{bmatrix} = 
\begin{bmatrix}
s_x & 0\\
0&s_y \\
\end{bmatrix} \bullet
\begin{bmatrix}
p_x \\
p_y \\
\end{bmatrix} 
$$

![](Pasted%20image%2020240305164110.png)

## ROTAZIONE

Rotazione rispetto all'origine degli assi

$$
\begin{bmatrix}
p_x^{'} \\
p_y^{'} \\
\end{bmatrix} = 
\begin{bmatrix}
cos(\theta) & -sin(\theta)\\
sin(\theta)&cos(\theta) \\
\end{bmatrix} \bullet
\begin{bmatrix}
p_x \\
p_y \\
\end{bmatrix} 
$$

![](Pasted%20image%2020240305164128.png)

## SPAZIO AFFINE

Estensione di uno spazio vettoriale per permettere la rappresentazione dei punti insieme ai vettori

In questo spazio sono definite le seguenti operazione

- $q = p+v$ con $p$ punto e $v$ vettore
- $u = q - p$ 
- $v = p - q$  

### COMBINAZIONE AFFINE
+
operazione che prende in input dei punti e restituisce in output dei punti definita come segue

$$
\displaylines{
p = a_1p_1 +a_2p_2 +a_3p_3 + \space ... \space a_np_n \space con\\
a_1 + a_2 +a_3 + \space ... \space a_n = 1
}
$$

### SISTEMA DI RIFERIMENTO IN UNO SPAZIO AFFINE (FRAME)

per rappresentare in maniera non ambigua punti e vettori si definisce un sistema di riferimento (coordinate omogenee) come segue 

un vettore e rappresentato come segue

$$
v = a_1v_1 +a_2v_2 +a_3v_3 
$$

un punto e rappresentato come

$$
p = a_1v_1 +a_2v_2 +a_3v_3 + O
$$
## TRASFORMAZIONI AFFINI IN SPAZI AFFINI

Per mezzo della rappresentazione in coordinate omogenee le trasformazioni affini diventano tutte trasformazioni lineari

$$
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

In questo modo possiamo sfruttare le proprietà di linearità per ottimizzare la computazione

In questo modo si possono computare combinazioni di trasformazioni lineari in maniera efficiente sfruttando le matrici inverse, in particolare si ha che :

- inversa traslazione $T^{-1}(d) =T(-d)$
- inversa scala $S^{-1}(s) =S(1/s_x,1/s_y,1/s_z,)$
- inversa rotazione $R^{-1}(\theta) =R(- \theta)$