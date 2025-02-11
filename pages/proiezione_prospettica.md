---
id: PROIEZIONE_PROSPETTICA
tags: []
aliases:
index: 5
---

# Proiezione prospettica

Per poter applicare l'algoritmo [z-buffer](real_time_rendering.md#ALGORITMO%20Z-BUFFER) e necessario conoscere la **profondità di un pixel** all'interno del piano immagine una prima soluzione può essere:

Dati due punti $p_1,p_2$ di un segmento e le corrispettive proiezioni del piano immagine $p_{s1},p_{s2}$ si assegna come coordinata $z$ a un punto $p_s$ del segmento compreso tra $p_{s1},p_{s2}$ la coordinata $z$ del punto $p$ corrispondente al punto $p_s$

![](Pasted%20image%2020241214181040.png)

>[!NOTE] e la cosa più intuitiva da fare

Tuttavia questo sistema funziona solo se **la proiezione effettuata e parallela e non prospettica**

![](Pasted%20image%2020241214181235.png)

>[!ERROR] il cono di visione nel caso della proiezione prospettica non mantiene i rapporti fra le distanze

## Trasformare il piano dell'osservatore

Visto che il problema risiede nella struttura dello spazio 3D dell'osservatore l'idea e quella di creare una **trasformazione in grado di deformare il tronco di piramide dell'osservatore in un cubo** dove poter applicare una proiezione parallela.
La trasformazione deve avere le seguenti proprietà:

- deve mantenere l'ordine di profondità
- trasformare linee in linee
- trasformare piani in piani

$$
\begin{cases}
x_s=x_e/z_e \\
y_s=y_e/z_e \\
z_s=\alpha + \frac{\beta}{z_e} \\
\end{cases}
$$

La trasformazione di cui sopra presenta tutte le proprietà richieste, quindi dato per esempio un cono di visione di $90^{\bullet}$   (*che può essere ottenuto mediante una trasformazione di scala da un cono di visione qualunque*)

![](Pasted%20image%2020241217124618.png)

si ha che le linee della forma $y=mz$ vengono ruotate rispetto al punto $y=m$ mantenendo l'allineamento tra i punti

### Scelta dei parametri $\alpha,\beta$

I parametri $\alpha,\beta$ possono essere scelti accuratamente per far si di ottenere un intervallo comodo per i valori di $z_s$, per'esempio dato un intervallo della coordinata z di $[A,B]$ si ha che i valori di alpha e beta corrispondenti sono

$$
\begin{cases}
\beta = -\frac{2AB}{B-A} \\
\alpha = \frac{A + B}{B-A} \\
\end{cases}
$$

>[!NOTE] ci si arriva impostando il sistema in maniera tale che i punti $A,B$ trasformati valgano $-1,1$

Si ottiene il seguente spazio

![](Pasted%20image%2020241217130133.png)

[PREVIOUS](pages/algoritmi_rasterizzazione.md) [NEXT](pages/clipping.md)
